"use client";

import LoadingOverlay from "../Loading/LoadingOverlay";
import FormBuatToko from "../DashboardHub/fromBuatToko";
import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import {
  Plus,
  MoreVertical,
  Coffee,
  ShoppingBag,
  ArrowRight,
  Store,
  Copy,     // Icon baru
  Bot,      // Icon baru
  KeyRound  // Icon baru
} from "lucide-react";
import Link from "next/link";

const HubContent = () => {
  // 1. Tambahkan wirabot_link dan secret_key ke dalam Interface
  interface StoreData {
    storeId: string;
    storeName: string;
    category: string;
    totalProducts: number;
    totalRevenue: number;
    wirabot_link?: string;
    secret_key?: string;
  }

  const { data: session } = useSession();
  const [stores, setStores] = useState<StoreData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchStores = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await fetch("/api/toko");

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Gagal mengambil data toko");
      }

      const data = await response.json();
      setStores(data);
    } catch (err: any) {
      setError(err.message);
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  if (error) {
    return (
      <div className="p-4 text-center text-red-500 bg-red-50 rounded-lg">
        Error: {error}
      </div>
    );
  }

  const handleSuccessCreate = () => {
    setIsModalOpen(false); 
    fetchStores(); 
    alert("Toko berhasil dibuat!");
  };

  // 2. Fungsi pembantu untuk menyalin teks ke clipboard
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    alert(`${label} berhasil disalin ke clipboard!`);
  };

  return (
    <div>
      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        {/* Header Content */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              Halo, {session?.user?.name} 👋
            </h2>
            <p className="text-slate-500 mt-1">
              Pilih toko yang ingin Anda kelola hari ini atau buat toko baru.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-emerald-700 transition-all shadow-sm hover:shadow-md"
          >
            <Plus className="w-5 h-5" />
            Tambah Toko Baru
          </button>
        </div>

        <LoadingOverlay isLoading={isLoading} />

        {stores.length === 0 && !isLoading && (
          <div className="p-4 text-center text-gray-500">
            Anda belum memiliki toko.
          </div>
        )}

        {/* Store Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {stores.map((store) => (
            <div
              key={store.storeId}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group flex flex-col"
            >
              {/* Card Header */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-slate-100 text-slate-600">
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">
                      {store.storeName}
                    </h3>
                    <span className="inline-block bg-slate-100 text-slate-600 text-xs px-2.5 py-0.5 rounded-full mt-1 font-medium">
                      {store.category}
                    </span>
                  </div>
                </div>

                {/* Opsi Edit/Hapus */}
                <button className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50 transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              {/* Card Stats */}
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-500 mb-1">Total Produk</p>
                  <p className="font-bold text-slate-900">
                    {store.totalProducts} Item
                  </p>
                </div>
                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                  <p className="text-xs text-emerald-600 mb-1">
                    Kas Minggu Ini
                  </p>
                  <p className="font-bold text-emerald-700">
                    {store.totalRevenue}
                  </p>
                </div>
              </div>

              {/* 3. SEGMEN BARU: INTEGRASI WIRABOT */}
              <div className="bg-blue-50/50 rounded-xl p-4 mb-6 border border-blue-100 flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Bot className="w-4 h-4 text-blue-600" />
                  <h4 className="text-xs font-bold text-blue-800 uppercase tracking-wider">Akses WiraBot</h4>
                </div>

                <div className="space-y-2">
                  {/* Link Customer */}
                  <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-blue-100">
                    <div className="flex-1 overflow-hidden">
                      <p className="text-[10px] text-slate-500 font-semibold">Link Khusus Pembeli</p>
                      <p className="text-xs text-slate-700 truncate">{store.wirabot_link || "Link belum tersedia"}</p>
                    </div>
                    <button
                      onClick={() => store.wirabot_link && handleCopy(store.wirabot_link, 'Link WiraBot')}
                      disabled={!store.wirabot_link}
                      className="ml-2 p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors disabled:opacity-50"
                      title="Salin Link"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Secret Key Admin */}
                  <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-blue-100">
                    <div className="flex-1 overflow-hidden">
                      <p className="text-[10px] text-slate-500 font-semibold">Kode Admin Penjual</p>
                      <div className="flex items-center gap-1.5">
                        <KeyRound className="w-3 h-3 text-slate-400" />
                        <p className="text-xs font-mono font-bold text-slate-700">{store.secret_key || "Kode belum tersedia"}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => store.secret_key && handleCopy(store.secret_key, 'Kode Admin')}
                      disabled={!store.secret_key}
                      className="ml-2 p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors disabled:opacity-50"
                      title="Salin Kode"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <Link
                href={`/dashboard/Store/${store.storeId}`}
                className="mt-auto w-full flex items-center justify-center gap-2 border-2 border-slate-100 text-slate-700 font-semibold py-3 rounded-xl hover:border-emerald-600 hover:bg-emerald-600 hover:text-white transition-all group"
              >
                Masuk ke Toko
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}

          {/* Empty State / Add New Placeholder Card */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl p-6 flex flex-col items-center justify-center text-slate-500 hover:text-emerald-600 hover:border-emerald-400 hover:bg-emerald-50/50 transition-all min-h-75"
          >
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
              <Plus className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-1">Buka Cabang Baru</h3>
            <p className="text-sm text-center px-4">
              Tambah usaha lain dan pantau semuanya dari satu akun.
            </p>
          </button>
        </div>

        <FormBuatToko
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleSuccessCreate}
        />
      </main>
    </div>
  );
};

export default HubContent;