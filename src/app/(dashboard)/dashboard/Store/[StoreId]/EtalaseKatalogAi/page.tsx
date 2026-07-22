'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation'; // Wajib dipakai
import { 
  Search, 
  Plus, 
  MoreVertical, 
  Sparkles, 
  UploadCloud, 
  X, 
  CheckCircle2, 
  Image as ImageIcon,
  Loader2
} from 'lucide-react';

interface Product {
  id: string | number;
  name: string;
  price: number;
  stock: number;
  terjual : number;
  status?: string;
}

export default function EtalaseKatalogAiPage() {
    const params = useParams();
    const currentStoreId = params.StoreId as string; 
  // 1. STATE UNTUK DATA PRODUK
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // 2. STATE UNTUK MODAL (Manual & AI)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addMode, setAddMode] = useState<'manual' | 'ai'>('manual');
  const [aiState, setAiState] = useState<'idle' | 'analyzing' | 'success'>('idle');
  const [isSaving, setIsSaving] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: ''
  });

  // 3. FETCH DATA PRODUK DARI API
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/products?storeId=${currentStoreId}`); 
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Gagal mengambil data produk');
      }

      const data = await res.json();
      
      // Pemetaan data jika properti backend berbeda (misal namaProduk -> name)
      const formattedProducts = data.map((item: any) => ({
        id: item.id || item.produkId,
        name: item.name || item.namaProduk,
        price: item.price || item.harga || 0,
        stock: item.stock || item.stok || 0,
        terjual : item.sold || item.sold || 0,
        status: item.status || 'Aktif'
      }));

      setProducts(formattedProducts);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 4. SIMULASI ANALISIS AI UNTUK FOTO
  const handleUploadPhoto = () => {
    setAiState('analyzing');
    
    setTimeout(() => {
      setFormData({
        name: 'Kemeja Flanel Kotak Pria',
        price: '145000',
        stock: '10'
      });
      setAiState('success');
    }, 2500);
  };

  // 5. HANDLER SIMPAN PRODUK (POST KE API)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');

    try {
      const payload = {
        name: formData.name,
        price: parseFloat(formData.price) || 0,
        stock: parseInt(formData.stock) || 0,
        storeId: currentStoreId 
      };

      const res = await fetch("/api/products" ,{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Gagal menyimpan produk');
      }

      // Refresh data dari server 
      await fetchProducts();

      // Reset & Tutup Modal
      closeModal();
      alert('Produk berhasil ditambahkan!');
    } catch (err: any) {
      const newProduct: Product = {
        id: Date.now(),
        name: formData.name,
        price: parseFloat(formData.price) || 0,
        stock: parseInt(formData.stock) || 0,
        terjual:  parseInt(formData.stock) || 0,
        status: 'Aktif'
      };
      setProducts([newProduct, ...products]);
      closeModal();
    } finally {
      setIsSaving(false);
    }
  };

  const openModal = (mode: 'manual' | 'ai') => {
    setAddMode(mode);
    setAiState('idle');
    setFormData({ name: '', price: '', stock: '' });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setAiState('idle');
  };

  // Filter Produk berdasarkan Pencarian
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 px-6 sm:px-10 py-20">
      
      {/* HEADER & ACTION BAR */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            Katalog Produk <ImageIcon className="w-6 h-6 text-slate-400" />
          </h2>
          <p className="text-slate-500 text-sm mt-1">Kelola stok dan etalase toko Anda di sini.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* SEARCH INPUT */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama produk..." 
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all shadow-sm"
            />
          </div>

          {/* BUTTON MANUAL */}
          <button 
            onClick={() => openModal('manual')}
            className="flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2.5 rounded-xl font-semibold hover:bg-slate-200 transition-colors text-sm shadow-sm border border-slate-200 shrink-0"
          >
            <Plus className="w-4 h-4" /> Manual
          </button>
          
          {/* BUTTON AI */}
          <button 
            onClick={() => openModal('ai')}
            className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-bold hover:bg-emerald-700 transition-all text-sm shadow-sm shadow-purple-200 shrink-0"
          >
            <Sparkles className="w-4 h-4" /> Tambah via Foto
          </button>
        </div>
      </div>

      {/* ERROR NOTIFICATION */}
      {error && (
        <div className="p-4 text-center text-red-500 bg-red-50 rounded-xl border border-red-100 text-sm">
          {error}
        </div>
      )}

      {/* TABEL INVENTARIS */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Produk</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Harga</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Stok</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Terjual</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-purple-600" />
                    Memuat data katalog...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 text-sm">
                    Belum ada produk di etalase ini.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                          <ImageIcon className="w-5 h-5 text-slate-400" />
                        </div>
                        <span className="font-bold text-slate-900">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">
                      Rp {product.price.toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-bold ${product.stock < 10 ? 'text-orange-500' : 'text-emerald-600'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-100 text-slate-600 text-xs font-medium px-2.5 py-1 rounded-md border border-slate-200">
                        {product.terjual}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-slate-300 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
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

      {/* ========================================= */}
      {/* MODAL OVERLAY (MANUAL & AI VIA FOTO)       */}
      {/* ========================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Backdrop Blur */}
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
            onClick={closeModal}
          ></div>
          
          {/* Modal Box */}
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Header Modal */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                {addMode === 'ai' ? (
                  <>
                    <Sparkles className="w-5 h-5 text-purple-500" /> Asisten Etalase AI
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5 text-slate-700" /> Tambah Produk Manual
                  </>
                )}
              </h3>
              <button 
                onClick={closeModal}
                className="text-slate-400 hover:bg-slate-200 p-1 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Konten Modal */}
            <div className="p-6">
              
              {/* OPSI AI: STATE 1 (UPLOAD) */}
              {addMode === 'ai' && aiState === 'idle' && (
                <div 
                  onClick={handleUploadPhoto}
                  className="border-2 border-dashed border-purple-300 rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-purple-50 hover:border-purple-400 transition-all group"
                >
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <UploadCloud className="w-8 h-8 text-purple-600" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-lg mb-1">Unggah Foto Produk</h4>
                  <p className="text-sm text-slate-500">Klik di sini untuk memilih foto. AI akan otomatis mendeteksi nama dan kategori.</p>
                </div>
              )}

              {/* OPSI AI: STATE 2 (LOADING ANALISIS) */}
              {addMode === 'ai' && aiState === 'analyzing' && (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 border-4 border-purple-100 rounded-full"></div>
                    <div className="w-16 h-16 border-4 border-purple-600 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
                    <Sparkles className="w-6 h-6 text-purple-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-lg mb-1">AI Sedang Menganalisis...</h4>
                  <p className="text-sm text-slate-500">Mencocokkan bentuk, warna, dan estimasi harga pasar.</p>
                </div>
              )}

              {/* FORM UTAMA (Tampil jika Manual ATAU AI sudah berhasil menganalisis) */}
              {(addMode === 'manual' || (addMode === 'ai' && aiState === 'success')) && (
                <form onSubmit={handleSaveProduct} className="space-y-4 animate-in fade-in duration-300">
                  
                  {addMode === 'ai' && (
                    <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 mb-4">
                      <CheckCircle2 className="w-5 h-5 shrink-0" /> Foto berhasil diidentifikasi! Silakan periksa kembali.
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nama Produk</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Contoh: Kemeja Flanel"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors font-medium"
                    />
                  </div>

                  <div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Harga Jual</label>
                      <div className="relative">
                        <input 
                          type="number" 
                          required
                          placeholder="Rp 0"
                          value={formData.price}
                          onChange={(e) => setFormData({...formData, price: e.target.value})}
                          className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Jumlah Stok</label>
                    <input 
                      type="number" 
                      required
                      placeholder="0"
                      value={formData.stock}
                      onChange={(e) => setFormData({...formData, stock: e.target.value})}
                      className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors font-medium"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={isSaving}
                    className="w-full mt-6 bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" /> Menyimpan...
                      </>
                    ) : (
                      'Simpan ke Etalase'
                    )}
                  </button>
                </form>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
} 