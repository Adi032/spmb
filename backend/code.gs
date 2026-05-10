/**
 * BACKEND GOOGLE APPS SCRIPT (SPMB INTEGRATION)
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

  return daftarJadwal[group.toString()] || 
         "Akan diumumkan melalui WhatsApp";
}

function doPost(e) {
  try {

    if (!e || !e.postData || !e.postData.contents) {
      return responseError("Request kosong");
    }

    const requestData = JSON.parse(e.postData.contents);

    const action = requestData.action || '';
    const payload = requestData.payload || {};

    switch(action) {

      case 'register':
        return handleRegistration(payload);

      case 'list':
        return getRegistrations();

      default:
        return responseError("Action tidak ditemukan");
    }

  } catch (err) {

    return responseError(
      "SERVER ERROR : " + err.toString()
    );
  }
}

function handleRegistration(data) {

  try {

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheets()[0];
    const folder = DriveApp.getFolderById(FOLDER_ID_DRIVE);

    const lastRow = sheet.getLastRow();
    const nextNumber = lastRow;

    const regNo =
      "SPMB-2026-" +
      ("0000" + nextNumber).slice(-4);

    const group =
      Math.floor((nextNumber - 1) / 200) + 1;

    const jadwal =
      getJadwalKonfigurasi(group);

    // =========================
    // UPLOAD FILE
    // =========================

    const docLinks = {};

    const allFiles = [
      'akta',
      'kk',
      'nisn',
      'rapor',
      'ijazahDiniyah',
      'kip',
      'pkh',
      'kks',
      'bpjs'
    ];

    if (!data.dokumen) {
      data.dokumen = {};
    }

    allFiles.forEach(key => {

      try {

        if (
          data.dokumen[key] &&
          data.dokumen[key].indexOf('base64,') !== -1
        ) {

          docLinks[key] = uploadBase64File(
            data.dokumen[key],
            key + "-" + data.nama,
            folder
          );

        } else {

          docLinks[key] = "-";
        }

      } catch(err) {

        docLinks[key] =
          "UPLOAD GAGAL";
      }

    });

    // =========================
    // GENERATE PDF
    // =========================

    const pdfUrl =
      generatePdf(
        regNo,
        data,
        jadwal,
        folder
      );

    // =========================
    // SIMPAN SHEET
    // =========================

    const rowData = [[

      new Date(),
      regNo,

      data.nama || '',
      data.nik || '',
      data.nisn || '',
      data.telepon || '',

      data.tempatLahir || '',
      data.tanggalLahir || '',

      data.jenisKelamin || '',
      data.agama || '',

      data.asalSekolah || '',
      data.npsnSekolah || '',

      data.alamat || '',
      data.desa || '',
      data.kecamatan || '',
      data.kabupaten || '',
      data.kodePos || '',

      data.statusKeluarga || '',
      data.anakKe || '',
      data.jumlahSaudara || '',

      data.nomorKK || '',

      // AYAH
      data.ayah?.nama || '',
      data.ayah?.nik || '',
      data.ayah?.pendidikan || '',
      data.ayah?.pekerjaan || '',
      data.ayah?.penghasilan || '',
      data.ayah?.telepon || '',

      // IBU
      data.ibu?.nama || '',
      data.ibu?.nik || '',
      data.ibu?.pendidikan || '',
      data.ibu?.pekerjaan || '',
      data.ibu?.penghasilan || '',
      data.ibu?.telepon || '',

      // WALI
      data.wali?.nama || '-',
      data.wali?.nik || '-',
      data.wali?.pendidikan || '-',
      data.wali?.pekerjaan || '-',
      data.wali?.penghasilan || '-',
      data.wali?.telepon || '-',

      jadwal,
      pdfUrl,

      docLinks.akta,
      docLinks.kk,
      docLinks.nisn,
      docLinks.rapor,
      docLinks.ijazahDiniyah,
      docLinks.kip,
      docLinks.pkh,
      docLinks.kks,
      docLinks.bpjs

    ]];

    // lebih cepat dari appendRow
    sheet
      .getRange(
        sheet.getLastRow() + 1,
        1,
        1,
        rowData[0].length
      )
      .setValues(rowData);

    SpreadsheetApp.flush();

    return responseSuccess({
      nomorPendaftaran: regNo,
      jadwalSeleksi: jadwal,
      pdfUrl: pdfUrl
    });

  } catch(err) {

    return responseError(
      "REGISTRATION ERROR : " + err.toString()
    );
  }
}

function uploadBase64File(base64Data, fileName, folder) {

  try {

    const parts = base64Data.split(',');

    if (parts.length < 2) {
      return "FORMAT BASE64 SALAH";
    }

    const contentType =
      parts[0].match(/:(.*?);/)[1];

    // Batasi ukuran maksimal 5MB
    const size =
      Utilities.base64Decode(parts[1]).length;

    if (size > 5 * 1024 * 1024) {
      return "FILE TERLALU BESAR";
    }

    const blob = Utilities.newBlob(
      Utilities.base64Decode(parts[1]),
      contentType,
      fileName
    );

    const file = folder.createFile(blob);

    file.setSharing(
      DriveApp.Access.ANYONE_WITH_LINK,
      DriveApp.Permission.VIEW
    );

    return file.getUrl();

  } catch(err) {

    return "UPLOAD ERROR : " + err.toString();
  }
}

function generatePdf(regNo, data, jadwal, folder) {

  try {

    const template =
      DriveApp.getFileById(TEMPLATE_DOC_ID);

    const copy =
      template.makeCopy(
        "BUKTI-" + regNo,
        folder
      );

    const doc =
      DocumentApp.openById(copy.getId());

    const body = doc.getBody();

    const replacements = {

      '{{Nomor_Pendaftaran}}': regNo,
      '{{Nama}}': data.nama || '',
      '{{NIK}}': data.nik || '',
      '{{NISN}}': data.nisn || '',
      '{{Asal_Sekolah}}': data.asalSekolah || '',
      '{{Jadwal_Seleksi}}': jadwal

    };

    Object.keys(replacements)
      .forEach(key => {
        body.replaceText(
          key,
          replacements[key]
        );
      });

    doc.saveAndClose();

    const pdfBlob =
      copy.getAs(MimeType.PDF);

    const pdfFile =
      folder.createFile(pdfBlob);

    pdfFile.setSharing(
      DriveApp.Access.ANYONE_WITH_LINK,
      DriveApp.Permission.VIEW
    );

    copy.setTrashed(true);

    return pdfFile.getUrl();

  } catch(err) {

    return "PDF ERROR : " + err.toString();
  }
}

function getRegistrations() {

  try {

    const ss =
      SpreadsheetApp.openById(SPREADSHEET_ID);

    const sheet = ss.getSheets()[0];

    const data =
      sheet.getDataRange().getValues();

    const list =
      data.slice(1).map((row, i) => ({

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

  } catch(err) {

    return responseError(
      "GET DATA ERROR : " + err.toString()
    );
  }
}

function responseSuccess(data) {

  return ContentService
    .createTextOutput(
      JSON.stringify({
        success: true,
        ...data
      })
    )
    .setMimeType(
      ContentService.MimeType.JSON
    );
}

function responseError(msg) {

  return ContentService
    .createTextOutput(
      JSON.stringify({
        success: false,
        error: msg
      })
    )
    .setMimeType(
      ContentService.MimeType.JSON
    );
}
