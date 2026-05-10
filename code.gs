
/**
 * BACKEND GOOGLE APPS SCRIPT (SPMB INTEGRATION)
 * Masukkan kode ini di Extensions > Apps Script pada Google Spreadsheet Anda.
 */

const SPREADSHEET_ID = '112BPF60flQmTDayye0u2lAbajiHrOEBrLzb6sNoBrA0';
const FOLDER_ID_DRIVE = '1UVOQ4gg0BIscwW3Nmbu32uo_SEIuI9nq'; 
const TEMPLATE_DOC_ID = '1h5QMTjNTIds9myv4PS1to7lVhSLykO9j3vnt41ZPXB8'; 

function getJadwalKonfigurasi(group) {
  const daftarJadwal = {
    "1": "Senin, 13 Juli 2026 - 08:00 WIB",
    "2": "Selasa, 14 Juli 2026 - 08:00 WIB",
    "3": "Rabu, 15 Juli 2026 - 08:00 WIB",
    "4": "Kamis, 16 Juli 2026 - 08:00 WIB",
    "5": "Jumat, 17 Juli 2026 - 08:00 WIB"
  };
  return daftarJadwal[group.toString()] || "Akan diumumkan melalui WhatsApp";
}

function doPost(e) {
  try {
    const requestData = JSON.parse(e.postData.contents);
    const action = requestData.action;
    const payload = requestData.payload;

    if (action === 'register') return handleRegistration(payload);
    if (action === 'list') return getRegistrations();

    return responseSuccess({ message: 'Action not found' });
  } catch (err) {
    return responseError(err.toString());
  }
}

function handleRegistration(data) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheets()[0];
  const folder = DriveApp.getFolderById(FOLDER_ID_DRIVE);
  
  const lastRow = sheet.getLastRow();
  const nextNumber = lastRow + 1; 
  const regNo = "SPMB-2026-" + ("000" + nextNumber).slice(-4);
  
  const group = Math.floor((nextNumber - 1) / 200) + 1;
  const jadwal = getJadwalKonfigurasi(group);

  // Upload berkas (Wajib & Opsional)
  const docLinks = {};
  const allFiles = ['akta', 'kk', 'nisn', 'rapor', 'ijazahDiniyah', 'kip', 'pkh', 'kks', 'bpjs'];
  allFiles.forEach(key => {
    if (data.dokumen[key] && data.dokumen[key].includes('base64,')) {
      docLinks[key] = uploadBase64File(data.dokumen[key], key.toUpperCase() + "-" + data.nama.toUpperCase(), folder);
    } else {
      docLinks[key] = "-";
    }
  });

  // Generate PDF
  const pdfUrl = generatePdf(regNo, data, jadwal, folder);

  // Menyusun baris LENGKAP (Total seluruh field di Form)
  const rowData = [
    new Date(),           // 0: Timestamp
    regNo,                // 1: No Pendaftaran
    data.nama,            // 2: Nama Siswa
    data.nik,             // 3: NIK Siswa
    data.nisn,            // 4: NISN Siswa
    data.telepon,         // 5: Telepon Siswa
    data.tempatLahir,     // 6: Tempat Lahir Siswa
    data.tanggalLahir,    // 7: Tanggal Lahir Siswa
    data.jenisKelamin,    // 8: Jenis Kelamin
    data.agama,           // 9: Agama
    data.asalSekolah,     // 10: Sekolah Asal
    data.npsnSekolah,     // 11: NPSN Sekolah
    data.alamat,          // 12: Alamat (Jalan/Dusun)
    data.desa,            // 13: Desa
    data.kecamatan,       // 14: Kecamatan
    data.kabupaten,       // 15: Kabupaten
    data.kodePos,         // 16: Kode Pos
    data.statusKeluarga,  // 17: Status dalam Keluarga
    data.anakKe,          // 18: Anak Ke
    data.jumlahSaudara,   // 19: Jumlah Saudara
    data.nomorKK,         // 20: Nomor KK
    
    // DATA AYAH (21-26)
    data.ayah.nama, 
    data.ayah.nik, 
    data.ayah.pendidikan, 
    data.ayah.pekerjaan, 
    data.ayah.penghasilan, 
    data.ayah.telepon,
    
    // DATA IBU (27-32)
    data.ibu.nama, 
    data.ibu.nik, 
    data.ibu.pendidikan, 
    data.ibu.pekerjaan, 
    data.ibu.penghasilan, 
    data.ibu.telepon,
    
    // DATA WALI (33-38)
    (data.wali && data.wali.status === 'Ada Wali') ? data.wali.nama : "-", 
    (data.wali && data.wali.status === 'Ada Wali') ? data.wali.nik : "-", 
    (data.wali && data.wali.status === 'Ada Wali') ? data.wali.pendidikan : "-", 
    (data.wali && data.wali.status === 'Ada Wali') ? data.wali.pekerjaan : "-", 
    (data.wali && data.wali.status === 'Ada Wali') ? data.wali.penghasilan : "-", 
    (data.wali && data.wali.status === 'Ada Wali') ? data.wali.telepon : "-",
    
    jadwal, // 39
    pdfUrl, // 40
    
    // DOKUMEN (41-49)
    docLinks.akta, docLinks.kk, docLinks.nisn, docLinks.rapor, docLinks.ijazahDiniyah, docLinks.kip, docLinks.pkh, docLinks.kks, docLinks.bpjs
  ];
  
  sheet.appendRow(rowData);

  return responseSuccess({
    nomorPendaftaran: regNo,
    jadwalSeleksi: jadwal,
    pdfUrl: pdfUrl
  });
}

function generatePdf(regNo, data, jadwal, folder) {
  try {
    const templateFile = DriveApp.getFileById(TEMPLATE_DOC_ID);
    const copy = templateFile.makeCopy("BUKTI-" + regNo + "-" + data.nama.toUpperCase(), folder);
    const doc = DocumentApp.openById(copy.getId());
    const body = doc.getBody();

    const replacements = {
      '{{Nomor_Pendaftaran}}': regNo,
      '{{Nama}}': data.nama,
      '{{NIK}}': data.nik,
      '{{NISN}}': data.nisn,
      '{{Tempat_Tanggal_Lahir}}': data.tempatLahir + ", " + data.tanggalLahir,
      '{{Jenis_Kelamin}}': data.jenisKelamin,
      '{{Nomor_Telepon}}': data.telepon,
      '{{Asal_Sekolah}}': data.asalSekolah,
      '{{Alamat_Lengkap}}': data.alamat + ", Desa " + data.desa + ", Kec. " + data.kecamatan + ", Kab. " + data.kabupaten,
      '{{Jadwal_Seleksi}}': jadwal
    };

    for (let key in replacements) {
      body.replaceText(key, replacements[key]);
    }

    doc.saveAndClose();
    const pdf = copy.getAs(MimeType.PDF);
    const pdfFile = folder.createFile(pdf);
    pdfFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    copy.setTrashed(true);
    return pdfFile.getUrl();
  } catch (e) {
    return "Error PDF: " + e.toString();
  }
}

function uploadBase64File(base64Data, fileName, folder) {
  try {
    const splitData = base64Data.split(',');
    const contentType = splitData[0].match(/:(.*?);/)[1];
    const byteData = Utilities.base64Decode(splitData[1]);
    const blob = Utilities.newBlob(byteData, contentType, fileName);
    const file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    return file.getUrl();
  } catch (e) {
    return "Error Upload: " + e.toString();
  }
}

function getRegistrations() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheets()[0];
  const data = sheet.getDataRange().getValues();
  // Pemetaan index disesuaikan dengan urutan rowData baru
  const list = data.slice(1).map((row, i) => ({
    id: i,
    nomorPendaftaran: row[1],
    nama: row[2],
    nik: row[3],
    nisn: row[4],
    telepon: row[5],
    asalSekolah: row[10],
    jadwalSeleksi: row[39], 
    pdfUrl: row[40]
  }));
  return responseSuccess({ list });
}

function responseSuccess(data) {
  return ContentService.createTextOutput(JSON.stringify({ success: true, ...data })).setMimeType(ContentService.MimeType.JSON);
}

function responseError(msg) {
  return ContentService.createTextOutput(JSON.stringify({ success: false, error: msg })).setMimeType(ContentService.MimeType.JSON);
}

}
