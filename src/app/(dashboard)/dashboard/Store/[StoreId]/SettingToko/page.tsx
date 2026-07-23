'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation'; // Wajib untuk mengambil ID dari URL
import { 
  Store, 
  Save, 
  Upload, 
  MapPin, 
  Phone, 
  AlignLeft,
  Image as ImageIcon,
  Building2,
  CheckCircle2,
  Loader2 // Tambahan icon loading
} from 'lucide-react';

export default function PengaturanTokoPage() {
  const params = useParams();
  const currentStoreId = params.StoreId as string; 

  // 1. STATE FORMULIR PENGATURAN TOKO
  const [formData, setFormData] = useState({
    name: '',
    category: 'Lainnya',
    description: '',
    phone: '',
    address: '',
    status: 'Buka' // Catatan: Status ini belum ada di schema database, sementara hanya ada di UI
  });

  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [error, setError] = useState('');

  // 2. MENGAMBIL DATA TOKO SAAT HALAMAN DIMUAT (GET)
  useEffect(() => {
    const fetchStoreSettings = async () => {
      if (!currentStoreId) return;

      try {
        const res = await fetch(`/api/settingTokoUser?storeId=${currentStoreId}`);
        
        if (!res.ok) throw new Error("Gagal mengambil data toko");
        
        const data = await res.json();
        
        // Memasukkan data dari database ke state formulir
        setFormData({
          name: data.store_name || '',
          category: data.category || 'Lainnya',
          description: data.description || '',
          phone: data.phone || '',
          address: data.address || '',
          status: 'Buka' 
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoadingInitial(false);
      }
    };

    fetchStoreSettings();
  }, [currentStoreId]);

  // 3. FUNGSI SIMPAN PERUBAHAN (PATCH)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    
    try {
      let formattedPhone = formData.phone;

      if (formattedPhone.startsWith('0')) {
        formattedPhone = formattedPhone.substring(1);
      }
      
      const finalContact = formattedPhone ? `62${formattedPhone}` : '';

      const payload = {
        namaToko: formData.name,
        kategori: formData.category,
        deskripsi: formData.description,
        alamat: formData.address,
        kontak: finalContact
      };

      // Pastikan metode menggunakan PATCH
      const res = await fetch(`/api/settingTokoUser?storeId=${currentStoreId}`, {
        method: 'PATCH', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Gagal menyimpan perubahan");
      }

      // Munculkan notifikasi sukses
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Menampilkan layar loading saat pertama kali mengambil data
  if (isLoadingInitial) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Memuat profil toko...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10 pt-20 px-10">
      
      {/* HEADER & TOAST NOTIFICATION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sticky top-0 bg-slate-50/90 backdrop-blur-md z-10 py-4 -mt-4 border-b border-slate-200/50">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            Pengaturan Toko <Building2 className="w-6 h-6 text-emerald-600" />
          </h2>
          <p className="text-slate-500 text-sm mt-1">Kelola informasi publik dan profil bisnis Anda.</p>
        </div>
        
        <div className="flex items-center gap-4 w-full sm:w-auto">
          {showSuccessToast && (
            <span className="animate-in slide-in-from-right fade-in bg-emerald-100 text-emerald-700 px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" /> Tersimpan!
            </span>
          )}
          
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-sm shadow-emerald-200 disabled:bg-emerald-400"
          >
            {isSaving ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isSaving ? 'Menyimpan...' : 'Simpan Profil'}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl font-medium text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSave} className="max-w-4xl space-y-8">
        
        {/* SEKSI 1: IDENTITAS UTAMA (Logo & Nama) */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-8">
          
          {/* Upload Logo */}
          <div className="flex flex-col items-center gap-4 shrink-0">
            <div className="w-32 h-32 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 hover:border-emerald-400 transition-colors cursor-pointer overflow-hidden group relative">
              <ImageIcon className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold">Ubah Logo</span>
              
              <div className="absolute inset-0 bg-emerald-500/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Upload className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <p className="text-[10px] text-slate-400 font-medium text-center">Format: JPG, PNG. Maks 2MB.</p>
          </div>

          {/* Input Form Identitas */}
          <div className="flex-1 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                  <Store className="w-4 h-4 text-slate-400" /> Nama Toko
                </label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Kategori Bisnis</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors appearance-none"
                >
                  <option value="Makanan & Minuman">Makanan & Minuman</option>
                  <option value="Fashion & Pakaian">Fashion & Pakaian</option>
                  <option value="Kerajinan & Kriya">Kerajinan & Kriya</option>
                  <option value="Jasa & Layanan">Jasa & Layanan</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
            </div>

            <div>
              <label className=" text-sm font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                <AlignLeft className="w-4 h-4 text-slate-400" /> Deskripsi Toko (Bio)
              </label>
              <textarea 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors resize-none"
                placeholder="Ceritakan singkat tentang bisnis Anda..."
              ></textarea>
              <p className="text-xs text-slate-400 mt-2">Deskripsi ini akan dilihat oleh pelanggan saat mereka mengunjungi etalase AI Anda.</p>
            </div>
          </div>
        </div>

        {/* SEKSI 2: KONTAK & LOKASI */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="font-bold text-lg text-slate-900 border-b border-slate-100 pb-4">Kontak & Lokasi Pengiriman</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className=" text-sm font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-slate-400" /> Nomor Kontak Admin
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">+62</span>
                <input 
                  type="tel" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                  placeholder="8123456..."
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className=" text-sm font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-400" /> Alamat Lengkap Toko
              </label>
              <textarea 
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                rows={2}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors resize-none"
                placeholder="Cth: Jl. Sudirman No. 12, RT 01/RW 02, Jakarta Selatan..."
              ></textarea>
            </div>
          </div>
        </div>

        {/* SEKSI 3: STATUS OPERASIONAL */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-red-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="font-bold text-lg text-slate-900">Status Operasional</h3>
            <p className="text-sm text-slate-500 mt-1">Gunakan fitur ini jika Anda sedang libur atau tidak menerima pesanan.</p>
          </div>
          
          <select 
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value})}
            className={`px-4 py-2.5 border rounded-xl font-bold focus:outline-none appearance-none cursor-pointer transition-colors ${
              formData.status === 'Buka' 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                : 'bg-rose-50 border-rose-200 text-rose-700'
            }`}
          >
            <option value="Buka">🟢 Toko Sedang Buka</option>
            <option value="Tutup">🔴 Tutup Sementara</option>
          </select>
        </div>

      </form>
    </div>
  );
}