'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from "next/navigation";
import { 
  CircleDollarSign, ArrowUpRight, ArrowDownRight, 
  Plus, Download, Filter, Search, BotMessageSquare,
  User, MoreVertical, X, Wallet, Loader2
} from 'lucide-react';

interface Transaction {
  id: string;
  date: string;
  desc: string;
  category: string;
  type: 'in' | 'out';
  amount: number;
  source: 'bot' | 'manual';
}

export default function LaporanKeuanganPage() {
  const params = useParams();
  const currentStoreId = params.StoreId as string;

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // STATE UNTUK MODAL TAMBAH MANUAL
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: 'in',
    amount: '',
    desc: '',
    category: 'Penjualan'
  });

  // MENGAMBIL DATA DARI API
  const fetchTransactions = async () => {
    if (!currentStoreId) return;
    try {
      const res = await fetch(`/api/transactions?storeId=${currentStoreId}`);
      if (res.ok) {
        const data = await res.json();
        setTransactions(data);
      }
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [currentStoreId]);

  // MENGHITUNG RINGKASAN KEUANGAN
  const totalIncome = transactions.filter(t => t.type === 'in').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'out').reduce((acc, curr) => acc + curr.amount, 0);
  const netBalance = totalIncome - totalExpense;

  // FUNGSI SIMPAN TRANSAKSI MANUAL
  const handleSaveManual = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeId: currentStoreId,
          ...formData
        })
      });

      if (res.ok) {
        // Refresh data tabel setelah sukses
        await fetchTransactions();
        setIsModalOpen(false);
        setFormData({ type: 'in', amount: '', desc: '', category: 'Penjualan' }); // Reset
      } else {
        alert("Gagal menyimpan transaksi.");
      }
    } catch (error) {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fungsi Format Tanggal
  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) + ', ' + d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 py-20 px-10">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            Laporan Keuangan <CircleDollarSign className="w-6 h-6 text-amber-500" />
          </h2>
          <p className="text-slate-500 text-sm mt-1">Pantau arus kas masuk dan keluar secara *real-time*.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-semibold hover:bg-slate-50 transition-colors text-sm shadow-sm flex-1 sm:flex-none justify-center">
            <Download className="w-4 h-4" /> Unduh PDF
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-all text-sm shadow-sm flex-1 sm:flex-none justify-center"
          >
            <Plus className="w-4 h-4" /> Input Kas Manual
          </button>
        </div>
      </div>

      {/* SUMMARY CARDS (KARTU RINGKASAN) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10">
        
        {/* Saldo Bersih */}
        <div className="bg-linear-to-br from-slate-900 to-slate-800 p-6 rounded-3xl border border-slate-700 shadow-lg text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl opacity-10 -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start mb-6">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/10">
                <Wallet className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <p className="text-slate-300 text-sm font-medium mb-1">Saldo Bersih (Bulan Ini)</p>
              <h3 className="text-3xl font-extrabold text-white">Rp {netBalance.toLocaleString('id-ID')}</h3>
            </div>
          </div>
        </div>

        {/* Total Pemasukan */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase">Uang Masuk</span>
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium mb-1">Total Pemasukan</p>
            <h3 className="text-2xl font-bold text-slate-900">Rp {totalIncome.toLocaleString('id-ID')}</h3>
          </div>
        </div>

        {/* Total Pengeluaran */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
              <ArrowDownRight className="w-5 h-5 text-rose-600" />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase">Uang Keluar</span>
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium mb-1">Total Pengeluaran</p>
            <h3 className="text-2xl font-bold text-slate-900">Rp {totalExpense.toLocaleString('id-ID')}</h3>
          </div>
        </div>

      </div>

      {/* TABEL BUKU KAS (ARUS KAS) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Toolbar Tabel */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50">
          <h3 className="font-bold text-lg text-slate-900">Riwayat Transaksi</h3>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-56">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Cari transaksi..." className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-300" />
            </div>
            <button className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-100 bg-white">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tabel Data */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-175">
            <thead>
              <tr className="bg-white border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tanggal & Waktu</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Keterangan</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Sumber</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Nominal</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    Belum ada riwayat transaksi di toko ini.
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4 text-sm text-slate-500 font-medium whitespace-nowrap">
                      {formatDate(tx.date)}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900 mb-0.5">{tx.desc}</p>
                      <span className="text-xs font-medium text-slate-500 px-2 py-0.5 bg-slate-100 rounded-md">
                        {tx.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {tx.source === 'bot' ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-100">
                          <BotMessageSquare className="w-3.5 h-3.5" /> WiraBot
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold border border-slate-200">
                          <User className="w-3.5 h-3.5" /> Manual
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <span className={`font-bold flex items-center justify-end gap-1 ${tx.type === 'in' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {tx.type === 'in' ? '+' : '-'} Rp {tx.amount.toLocaleString('id-ID')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-slate-300 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200 transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: TAMBAH TRANSAKSI MANUAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-lg text-slate-900">Input Kas Manual</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:bg-slate-200 p-1.5 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveManual} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Jenis Transaksi</label>
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" onClick={() => setFormData({...formData, type: 'in'})} className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold border-2 transition-all ${formData.type === 'in' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-white text-slate-500'}`}>
                    <ArrowUpRight className="w-5 h-5" /> Pemasukan
                  </button>
                  <button type="button" onClick={() => setFormData({...formData, type: 'out'})} className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold border-2 transition-all ${formData.type === 'out' ? 'border-rose-500 bg-rose-50 text-rose-700' : 'border-slate-200 bg-white text-slate-500'}`}>
                    <ArrowDownRight className="w-5 h-5" /> Pengeluaran
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Nominal (Rp)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">Rp</span>
                  <input 
                    type="number" 
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    placeholder="0"
                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Keterangan Singkat</label>
                <input 
                  type="text" 
                  required
                  value={formData.desc}
                  onChange={(e) => setFormData({...formData, desc: e.target.value})}
                  placeholder="Cth: Bayar listrik bulanan..."
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Kategori</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 appearance-none"
                >
                  <option value="Penjualan">Penjualan</option>
                  <option value="Bahan Baku">Bahan Baku</option>
                  <option value="Operasional">Operasional (Listrik, Sewa)</option>
                  <option value="Gaji Pegawai">Gaji Pegawai</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full mt-2 bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transition-colors shadow-md disabled:bg-slate-400"
              >
                {isSubmitting ? 'Menyimpan...' : 'Simpan Transaksi'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 