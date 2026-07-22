import React from 'react';
import { Sparkles, Globe2, TrendingUp, MessageCircle, ArrowRight, ImagePlus } from 'lucide-react';

const Features = () => {
  return (
    <section className="py-24 bg-slate-50" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-6 leading-tight">
            Satu Aplikasi, <span className="text-emerald-600">Beragam Superpower</span>
          </h2>
          <p className="text-lg text-slate-600">
            Laris.in mengemas kecerdasan buatan kelas dunia ke dalam fitur-fitur sederhana yang siap membantu usaha Anda naik kelas.
          </p>
        </div>

        {/* Bento Box Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1: Kreator Konten (Large - takes 2 columns on large screens) */}
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow lg:col-span-2 group overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -z-10 group-hover:scale-125 transition-transform duration-500"></div>
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
              <ImagePlus className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">
              Kreator Iklan Anti-Perang Harga
            </h3>
            <p className="text-slate-600 mb-6 max-w-md">
              Cukup unggah foto produk sederhana. AI kami akan menyulapnya menjadi caption Instagram/Facebook yang menonjolkan nilai jual unik (USP), bukan sekadar banting harga.
            </p>
            {/* Mini mockup inside card */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-start gap-4">
              <Sparkles className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
              <p className="text-sm text-slate-700 italic">
                "Dibuat dari kayu jati pilihan dengan ukiran tangan asli Jepara. Bawa nuansa elegan ke ruang tamu Anda hari ini!"
              </p>
            </div>
          </div>

          {/* Card 2: Ekspor Instan */}
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <Globe2 className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              Siap Ekspor Instan
            </h3>
            <p className="text-slate-600 mb-6">
              Otomatis terjemahkan deskripsi produk Anda ke Bahasa Inggris, Mandarin, atau Jepang yang ramah algoritma SEO global.
            </p>
            <div className="flex gap-2">
              <span className="bg-slate-100 text-slate-600 text-xs px-3 py-1 rounded-full font-medium">🇮🇩 ID</span>
              <ArrowRight className="w-4 h-4 text-slate-400 mt-1" />
              <span className="bg-blue-50 text-blue-600 text-xs px-3 py-1 rounded-full font-medium">🇬🇧 EN</span>
              <span className="bg-blue-50 text-blue-600 text-xs px-3 py-1 rounded-full font-medium">🇯🇵 JP</span>
            </div>
          </div>

          {/* Card 3: Customer Service */}
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
              <MessageCircle className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              CS Otomatis 24/7
            </h3>
            <p className="text-slate-600">
              Pelanggan chat jam 2 pagi? Tidak masalah. Bot akan menjawab ketersediaan stok, harga, dan mencatat pesanan dengan bahasa yang natural dan sopan.
            </p>
          </div>

          {/* Card 4: Analitik AI (Large - takes 2 columns) */}
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow lg:col-span-2 group">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">
              Nadi Bisnis & Analitik Naratif
            </h3>
            <p className="text-slate-600 mb-6">
              Lupakan grafik rumit yang bikin pusing. AI kami membaca data penjualan Anda dan menceritakannya layaknya seorang konsultan bisnis pribadi.
            </p>
            {/* Mini mockup for insight */}
            <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
              <h4 className="text-sm font-bold text-orange-800 mb-1">💡 Insight Minggu Ini:</h4>
              <p className="text-sm text-orange-700">
                Penjualan produk "Kopi Susu Aren" naik tajam setiap hari Jumat sore. <strong>Saran:</strong> Buat promo bundling dengan cemilan khusus di akhir pekan untuk menaikkan total transaksi!
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Features;