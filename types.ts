
export interface ParentData {
  nama: string;
  nik: string;
  pendidikan: string;
  pekerjaan: string;
  penghasilan: string;
  telepon: string;
}

export interface StudentRegistration {
  id?: string;
  nomorPendaftaran?: string;
  nama: string;
  nik: string;
  nisn: string;
  telepon: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: 'Laki-laki' | 'Perempuan';
  agama: string;
  asalSekolah: string;
  npsnSekolah: string;
  alamat: string;
  desa: string;
  kecamatan: string;
  kabupaten: string;
  kodePos: string;
  statusKeluarga: string;
  anakKe: string;
  jumlahSaudara: string;
  nomorKK: string;
  
  ayah: ParentData;
  ibu: ParentData;
  wali?: ParentData & { status: 'Ada Wali' | 'Tidak Ada Wali' };
  
  dokumen: {
    akta: string; // Base64
    kk: string;
    nisn: string;
    rapor: string;
    ijazahDiniyah?: string;
    kip?: string;
    pkh?: string;
    kks?: string;
    bpjs?: string;
  };

  jadwalSeleksi?: string;
  pdfUrl?: string;
  createdAt?: string;
}

export interface ScheduleSetting {
  id: string;
  groupNumber: number; // 1 for first 200, 2 for next 200...
  date: string;
  location: string;
}
