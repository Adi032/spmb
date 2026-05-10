
import React from 'react';
import { Link } from 'react-router-dom';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-blue-900 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center">
          <Link to="/" className="flex items-center space-x-3 mb-4 md:mb-0">
            <div className="bg-white p-2 rounded-lg">
              <svg className="w-8 h-8 text-blue-900" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12V12a1 1 0 00.553.894l3.5 1.75a1 1 0 00.894 0l3.5-1.75A1 1 0 0014 12v-1.88l1.69-.724a1 1 0 011.083 1.635l-7 3a1 1 0 01-.788 0l-7-3a1 1 0 011.083-1.635z"></path>
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">SPMB ONLINE</h1>
              <p className="text-xs text-blue-200 uppercase tracking-widest">Sistem Penerimaan Murid Baru</p>
            </div>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link to="/" className="hover:text-blue-200 transition py-2 flex items-center h-10">Beranda</Link>
            <Link to="/register" className="bg-blue-600 px-5 py-2.5 rounded-full hover:bg-blue-500 transition shadow-md flex items-center h-10">Daftar Sekarang</Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-white font-semibold mb-4 text-lg">SPMB Online</h3>
              <p className="text-sm leading-relaxed">
                Pendaftaran online terintegrasi untuk calon peserta didik baru. 
                Mudah, Cepat, dan Transparan. Seluruh data disimpan dengan aman sesuai dengan standar prosedur operasional.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4 text-lg">Informasi Kontak</h3>
              <ul className="text-sm space-y-2">
                <li className="flex items-center">
                   <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                   PT LANGSUNGKLIK DIGITAL MEDIA
                </li>
                <li className="flex items-center">
                   <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                   082111363663
                </li>
                <li className="flex items-center">
                   <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                   admin@langsungklik.id
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs">
            <p>&copy; 2026 PT LangsungKlik Digital Media. Hak Cipta Dilindungi.</p>
            <div className="mt-4 md:mt-0 group relative">
               <Link 
                to="/admin/login" 
                className="opacity-0 group-hover:opacity-100 text-slate-700 hover:text-blue-400 font-bold px-4 py-2 transition-all duration-300 rounded block"
               >
                 Admin Panel
               </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
