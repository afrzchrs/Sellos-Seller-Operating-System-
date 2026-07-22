'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { 
  BotMessageSquare,
  PackageSearch,
  Megaphone,
  CircleDollarSign,
  MessageCircle,
  Store, 
  Settings, 
  LogOut, 
} from 'lucide-react';
import Link from 'next/link';

const SideBar = () => {
  // 1. TANGKAP ID TOKO DARI URL
  const params = useParams();
  const storeId = params.StoreId; 

  return (
    <div className="min-h-screen bg-slate-50 flex">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-white border-r border-slate-200 sticky top-0 h-screen overflow-y-auto flex flex-col">
          <div className="shrink-0 flex items-center">
            <Link
              href="/"
              className="text-4xl font-bold text-[#10B981] border-slate-200 tracking-tight ml-7 mt-10 pb-5 px-14 border-b-2 "
            >
              Sellos.
            </Link>
          </div>

        <nav className="flex-1 p-4 space-y-1">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-4 px-3">
            Menu Utama
          </div>
          
          {/* 2. GUNAKAN BACKTICK (`) UNTUK MENYISIPKAN VARIABEL storeId */}
          <Link href={`/dashboard/Store/${storeId}`} className="flex items-center gap-3 px-3 py-2.5 bg-emerald-50 text-emerald-700 rounded-xl font-medium transition-colors">
            <Store className="w-5 h-5" />
            Beranda
          </Link>
          <Link href={`/dashboard/Store/${storeId}/EtalaseKatalogAi`} className="flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:bg-slate-50 rounded-xl font-medium transition-colors">
            <PackageSearch className="w-5 h-5 text-purple-500" />
            Katalog & Etalase AI
          </Link>
          <Link href={`/dashboard/Store/${storeId}/PemasaranEkspor`} className="flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:bg-slate-50 rounded-xl font-medium transition-colors">
            <Megaphone className="w-5 h-5 text-black" />
            Pemasaran & Ekspor
          </Link>
          <Link href={`/dashboard/Store/${storeId}/LaporanKeuangan`} className="flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:bg-slate-50 rounded-xl font-medium transition-colors">
            <CircleDollarSign className="w-5 h-5 text-amber-300" />
            Laporan Keuangan
          </Link>
          <Link href={`/dashboard/Store/${storeId}/RiwayatChat`} className="flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:bg-slate-50 rounded-xl font-medium transition-colors">
            <MessageCircle className="w-5 h-5 text-blue-500" />
            Riwayat Chat
          </Link>
          <Link href={`/dashboard/Store/${storeId}/WiraBotSetting`} className="flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:bg-slate-50 rounded-xl font-medium transition-colors">
            <BotMessageSquare className="w-5 h-5 text-emerald-700" />
            WiraBot Setting
          </Link>

          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-8 px-3">
            Preferensi
          </div>
          
          {/* Untuk pengaturan Akun (Hub Utama), tidak perlu StoreId karena ini milik user, bukan milik toko */}
          <Link href={`/dashboard/Store/${storeId}/SettingToko`} className="flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:bg-slate-50 rounded-xl font-medium transition-colors">
            <Settings className="w-5 h-5 text-emerald-700" />
            Pengaturan Toko
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <Link href="/dashboard/hub" className="flex items-center justify-center gap-3 px-3 py-2.5 w-full text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors">
            <LogOut className="w-5 h-5" />
            Kembali ke Beranda
          </Link>
        </div>
      </aside>
    </div>
  );
}

export default SideBar;