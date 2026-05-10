
import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';

const Success: React.FC = () => {
  const location = useLocation();
  const data = location.state?.data;

  if (!data) return <Navigate to="/" />;

  const handleDownload = () => {
    if (data.pdfUrl) {
      window.open(data.pdfUrl, '_blank');
    } else {
      alert('Link PDF tidak ditemukan. Silakan hubungi panitia.');
    }
  };

  return (
    <div className="py-12 bg-slate-50 min-h-screen flex items-center">
      <div className="container mx-auto px-4 max-w-xl">
        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 animate-scaleIn">
          <div className="bg-green-600 p-12 text-center text-white relative">
            <div className="absolute top-4 right-4 opacity-10">
              <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
            </div>
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 className="text-3xl font-black mb-2">Pendaftaran Berhasil!</h2>
            <p className="text-green-100 font-medium">Data Anda telah aman tersimpan.</p>
          </div>

          <div className="p-8 md:p-12">
            <div className="bg-slate-50 p-8 rounded-3xl border-2 border-dashed border-slate-200 text-center mb-8">
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-2">Nomor Pendaftaran</p>
              <h3 className="text-4xl font-black text-blue-600 tracking-tight">{data.nomorPendaftaran}</h3>
            </div>

            <div className="space-y-4 mb-10">
              <div className="p-4 bg-slate-50 rounded-2xl flex justify-between items-center">
                <span className="text-slate-500 text-sm font-bold">Jadwal Seleksi</span>
                <span className="text-slate-900 font-black text-sm">{data.jadwalSeleksi}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <button 
                onClick={handleDownload}
                className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-600/30 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 active:scale-95"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                UNDUH BUKTI PENDAFTARAN (PDF)
              </button>
              
              <Link 
                to="/" 
                className="w-full py-4 text-slate-400 font-bold text-sm text-center hover:text-slate-600 transition"
              >
                Kembali ke Beranda
              </Link>
            </div>
            
            <p className="text-center text-[10px] text-slate-300 mt-10 uppercase font-bold tracking-widest leading-relaxed">
              Pastikan Anda menyimpan file PDF ini <br /> untuk dibawa saat hari seleksi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;
