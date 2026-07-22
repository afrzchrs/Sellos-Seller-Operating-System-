"use client";

import { useState } from "react";

// Mendefinisikan props (data yang dikirim dari halaman utama ke modal ini)
interface CreateStoreModalProps {
  isOpen: boolean;        // Mengontrol modal tampil atau sembunyi
  onClose: () => void;    // Fungsi untuk menutup modal
  onSuccess: () => void;  // Fungsi yang dipanggil saat toko berhasil dibuat
}

export default function CreateStoreModal({ isOpen, onClose, onSuccess }: CreateStoreModalProps) {
  const [storeName, setStoreName] = useState("");
  const [category, setCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Jika isOpen bernilai false, jangan render apa pun
  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Sesuaikan URL fetch ini dengan endpoint API Anda nanti (misal: /api/stores)
      const res = await fetch("/api/tambahToko", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          NamaToko: storeName,
          Kategori: category,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal membuat toko baru");
      }

      // Bersihkan form setelah sukses
      setStoreName("");
      setCategory("");
      
      // Panggil fungsi onSuccess (misalnya untuk me-refresh data di halaman dashboard)
      onSuccess(); 
      
      // Tutup modal
      onClose();

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed top-0 right-0 bottom-0 left-64 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      {/* Container Modal */}
      <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-xl transform transition-all">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-gray-800">Buat Toko Baru</h2>
          {/* Tombol X (Tutup) di pojok kanan atas */}
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="p-3 mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Toko <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="Contoh: Sellos Official Store"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kategori Toko
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
            >
              <option value="">-- Pilih Kategori --</option>
              <option value="Elektronik">Elektronik</option>
              <option value="Pakaian">Pakaian</option>
              <option value="Makanan & Minuman">Makanan & Minuman</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-200"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-30"
            >
              {isLoading ? (
                <>
                  <svg className="w-4 h-4 mr-2 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Menyimpan...
                </>
              ) : (
                "Buat Toko"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}