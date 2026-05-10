
import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { api } from '../services/api';
import { StudentRegistration } from '../types';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<StudentRegistration[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'list' | 'stats'>('stats');
  const isLoggedIn = localStorage.getItem('admin_session') === 'true';

  const fetchData = async () => {
    setLoading(true);
    try {
      const registrations = await api.getAllRegistrations();
      setData(registrations);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) fetchData();
  }, [isLoggedIn]);

  if (!isLoggedIn) return <Navigate to="/admin/login" />;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 text-white hidden lg:flex flex-col shadow-2xl">
        <div className="p-8 border-b border-slate-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12V12a1 1 0 00.553.894l3.5 1.75a1 1 0 00.894 0l3.5-1.75A1 1 0 0014 12v-1.88l1.69-.724a1 1 0 011.083 1.635l-7 3a1 1 0 01-.788 0l-7-3a1 1 0 011.083-1.635z"></path></svg>
            </div>
            <div className="font-bold text-xl tracking-tight">Admin SPMB</div>
          </div>
          <div className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em]">Live Database</div>
        </div>
        
        <nav className="flex-grow p-6 space-y-2">
          <button onClick={() => setActiveTab('stats')} className={`w-full text-left px-6 py-4 rounded-2xl transition-all duration-300 flex items-center gap-4 ${activeTab === 'stats' ? 'bg-blue-600 shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7"/></svg>
            Ringkasan
          </button>
          <button onClick={() => setActiveTab('list')} className={`w-full text-left px-6 py-4 rounded-2xl transition-all duration-300 flex items-center gap-4 ${activeTab === 'list' ? 'bg-blue-600 shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
            Data Pendaftar
          </button>
        </nav>

        <div className="p-6">
          <button onClick={() => { localStorage.removeItem('admin_session'); navigate('/admin/login'); }} className="w-full py-4 bg-red-600/10 text-red-500 rounded-2xl font-bold hover:bg-red-600/20 transition-all flex items-center justify-center gap-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
            Keluar Sistem
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-6 lg:p-12 overflow-y-auto max-h-screen">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">Dashboard Admin</h2>
            <p className="text-slate-500 mt-1">Data sinkron otomatis dengan <span className="text-green-600 font-bold">Google Spreadsheet</span>.</p>
          </div>
          <button 
            onClick={fetchData} 
            className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 shadow-sm hover:shadow-md hover:bg-slate-50 transition-all"
          >
            <svg className={`w-5 h-5 text-blue-600 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            Segarkan Data
          </button>
        </header>

        {activeTab === 'stats' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fadeIn">
              <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-50 rounded-full group-hover:scale-150 transition-transform duration-700 opacity-50"></div>
                <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] mb-4">Total Pendaftar</p>
                <p className="text-6xl font-black text-slate-900 leading-none">{data.length}</p>
                <div className="mt-6 flex items-center gap-2 text-xs font-bold text-green-600">
                   <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12 7a1 1 0 110-2h5V3a1 1 0 011 1v5h-2a1 1 0 11-2 0V7zM4 13a1 1 0 011-1h5V9a1 1 0 011 1v5h-2a1 1 0 11-2 0v-2H5a1 1 0 110-2z" clipRule="evenodd"/></svg>
                   Terarsip di Sheets
                </div>
              </div>
              <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-50 rounded-full group-hover:scale-150 transition-transform duration-700 opacity-50"></div>
                <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] mb-4">Grup Terakhir</p>
                <p className="text-6xl font-black text-slate-900 leading-none">{Math.floor((data.length - 1) / 200) + 1 || 1}</p>
                <div className="mt-6 flex items-center gap-2 text-xs font-bold text-blue-600">
                   Urutan pendaftar ke-{data.length}
                </div>
              </div>
              <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-green-50 rounded-full group-hover:scale-150 transition-transform duration-700 opacity-50"></div>
                <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] mb-4">Sistem Jadwal</p>
                <p className="text-2xl font-black text-slate-900 mt-4 leading-tight text-green-600">OTOMATIS AKTIF</p>
                <div className="mt-4 flex items-center gap-2 text-xs font-bold text-slate-500">
                   Tiap 200 orang ganti jadwal
                </div>
              </div>
            </div>
            
            <div className="bg-slate-900 p-12 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
               <div className="absolute right-0 bottom-0 opacity-10">
                 <svg className="w-96 h-96" fill="currentColor" viewBox="0 0 20 20"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"></path></svg>
               </div>
               <h3 className="text-3xl font-black mb-4">Rekapitulasi Spreadsheet</h3>
               <p className="text-slate-400 max-w-xl text-lg leading-relaxed mb-8">
                 Jadwal seleksi sekarang diatur langsung melalui kode backend script. Seluruh data pendaftar dan link PDF dapat diakses melalui tombol di bawah ini.
               </p>
               <div className="flex gap-4">
                  <a href="https://docs.google.com/spreadsheets/d/1D_GopWMIf7qdvOy9JIhm872d5DZBmXJMupLTULGdmFw/edit" target="_blank" rel="noreferrer" className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-bold hover:bg-slate-100 transition shadow-lg flex items-center gap-3">
                    Buka Spreadsheet
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                  </a>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'list' && (
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden animate-fadeIn">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
               <h3 className="text-xl font-bold text-slate-800">Database Pendaftar</h3>
               <span className="px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs font-black uppercase tracking-widest">{data.length} Peserta</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                  <tr>
                    <th className="px-8 py-6">No. Daftar</th>
                    <th className="px-8 py-6">Nama Lengkap</th>
                    <th className="px-8 py-6">Asal Sekolah</th>
                    <th className="px-8 py-6">Jadwal Seleksi</th>
                    <th className="px-8 py-6 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {data.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-8 py-32 text-center">
                         <div className="flex flex-col items-center gap-4 text-slate-400">
                           <svg className="w-16 h-16 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/></svg>
                           <p className="font-bold">Belum ada data pendaftar.</p>
                         </div>
                      </td>
                    </tr>
                  ) : data.map(item => (
                    <tr key={item.nomorPendaftaran} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-8 py-6 font-black text-blue-600 tracking-tight">{item.nomorPendaftaran}</td>
                      <td className="px-8 py-6">
                        <div className="font-bold text-slate-800">{item.nama}</div>
                        <div className="text-[10px] text-slate-400 font-medium uppercase mt-0.5 tracking-tighter">NIK: {item.nik}</div>
                      </td>
                      <td className="px-8 py-6 text-slate-500 font-medium">{item.asalSekolah}</td>
                      <td className="px-8 py-6">
                         <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-[10px] font-black border border-blue-100 uppercase">
                           {item.jadwalSeleksi}
                         </span>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <a href={item.pdfUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-blue-600 transition-all shadow-md active:scale-95">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                          Cek PDF
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
