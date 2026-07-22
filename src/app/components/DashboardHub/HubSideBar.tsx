'use client';

import React, { useState } from 'react';
import { signOut } from 'next-auth/react';
import { 
  Store, 
  Sparkles, 
  TrendingUp, 
  Settings, 
  LogOut, 
} from 'lucide-react';
import Link from 'next/link';

const SideBar = () => {
    const handleLogout = async () => { 
      await signOut({
        redirect: true,
        callbackUrl: "/Auth/login",
      });
    };
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
          <Link href="/dashboard/hub" className="flex items-center gap-3 px-3 py-2.5 bg-emerald-50 text-emerald-700 rounded-xl font-medium transition-colors">
            <Store className="w-5 h-5" />
            Manajemen Toko
          </Link>
          <Link href="/dashboard/hub/StudioAi" className="flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:bg-slate-50 rounded-xl font-medium transition-colors">
            <Sparkles className="w-5 h-5 text-purple-500" />
            Studio AI
          </Link>
          <Link href="/dashboard/hub/insights" className="flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:bg-slate-50 rounded-xl font-medium transition-colors">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Insight Mingguan
          </Link>

          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-8 px-3">
            Preferensi
          </div>
          <Link href="/dashboard/hub/Pengaturan" className="flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:bg-slate-50 rounded-xl font-medium transition-colors">
            <Settings className="w-5 h-5" />
            Pengaturan Akun
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button onClick ={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors">
            <LogOut className="w-5 h-5" />
            Keluar dari Akun
          </button>
        </div>
      </aside>
    </div>
  );
}

export default SideBar;