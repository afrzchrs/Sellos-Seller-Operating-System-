'use client';

import React, { useState } from 'react';
import { Plus, Minus, MessageCircleQuestion, Mail } from 'lucide-react';
import Link from 'next/link';

// Data FAQ yang dikelompokkan
const faqs = [
  {
    category: "Pertanyaan Umum",
    items: [
      {
        q: "Apa itu Sellos dan WiraBot?",
        a: "Sellos adalah platform manajemen bisnis berbasis AI untuk UMKM. Sedangkan WiraBot adalah asisten virtual di dalam Sellos yang beroperasi langsung lewat Telegram Anda untuk mencatat keuangan, membalas chat pelanggan, dan mengecek stok."
      },
      {
        q: "Apakah saya perlu mengunduh aplikasi baru di HP?",
        a: "Tidak perlu! Untuk operasional sehari-hari seperti membalas chat dan mencatat kas, Anda cukup menggunakan Telegram. Dashboard Sellos (untuk analitik dan pengaturan) bisa diakses lewat browser web apa pun (Chrome/Safari) tanpa memakan memori HP."
      },
      {
        q: "Saya gaptek, apakah aplikasi ini sulit digunakan?",
        a: "Sama sekali tidak. Jika Anda bisa mengirim pesan suara (voice note) atau mengetik pesan di Telegram, maka Anda sudah bisa menggunakan seluruh fitur canggih aplikasi ini."
      }
    ]
  },
  {
    category: "Fitur & Operasional",
    items: [
      {
        q: "Bagaimana cara bot mencatat keuangan saya otomatis?",
        a: "Cukup kirim pesan suara ke nomor Telegram WiraBot Anda, misalnya: 'Hari ini laku 10 porsi ayam, total 200 ribu'. AI kami akan mengubah suara tersebut menjadi data dan langsung memasukkannya ke dalam tabel arus kas di dashboard Anda."
      },
      {
        q: "Apakah saya bisa mengelola lebih dari 1 toko (cabang)?",
        a: "Bisa! Sistem kami dirancang mendukung banyak usaha (Multi-Tenant). Anda bisa menambahkan Toko A, Toko B, dst dalam satu akun, dan bot akan menyesuaikan balasan berdasarkan toko yang sedang berinteraksi."
      },
      {
        q: "Bagaimana cara kerja Kreator Iklan AI?",
        a: "Anda hanya perlu mengunggah foto produk di dashboard web. AI akan menganalisis gambar tersebut dan otomatis membuatkan kata-kata promosi (copywriting) yang menarik, menonjolkan keunggulan produk Anda, siap disalin ke Instagram atau Facebook."
      }
    ]
  },
  {
    category: "Keamanan & Harga",
    items: [
      {
        q: "Apakah data keuangan dan pelanggan saya aman?",
        a: "Sangat aman. Kami menggunakan infrastruktur database standar industri (seperti PostgreSQL) dengan enkripsi penuh. Data Anda tidak akan pernah dijual atau dibagikan ke pihak ketiga."
      },
      {
        q: "Berapa biaya berlangganan Sellos?",
        a: "Kami menyediakan uji coba gratis (Free Trial) selama 14 hari tanpa perlu memasukkan kartu kredit. Setelah itu, kami memiliki paket terjangkau yang dirancang khusus untuk kantong UMKM mulai dari Rp 49.000/bulan."
      }
    ]
  }
];

const FAQPage = () => {
  // State untuk melacak item FAQ mana yang sedang terbuka
  // Format: "indexKategori-indexItem" (contoh: "0-1")
  const [openId, setOpenId] = useState<string | null>("0-0");

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-6">
            <MessageCircleQuestion className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Pusat Bantuan & FAQ
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Temukan jawaban untuk pertanyaan yang paling sering diajukan seputar Sellos dan bagaimana AI kami bisa membantu usaha Anda.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-12 mb-16">
          {faqs.map((category, catIdx) => (
            <div key={catIdx}>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                {category.category}
              </h2>
              
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                {category.items.map((item, itemIdx) => {
                  const id = `${catIdx}-${itemIdx}`;
                  const isOpen = openId === id;
                  
                  return (
                    <div 
                      key={itemIdx} 
                      className={`border-b border-slate-100 last:border-b-0 ${isOpen ? 'bg-emerald-50/30' : ''}`}
                    >
                      <button
                        onClick={() => toggleFaq(id)}
                        className="w-full flex items-center justify-between py-5 px-6 text-left focus:outline-none transition-colors hover:bg-slate-50"
                      >
                        <span className={`text-base font-semibold pr-8 ${isOpen ? 'text-emerald-700' : 'text-slate-800'}`}>
                          {item.q}
                        </span>
                        <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                          {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        </div>
                      </button>
                      
                      {/* Animasi Buka/Tutup */}
                      <div 
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                      >
                        <p className="px-6 pb-6 text-slate-600 leading-relaxed text-sm md:text-base">
                          {item.a}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Still Have Questions - CTA */}
        <div className="bg-emerald-600 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 -translate-y-8 translate-x-8 w-32 h-32 bg-emerald-500 rounded-full blur-2xl opacity-60"></div>
          
          <h3 className="relative z-10 text-2xl font-bold mb-3">
            Masih Punya Pertanyaan Lain?
          </h3>
          <p className="relative z-10 text-emerald-100 mb-8 max-w-lg mx-auto">
            Tim dukungan kami siap membantu menjawab kebingungan Anda. Jangan ragu untuk menghubungi kami.
          </p>
          <Link 
            href="mailto:halo@Sellos" 
            className="relative z-10 inline-flex items-center gap-2 bg-white text-emerald-700 px-6 py-3 rounded-full font-semibold hover:bg-emerald-50 transition-colors shadow-sm hover:shadow-md"
          >
            <Mail className="w-5 h-5" />
            Hubungi Tim Support
          </Link>
        </div>

      </div>
    </div>
  );
};

export default FAQPage;