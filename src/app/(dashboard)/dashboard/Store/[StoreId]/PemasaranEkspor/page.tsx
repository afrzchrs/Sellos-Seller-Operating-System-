'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from "next/navigation";
import { 
  Megaphone, Sparkles, Camera, Video, Globe2, 
  Copy, CheckCircle2, ChevronDown, Package, Loader2
} from 'lucide-react';

// Tipe data untuk produk dari database
interface Product {
  id: string;
  name: string;
  category: string;
}

export default function PemasaranEksporPage() {
  const params = useParams();
  const currentStoreId = params.StoreId as string;

  // State Management
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState('');
  
  const [selectedFormat, setSelectedFormat] = useState('ig');
  const [aiState, setAiState] = useState<'idle' | 'generating' | 'success'>('idle');
  const [generatedResult, setGeneratedResult] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  // Ambil data produk saat halaman dimuat
  useEffect(() => {
    const fetchProducts = async () => {
      if (!currentStoreId) return;
      try {
        const res = await fetch(`/api/products?storeId=${currentStoreId}`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
          if (data.length > 0) {
            setSelectedProductId(data[0].id); // Set default pilihan pertama
          }
        }
      } catch (error) {
        console.error("Gagal memuat produk:", error);
      } finally {
        setIsLoadingProducts(false);
      }
    };
    fetchProducts();
  }, [currentStoreId]);

  // Fungsi memanggil AI Generator
  const handleGenerate = async () => {
    if (!selectedProductId) return alert("Pilih produk terlebih dahulu");
    
    setAiState('generating');
    setIsCopied(false);

    const selectedProduct = products.find(p => p.id === selectedProductId);

    try {
      const res = await fetch('/api/generateMarketing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: selectedProduct?.name,
          format: selectedFormat
        })
      });

      const data = await res.json();
      
      if (res.ok) {
        setGeneratedResult(data.text);
        setAiState('success');
      } else {
        alert(data.error || "Gagal membuat konten.");
        setAiState('idle');
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan jaringan.");
      setAiState('idle');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedResult);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pt-20 px-10">
      
      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          Pusat Pemasaran & Ekspor <Megaphone className="w-6 h-6 text-orange-500" />
        </h2>
        <p className="text-slate-500 text-sm mt-1">Buat materi iklan otomatis dari data produk Anda dalam hitungan detik.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* KOLOM KIRI: INPUT PENGGUNA */}
        <div className="w-full lg:w-5/12 space-y-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit">
          
          {/* 1. Pilih Produk */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">1. Pilih Produk dari Katalog</label>
            {isLoadingProducts ? (
              <div className="flex items-center gap-2 text-slate-500 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <Loader2 className="w-4 h-4 animate-spin" /> Memuat produk...
              </div>
            ) : products.length === 0 ? (
              <div className="text-red-500 text-sm p-3 bg-red-50 rounded-xl border border-red-200">
                Belum ada produk. Tambahkan produk di menu Katalog.
              </div>
            ) : (
              <div className="relative">
                <Package className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <select 
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none font-medium"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            )}
          </div>

          {/* 2. Pilih Format Output */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3">2. Pilih Target *Platform* / Bahasa</label>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setSelectedFormat('ig')}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${selectedFormat === 'ig' ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'}`}
              >
                <Camera className="w-6 h-6 mb-2" />
                <span className="text-xs font-bold">Caption IG/FB</span>
              </button>
              <button 
                onClick={() => setSelectedFormat('tiktok')}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${selectedFormat === 'tiktok' ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'}`}
              >
                <Video className="w-6 h-6 mb-2" />
                <span className="text-xs font-bold">Skrip TikTok</span>
              </button>
              <button 
                onClick={() => setSelectedFormat('en')}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${selectedFormat === 'en' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'}`}
              >
                <Globe2 className="w-6 h-6 mb-2" />
                <span className="text-xs font-bold text-center">Ekspor (Inggris)</span>
              </button>
              <button 
                onClick={() => setSelectedFormat('jp')}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${selectedFormat === 'jp' ? 'border-red-500 bg-red-50 text-red-700' : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'}`}
              >
                <span className="text-2xl font-black mb-1">JP</span>
                <span className="text-xs font-bold text-center">Ekspor (Jepang)</span>
              </button>
            </div>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={aiState === 'generating' || products.length === 0}
            className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-md disabled:bg-slate-400 mt-4"
          >
            {aiState === 'generating' ? (
              <><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span> Meracik Kata...</>
            ) : (
              <><Sparkles className="w-5 h-5" /> Buat Konten Sekarang</>
            )}
          </button>
        </div>

        {/* KOLOM KANAN: OUTPUT AI */}
        <div className="w-full lg:w-7/12 bg-slate-50 border border-slate-200 rounded-2xl p-6 lg:p-8 flex flex-col relative overflow-hidden min-h-100">
          
          {aiState === 'idle' && (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-400 opacity-60">
              <Megaphone className="w-16 h-16 mb-4" />
              <p className="max-w-xs">Pilih produk dan format di sebelah kiri, lalu biarkan AI menyusun *copywriting* jualan yang memikat.</p>
            </div>
          )}

          {aiState === 'generating' && (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="relative mb-6">
                <div className="w-16 h-16 border-4 border-slate-200 rounded-full"></div>
                <div className="w-16 h-16 border-4 border-slate-900 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
                <Sparkles className="w-6 h-6 text-slate-900 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
              </div>
              <h4 className="font-bold text-slate-700 text-lg">Menganalisis Nilai Jual (USP)...</h4>
              <p className="text-slate-500 text-sm">Menyesuaikan gaya bahasa dengan audiens target.</p>
            </div>
          )}

          {aiState === 'success' && (
            <div className="flex-1 flex flex-col animate-in fade-in zoom-in-95 duration-500">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Siap Dipublikasikan
                </span>
                
                <button 
                  onClick={handleCopy}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${isCopied ? 'bg-emerald-500 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  {isCopied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {isCopied ? 'Tersalin!' : 'Salin Teks'}
                </button>
              </div>

              <div className="bg-white border border-slate-200 p-5 rounded-xl flex-1 shadow-sm overflow-y-auto max-h-125">
                <p className="text-slate-800 text-sm md:text-base leading-relaxed whitespace-pre-line font-medium">
                  {generatedResult}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}