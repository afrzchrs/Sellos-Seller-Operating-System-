'use client';

import React, { useState } from 'react';
import { Coffee, ShoppingBag, Scissors, CheckCircle2, MessageSquare } from 'lucide-react';

const UseCases = () => {
  const [activeTab, setActiveTab] = useState(0);

  const industries = [
    {
      id: 'kuliner',
      name: 'Kuliner & F&B',
      icon: <Coffee className="w-5 h-5" />,
      color: 'bg-orange-500',
      lightColor: 'bg-orange-50',
      title: 'Fokus Masak, Biar Bot yang Terima Orderan',
      description: 'Jam makan siang seringkali bikin kewalahan? WiraBot otomatis merekap pesanan dari WhatsApp, menghitung total harga, dan langsung memotong stok harian Anda.',
      benefits: [
        'Terima pesanan WhatsApp 24/7 otomatis',
        'Potong stok bahan baku (beras, ayam, dll) real-time',
        'Analitik menu paling laris di akhir minggu'
      ],
      mockupMsg: "Halo! Kopi Susu Aren sisa 15 cup ya kak. Mau pesan berapa dan dikirim ke mana?"
    },
    {
      id: 'kriya-fashion',
      name: 'Kriya & Fashion',
      icon: <ShoppingBag className="w-5 h-5" />,
      color: 'bg-emerald-500',
      lightColor: 'bg-emerald-50',
      title: 'Bikin Konten Estetik & Siap Ekspor',
      description: 'Jualan baju atau kerajinan butuh visual dan kata-kata menarik. AI kami membantu Anda membuat caption yang menjual, sekaligus menerjemahkannya untuk pasar luar negeri.',
      benefits: [
        'Generator caption anti-perang harga',
        'Translate deskripsi produk instan (Inggris/Jepang)',
        'Bot pintar untuk jawab pertanyaan ukuran & warna'
      ],
      mockupMsg: "Ready kak! Kemeja Batik motif Mega Mendung ukuran L masih tersedia. Mau langsung checkout?"
    },
    {
      id: 'jasa',
      name: 'Jasa & Servis',
      icon: <Scissors className="w-5 h-5" />,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-50',
      title: 'Atur Jadwal & Jawab FAQ Tanpa Ribet',
      description: 'Buka salon, bengkel, atau jasa servis AC? Jangan biarkan pelanggan kabur karena Anda telat membalas harga layanan atau jadwal kosong.',
      benefits: [
        'Bot menjawab daftar harga (Pricelist) instan',
        'Pencatatan uang masuk dan keluar via pesan suara',
        'Pengingat jadwal pelanggan otomatis'
      ],
      mockupMsg: "Untuk cuci AC harganya Rp 75.000 kak. Jadwal teknisi besok jam 10 pagi masih kosong, mau di-booking?"
    }
  ];

  return (
    <section className="py-24 bg-white" id="solutions">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-6 leading-tight">
            Apapun Usahanya, <br className="hidden md:block" /> Asistennya Tetap Laris.in
          </h2>
          <p className="text-lg text-slate-600">
            Punya warung makan sekaligus toko baju? Tidak masalah. Kelola banyak usaha dengan karakter bot yang menyesuaikan bisnis Anda.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-12">
          <div className="flex space-x-2 md:space-x-4 p-1.5 bg-slate-100 rounded-2xl overflow-x-auto w-full md:w-auto hide-scrollbar">
            {industries.map((industry, index) => (
              <button
                key={industry.id}
                onClick={() => setActiveTab(index)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                  activeTab === index 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className={`${activeTab === index ? industry.color.replace('bg-', 'text-') : 'text-slate-400'}`}>
                  {industry.icon}
                </div>
                <span>{industry.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-slate-50 rounded-3xl p-8 lg:p-12 border border-slate-100">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            
            {/* Left Content: Description & Benefits */}
            <div className="w-full lg:w-1/2 space-y-8 animate-fadeIn">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  {industries[activeTab].title}
                </h3>
                <p className="text-slate-600 leading-relaxed text-lg">
                  {industries[activeTab].description}
                </p>
              </div>

              <ul className="space-y-4">
                {industries[activeTab].benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                    <span className="text-slate-700 font-medium">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Content: Mini Visual / Chat Mockup */}
            <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md">
                {/* Decorative background blob */}
                <div className={`absolute inset-0 ${industries[activeTab].lightColor} rounded-full blur-3xl opacity-50 -z-10`}></div>
                
                {/* Mockup Card */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xl relative">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                    <div className={`w-10 h-10 rounded-full ${industries[activeTab].color} flex items-center justify-center text-white`}>
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Simulasi WiraBot</p>
                      <p className="text-xs text-slate-500">Berespon dalam 2 detik</p>
                    </div>
                  </div>
                  
                  <div className="bg-[#DCF8C6] p-4 rounded-xl rounded-tl-none border border-green-100 shadow-sm inline-block">
                    <p className="text-slate-800 text-sm leading-relaxed">
                      {industries[activeTab].mockupMsg}
                    </p>
                  </div>
                  
                  {/* Decorative element */}
                  <div className="mt-8 flex gap-2">
                    <div className="h-2 w-16 bg-slate-100 rounded-full"></div>
                    <div className="h-2 w-8 bg-slate-100 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default UseCases;