
import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const scrollToProsedur = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('prosedur');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 bg-slate-900 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute top-0 left-0 w-full h-full">
          <img 
            src="https://images.unsplash.com/photo-1523050853064-85572275ad44?auto=format&fit=crop&q=80&w=1920" 
            alt="School Background" 
            className="w-full h-full object-cover opacity-20"
            onError={(e) => {
              // Fallback jika gambar utama gagal load
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=1920";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-transparent to-slate-900/80"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="animate-fadeIn">
            <h2 className="text-4xl md:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight">
              Masa Depan Cerah <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                Dimulai Dari Sini
              </span>
            </h2>
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
              Penerimaan Murid Baru Tahun Ajaran 2026/2027 telah dibuka. Daftarkan putra-putri Anda melalui sistem online kami yang terintegrasi dan modern.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-5">
              <Link 
                to="/register" 
                className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-500 shadow-2xl shadow-blue-600/30 transition transform hover:-translate-y-1 active:scale-95"
              >
                Daftar Sekarang
              </Link>
              <button 
                onClick={scrollToProsedur}
                className="px-10 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-2xl font-bold text-lg hover:bg-white/20 shadow-xl transition transform hover:-translate-y-1 active:scale-95"
              >
                Lihat Prosedur
              </button>
            </div>
          </div>
        </div>
        
        {/* Dekorasi Elemen Grafis */}
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Stats Section */}
      <section className="relative -mt-10 z-20">
        <div className="container mx-auto px-4">
          <div className="bg-blue-600 rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-blue-600/40">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
              <div className="space-y-1">
                <div className="text-3xl md:text-4xl font-black">1.2k+</div>
                <div className="text-xs md:text-sm text-blue-100 uppercase font-bold tracking-widest">Pendaftar</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl md:text-4xl font-black">45+</div>
                <div className="text-xs md:text-sm text-blue-100 uppercase font-bold tracking-widest">Guru Ahli</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl md:text-4xl font-black">A</div>
                <div className="text-xs md:text-sm text-blue-100 uppercase font-bold tracking-widest">Akreditasi</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl md:text-4xl font-black">100%</div>
                <div className="text-xs md:text-sm text-blue-100 uppercase font-bold tracking-widest">Kelulusan</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section id="prosedur" className="py-24 scroll-mt-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight">Alur Pendaftaran Online</h3>
            <p className="text-slate-500 font-medium max-w-lg mx-auto leading-relaxed">Ikuti langkah-langkah mudah di bawah ini untuk mendaftarkan calon peserta didik baru.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { title: 'Isi Formulir', desc: 'Lengkapi data pendaftar, data orang tua, dan alamat lengkap dengan benar.', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
              { title: 'Unggah Berkas', desc: 'Scan dokumen wajib seperti Akta, KK, dan Rapor dalam format digital.', icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12' },
              { title: 'Verifikasi', desc: 'Tim panitia akan memvalidasi dokumen yang telah Anda unggah.', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
              { title: 'Cetak Bukti', desc: 'Simpan PDF bukti pendaftaran untuk dibawa saat jadwal seleksi tiba.', icon: 'M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z' },
            ].map((step, idx) => (
              <div key={idx} className="group bg-white p-8 rounded-[2rem] text-center border border-slate-100 hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-600/10 transition-all duration-500">
                <div className="w-20 h-20 bg-slate-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500 transform group-hover:rotate-6">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={step.icon} />
                  </svg>
                </div>
                <div className="inline-block px-3 py-1 bg-blue-50 rounded-lg text-[10px] font-black text-blue-600 mb-4 uppercase tracking-widest">Langkah {idx + 1}</div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
