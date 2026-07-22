'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { 
  TrendingUp, 
  Sparkles, 
  Calendar, 
  BarChart3, 
  ShoppingBag, 
  Wallet,
  TrendingDown,
  Info,
  Loader2
} from 'lucide-react';

interface ChartItem {
  day: string;
  sales: number;
  rawSales: number;
  label: string;
  isPeak: boolean;
}

export default function InsightsPage() {
  const [loading, setLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [chartData, setChartData] = useState<ChartItem[]>([]);

  useEffect(() => {
    async function fetchInsights() {
      try {
        const res = await fetch("/api/insight");
        
        // Cek apakah respons berupa JSON sebelum di-parse
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          console.log("Respons server bukan JSON (kemungkinan error 500 HTML)");
        }

        const data = await res.json();

        if (res.ok) {
          setTotalRevenue(data.totalRevenue);
          setTotalTransactions(data.totalTransactions);
          setChartData(data.chartData);
        } else {
          console.error("Gagal dari server:", data.error);
        }
      } catch (error) {
        console.error("Gagal mengambil data insight:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchInsights();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center flex-1">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-slate-500 font-medium">Memuat rapor bisnis Anda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <main className="flex-1 p-6 lg:p-12 overflow-y-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              Rapor Bisnis Anda <BarChart3 className="w-7 h-7 text-blue-500" />
            </h2>
            <p className="text-slate-500 mt-2">
              Evaluasi kinerja seluruh toko Anda dan temukan peluang baru.
            </p>
          </div>
          
          <div className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl shadow-sm">
            <Calendar className="w-5 h-5 text-slate-400" />
            <span className="text-sm font-semibold text-slate-700">Performa Keseluruhan</span>
          </div>
        </div>

        {/* TOP ROW: Ringkasan Cepat & AI Consultant */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          
          {/* Kolom Kiri: Metric Cards */}
          <div className="xl:col-span-1 space-y-6">
            
            {/* Card 1: Total Pendapatan */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between h-40">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-emerald-600" />
                </div>
                <span className="flex items-center gap-1 text-sm font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                  <TrendingUp className="w-4 h-4" /> Live
                </span>
              </div>
              <div>
                <p className="text-slate-500 text-sm font-medium mb-1">Total Pendapatan (Semua Toko)</p>
                <h3 className="text-2xl lg:text-3xl font-extrabold text-slate-900">
                  Rp {totalRevenue.toLocaleString('id-ID')}
                </h3>
              </div>
            </div>

            {/* Card 2: Total Pesanan */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between h-40">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-blue-600" />
                </div>
                <span className="flex items-center gap-1 text-sm font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                  Aktif
                </span>
              </div>
              <div>
                <p className="text-slate-500 text-sm font-medium mb-1">Pesanan Selesai</p>
                <h3 className="text-3xl font-extrabold text-slate-900">
                  {totalTransactions} <span className="text-lg font-normal text-slate-400">Transaksi</span>
                </h3>
              </div>
            </div>

          </div>

          {/* Kolom Kanan: Narasi AI */}
          <div className="xl:col-span-2 bg-linear-to-br from-slate-900 to-slate-800 rounded-3xl p-8 lg:p-10 text-white relative overflow-hidden shadow-lg flex flex-col justify-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-sm border border-white/10">
                  <Sparkles className="w-6 h-6 text-blue-300" />
                </div>
                <h3 className="text-xl font-bold text-blue-100">Analisis Konsultan AI</h3>
              </div>
              
              <div className="space-y-4">
                <p className="text-lg leading-relaxed font-light">
                  "Halo! Berdasarkan akumulasi data dari seluruh toko Anda, total pendapatan saat ini mencapai <strong className="text-emerald-400 font-bold">Rp {totalRevenue.toLocaleString('id-ID')}</strong> dari <strong className="text-white">{totalTransactions} transaksi</strong> sukses."
                </p>
                
                <div className="bg-white/10 border border-white/20 rounded-2xl p-5 mt-4 backdrop-blur-md">
                  <h4 className="text-sm font-bold text-blue-200 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Info className="w-4 h-4" /> Saran Strategi Berbasis Data
                  </h4>
                  <ul className="space-y-2 text-slate-300 text-sm">
                    <li className="flex gap-2">
                      <span className="text-blue-400 font-bold">•</span>
                      Pantau hari dengan grafik tertinggi untuk memastikan ketersediaan stok produk unggulan Anda.
                    </li>
                    <li className="flex gap-2">
                      <span className="text-blue-400 font-bold">•</span>
                      Gunakan fitur WiraBot untuk merespons pelanggan dengan cepat demi mendongkrak konversi penjualan di hari-hari sepi.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* BOTTOM ROW: Visualisasi Grafik Batang Dinamis */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <div className="mb-8">
            <h3 className="text-xl font-bold text-slate-900">Grafik Penjualan Harian</h3>
            <p className="text-slate-500 text-sm">Distribusi pendapatan kotor berdasarkan hari dalam seminggu.</p>
          </div>

          <div className="h-64 flex items-end justify-between gap-2 md:gap-6 px-2 md:px-8">
            {chartData.map((data, index) => (
              <div key={index} className="flex flex-col items-center flex-1 group h-full justify-end">
                
                {/* Tooltip (Muncul saat hover) */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs font-bold py-1.5 px-3 rounded-lg mb-2 whitespace-nowrap pointer-events-none shadow-md">
                  {data.label}
                </div>
                
                {/* Batang Grafik Dinamis */}
                <div 
                  className={`w-full max-w-12 rounded-t-xl transition-all duration-500 ease-in-out ${data.isPeak ? 'bg-emerald-500 shadow-lg shadow-emerald-500/30' : 'bg-slate-200 group-hover:bg-blue-300'}`}
                  style={{ height: `${data.sales}%` }}
                ></div>
                
                {/* Label Hari */}
                <span className={`mt-4 text-sm font-medium ${data.isPeak ? 'text-emerald-600 font-bold' : 'text-slate-500'}`}>
                  {data.day}
                </span>
              </div>
            ))}
          </div>

        </div>

      </main>
    </div>
  );
}