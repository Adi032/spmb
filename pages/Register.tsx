
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormInput, FormSelect, FormFile } from '../components/FormComponents';
import { RELIGIONS, FAMILY_STATUSES, EDUCATIONS, JOBS, INCOMES } from '../constants';
import { api } from '../services/api';
import { StudentRegistration } from '../types';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('Memulai pendaftaran...');
  const [hasWali, setHasWali] = useState(false);
  const [fileNames, setFileNames] = useState<Record<string, string>>({});
  const [fileProcessing, setFileProcessing] = useState<Record<string, boolean>>({});
  
  const [formData, setFormData] = useState<StudentRegistration>({
    nama: '', nik: '', nisn: '', telepon: '', tempatLahir: '', tanggalLahir: '', 
    jenisKelamin: 'Laki-laki', agama: '', asalSekolah: '', npsnSekolah: '',
    alamat: '', desa: '', kecamatan: '', kabupaten: '', kodePos: '',
    statusKeluarga: '', anakKe: '', jumlahSaudara: '', nomorKK: '',
    ayah: { nama: '', nik: '', pendidikan: '', pekerjaan: '', penghasilan: '', telepon: '' },
    ibu: { nama: '', nik: '', pendidikan: '', pekerjaan: '', penghasilan: '', telepon: '' },
    wali: { status: 'Tidak Ada Wali', nama: '', nik: '', pendidikan: '', pekerjaan: '', penghasilan: '', telepon: '' },
    dokumen: { akta: '', kk: '', nisn: '', rapor: '', ijazahDiniyah: '', kip: '', pkh: '', kks: '', bpjs: '' }
  });

  const formatDatePicker = (value: string) => {
    // Remove all non-digits
    const v = value.replace(/\D/g, '').slice(0, 8);
    if (v.length >= 5) {
      return `${v.slice(0, 2)}/${v.slice(2, 4)}/${v.slice(4)}`;
    } else if (v.length >= 3) {
      return `${v.slice(0, 2)}/${v.slice(2)}`;
    }
    return v;
  };

  const handleChange = (e: React.ChangeEvent<any>, section?: 'ayah' | 'ibu' | 'wali') => {
    const { name, value } = e.target;
    
    let processedValue = value;
    if (name === 'tanggalLahir') {
      processedValue = formatDatePicker(value);
    }

    if (section) {
      setFormData(prev => ({ 
        ...prev, 
        [section]: { ...(prev[section] as any), [name]: processedValue } 
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: processedValue }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<any>, field: string) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert(`File ${file.name} terlalu besar. Maksimal ukuran adalah 2MB.`);
        e.target.value = ''; 
        return;
      }
      setFileProcessing(prev => ({ ...prev, [field]: true }));
      setFileNames(prev => ({ ...prev, [field]: file.name }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          dokumen: { ...prev.dokumen, [field]: reader.result as string }
        }));
        setFileProcessing(prev => ({ ...prev, [field]: false }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation for date format
    const datePattern = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!datePattern.test(formData.tanggalLahir)) {
      alert('Format Tanggal Lahir harus DD/MM/YYYY (Contoh: 17/08/2010)');
      return;
    }

    setLoading(true);
    setLoadingStatus('Mengirim data pendaftaran...');
    setTimeout(() => setLoadingStatus('Mengunggah dokumen persyaratan...'), 2000);
    setTimeout(() => setLoadingStatus('Menyusun PDF Bukti Pendaftaran...'), 5000);

    try {
      const result = await api.submitRegistration(formData);
      if (result.success) {
        navigate('/success', { state: { data: result } });
      } else {
        alert('Gagal mengirim pendaftaran: ' + result.error);
        setLoading(false);
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Terjadi kesalahan koneksi ke server.');
      setLoading(false);
    }
  };

  const nextStep = () => {
    window.scrollTo(0, 0);
    setStep(prev => prev + 1);
  };
  const prevStep = () => {
    window.scrollTo(0, 0);
    setStep(prev => prev - 1);
  };

  return (
    <div className="py-12 bg-slate-50 min-h-screen relative">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full text-center shadow-2xl animate-scaleIn">
            <div className="mb-8 relative">
              <div className="w-20 h-20 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>
              </div>
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-2">Sedang Diproses</h3>
            <p className="text-slate-500 text-sm font-medium animate-pulse">{loadingStatus}</p>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
          <div className="bg-blue-600 px-8 py-10 text-white">
            <h2 className="text-2xl font-bold">Formulir Pendaftaran Online</h2>
            <p className="text-blue-100 mt-2">Lengkapi seluruh data sesuai dokumen asli.</p>
            <div className="flex mt-8 gap-2">
              {[1, 2, 3].map(s => (
                <div key={s} className={`flex-1 h-2 rounded-full transition-all duration-500 ${step >= s ? 'bg-white' : 'bg-blue-800'}`}></div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 md:p-12">
            {step === 1 && (
              <div className="animate-fadeIn">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                  <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mr-3 text-sm font-bold">01</span>
                  Data Calon Peserta Didik
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                  <FormInput label="Nama Lengkap" name="nama" value={formData.nama} onChange={handleChange} required />
                  <FormInput label="NIK" name="nik" type="number" value={formData.nik} onChange={handleChange} required />
                  <FormInput label="Nomor KK" name="nomorKK" type="number" value={formData.nomorKK} onChange={handleChange} required />
                  <FormInput label="NISN" name="nisn" type="number" value={formData.nisn} onChange={handleChange} required />
                  <FormInput label="Nomor Telepon" name="telepon" type="number" value={formData.telepon} onChange={handleChange} required />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormInput label="Tempat Lahir" name="tempatLahir" value={formData.tempatLahir} onChange={handleChange} required />
                    <FormInput 
                      label="Tanggal Lahir" 
                      name="tanggalLahir" 
                      type="text" 
                      placeholder="DD/MM/YYYY" 
                      maxLength={10}
                      value={formData.tanggalLahir} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>

                  <FormSelect label="Jenis Kelamin" name="jenisKelamin" value={formData.jenisKelamin} onChange={handleChange} options={['Laki-laki', 'Perempuan']} required />
                  <FormSelect label="Agama" name="agama" value={formData.agama} onChange={handleChange} options={RELIGIONS} required />
                  <FormInput label="Asal Sekolah" name="asalSekolah" value={formData.asalSekolah} onChange={handleChange} required />
                  <FormInput label="NPSN Sekolah Asal" name="npsnSekolah" type="number" value={formData.npsnSekolah} onChange={handleChange} required />
                </div>
                
                <h4 className="font-bold text-slate-700 mt-8 mb-4 border-b pb-2">Alamat & Keluarga</h4>
                <FormInput label="Alamat (Jalan/Dusun)" name="alamat" value={formData.alamat} onChange={handleChange} required type="textarea" rows={2} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                  <FormInput label="Desa" name="desa" value={formData.desa} onChange={handleChange} required />
                  <FormInput label="Kecamatan" name="kecamatan" value={formData.kecamatan} onChange={handleChange} required />
                  <FormInput label="Kabupaten" name="kabupaten" value={formData.kabupaten} onChange={handleChange} required />
                  <FormInput label="Kode Pos" name="kodePos" type="number" value={formData.kodePos} onChange={handleChange} required />
                  <FormSelect label="Status dalam Keluarga" name="statusKeluarga" value={formData.statusKeluarga} onChange={handleChange} options={FAMILY_STATUSES} required />
                  <div className="grid grid-cols-2 gap-4">
                    <FormInput label="Anak Ke" name="anakKe" type="number" value={formData.anakKe} onChange={handleChange} required />
                    <FormInput label="Jumlah Saudara" name="jumlahSaudara" type="number" value={formData.jumlahSaudara} onChange={handleChange} required />
                  </div>
                </div>

                <div className="mt-10 flex justify-end">
                  <button type="button" onClick={nextStep} className="px-10 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg">Lanjut: Data Orang Tua</button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="animate-fadeIn">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                  <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mr-3 text-sm font-bold">02</span>
                  Data Orang Tua / Wali
                </h3>
                
                <div className="space-y-10">
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                    <h4 className="font-bold text-blue-700 mb-6 flex items-center gap-2">
                       <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                       DATA AYAH
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                      <FormInput label="Nama Ayah" name="nama" value={formData.ayah.nama} onChange={(e) => handleChange(e, 'ayah')} required />
                      <FormInput label="NIK Ayah" name="nik" type="number" value={formData.ayah.nik} onChange={(e) => handleChange(e, 'ayah')} required />
                      <FormSelect label="Pendidikan Terakhir" name="pendidikan" value={formData.ayah.pendidikan} onChange={(e) => handleChange(e, 'ayah')} options={EDUCATIONS} required />
                      <FormSelect label="Pekerjaan" name="pekerjaan" value={formData.ayah.pekerjaan} onChange={(e) => handleChange(e, 'ayah')} options={JOBS} required />
                      <FormSelect label="Penghasilan" name="penghasilan" value={formData.ayah.penghasilan} onChange={(e) => handleChange(e, 'ayah')} options={INCOMES} required />
                      <FormInput label="Nomor Telepon Ayah" name="telepon" type="number" value={formData.ayah.telepon} onChange={(e) => handleChange(e, 'ayah')} required />
                    </div>
                  </div>

                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                    <h4 className="font-bold text-pink-700 mb-6 flex items-center gap-2">
                       <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                       DATA IBU
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                      <FormInput label="Nama Ibu" name="nama" value={formData.ibu.nama} onChange={(e) => handleChange(e, 'ibu')} required />
                      <FormInput label="NIK Ibu" name="nik" type="number" value={formData.ibu.nik} onChange={(e) => handleChange(e, 'ibu')} required />
                      <FormSelect label="Pendidikan Terakhir" name="pendidikan" value={formData.ibu.pendidikan} onChange={(e) => handleChange(e, 'ibu')} options={EDUCATIONS} required />
                      <FormSelect label="Pekerjaan" name="pekerjaan" value={formData.ibu.pekerjaan} onChange={(e) => handleChange(e, 'ibu')} options={JOBS} required />
                      <FormSelect label="Penghasilan" name="penghasilan" value={formData.ibu.penghasilan} onChange={(e) => handleChange(e, 'ibu')} options={INCOMES} required />
                      <FormInput label="Nomor Telepon Ibu" name="telepon" type="number" value={formData.ibu.telepon} onChange={(e) => handleChange(e, 'ibu')} required />
                    </div>
                  </div>

                  <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100">
                    <div className="flex items-center mb-6">
                       <input 
                         type="checkbox" id="checkWali" className="w-5 h-5 rounded text-blue-600 mr-3" 
                         checked={hasWali} onChange={(e) => {
                            setHasWali(e.target.checked);
                            setFormData(prev => ({...prev, wali: prev.wali ? {...prev.wali, status: e.target.checked ? 'Ada Wali' : 'Tidak Ada Wali'} : undefined}));
                         }}
                       />
                       <label htmlFor="checkWali" className="font-bold text-slate-800">Gunakan Data Wali (Jika Ada)</label>
                    </div>
                    {hasWali && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 animate-fadeIn">
                        <FormInput label="Nama Wali" name="nama" value={formData.wali?.nama} onChange={(e) => handleChange(e, 'wali')} required />
                        <FormInput label="NIK Wali" name="nik" type="number" value={formData.wali?.nik} onChange={(e) => handleChange(e, 'wali')} required />
                        <FormSelect label="Pendidikan Terakhir" name="pendidikan" value={formData.wali?.pendidikan} onChange={(e) => handleChange(e, 'wali')} options={EDUCATIONS} required />
                        <FormSelect label="Pekerjaan" name="pekerjaan" value={formData.wali?.pekerjaan} onChange={(e) => handleChange(e, 'wali')} options={JOBS} required />
                        <FormSelect label="Penghasilan" name="penghasilan" value={formData.wali?.penghasilan} onChange={(e) => handleChange(e, 'wali')} options={INCOMES} required />
                        <FormInput label="Nomor Telepon Wali" name="telepon" type="number" value={formData.wali?.telepon} onChange={(e) => handleChange(e, 'wali')} required />
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-10 flex justify-between">
                  <button type="button" onClick={prevStep} className="px-8 py-4 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition">Kembali</button>
                  <button type="button" onClick={nextStep} className="px-10 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg">Lanjut: Berkas</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="animate-fadeIn">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                  <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mr-3 text-sm font-bold">03</span>
                  Unggah Berkas Persyaratan
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-full">
                    <h4 className="font-bold text-slate-800 mb-4 border-b pb-2 uppercase text-xs tracking-widest">Berkas Wajib</h4>
                  </div>
                  <FormFile label="Scan Akta Kelahiran" required fileName={fileNames.akta} isProcessing={fileProcessing.akta} onChange={(e) => handleFileChange(e, 'akta')} />
                  <FormFile label="Scan Kartu Keluarga (KK)" required fileName={fileNames.kk} isProcessing={fileProcessing.kk} onChange={(e) => handleFileChange(e, 'kk')} />
                  <FormFile label="Scan Kartu NISN" required fileName={fileNames.nisn} isProcessing={fileProcessing.nisn} onChange={(e) => handleFileChange(e, 'nisn')} />
                  <FormFile label="Scan Rapor Terakhir" required fileName={fileNames.rapor} isProcessing={fileProcessing.rapor} onChange={(e) => handleFileChange(e, 'rapor')} />
                  
                  <div className="col-span-full mt-6">
                    <h4 className="font-bold text-slate-800 mb-4 border-b pb-2 uppercase text-xs tracking-widest">Berkas Opsional (Jika Ada)</h4>
                  </div>
                  <FormFile label="Ijazah Diniyah" fileName={fileNames.ijazahDiniyah} isProcessing={fileProcessing.ijazahDiniyah} onChange={(e) => handleFileChange(e, 'ijazahDiniyah')} />
                  <FormFile label="Kartu KIP" fileName={fileNames.kip} isProcessing={fileProcessing.kip} onChange={(e) => handleFileChange(e, 'kip')} />
                  <FormFile label="Kartu PKH" fileName={fileNames.pkh} isProcessing={fileProcessing.pkh} onChange={(e) => handleFileChange(e, 'pkh')} />
                  <FormFile label="Kartu KKS" fileName={fileNames.kks} isProcessing={fileProcessing.kks} onChange={(e) => handleFileChange(e, 'kks')} />
                  <FormFile label="Kartu BPJS" fileName={fileNames.bpjs} isProcessing={fileProcessing.bpjs} onChange={(e) => handleFileChange(e, 'bpjs')} />
                </div>

                <div className="mt-12 bg-blue-50 p-6 rounded-2xl border border-blue-100 flex items-start gap-4">
                  <input type="checkbox" id="syarat" className="w-6 h-6 rounded mt-1 text-blue-600" required />
                  <label htmlFor="syarat" className="text-sm text-slate-700 leading-relaxed font-medium">
                    Saya menyatakan bahwa seluruh data yang diisikan adalah benar dan dapat dipertanggungjawabkan. Saya menyetujui syarat dan ketentuan pendaftaran murid baru.
                  </label>
                </div>

                <div className="mt-10 flex justify-between">
                  <button type="button" onClick={prevStep} className="px-8 py-4 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition">Kembali</button>
                  <button type="submit" className="px-12 py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition shadow-lg flex items-center gap-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Selesaikan Pendaftaran
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
