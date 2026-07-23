import React from 'react';
import { Mic, BrainCircuit, BarChart3, Play, CheckCheck } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: <Mic className="w-6 h-6 text-white" />,
      title: "1. Rekam Pesan Suara",
      desc: "Tidak perlu mengetik atau isi formulir rumit. Cukup kirim voice note ke nomor WhatsApp WiraBot tentang transaksi atau pesanan hari ini."
    },
    {
      icon: <BrainCircuit className="w-6 h-6 text-white" />,
      title: "2. AI Cerdas Memproses",
      desc: "Generative AI kami akan membedah pesan suara Anda, mengenali nama barang, jumlah, dan total harga secara otomatis dalam hitungan detik."
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-white" />,
      title: "3. Laporan Otomatis Selesai",
      desc: "Stok barang terpotong, laporan kas harian tercatat di dashboard, dan Anda siap melanjutkan aktivitas tanpa pusing pembukuan."
    }
  ];

  return (
    <section className="py-24 bg-white" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-6 leading-tight">
            Semudah Mengirim Chat ke Teman
          </h2>
          <p className="text-lg text-slate-600">
            Tinggalkan cara lama. Sellos menyulap WhatsApp Anda menjadi asisten bisnis pintar yang bekerja 24 jam penuh.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          
          {/* Left Side: Steps */}
          <div className="w-full lg:w-1/2 space-y-8">
            {steps.map((step, index) => (
              <div key={index} className="flex gap-6 group">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300">
                    {step.icon}
                  </div>
                  {/* Vertical line connecting steps (except for the last one) */}
                  {index !== steps.length - 1 && (
                    <div className="w-0.5 h-full bg-emerald-100 mt-4"></div>
                  )}
                </div>
                <div className="pb-8">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))} 
          </div>

          {/* Right Side: Phone Mockup (CSS Only) */}
          <div className="w-full lg:w-1/2 flex justify-center">
            {/* Phone Frame */}
            <div className="relative border-8px border-slate-900 bg-slate-900 rounded-[2.5rem] h-137.5 w-75 shadow-2xl overflow-hidden">
              
              {/* Phone Screen */}
              <div className="absolute inset-0 bg-[#E5DDD5] flex flex-col">
                
                {/* App Bar (WhatsApp Style) */}
                <div className="bg-[#075E54] px-4 py-3 flex items-center gap-3 shadow-sm z-10">
                  <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">
                    WB
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-sm">WiraBot</h4>
                    <p className="text-emerald-100 text-[10px]">Online</p>
                  </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                  
                  {/* Date Badge */}
                  <div className="flex justify-center">
                    <span className="bg-white/60 text-slate-500 text-[10px] px-3 py-1 rounded-lg">
                      Hari ini
                    </span>
                  </div>

                  {/* User Chat (Voice Note) */}
                  <div className="flex justify-end">
                    <div className="bg-[#DCF8C6] rounded-lg rounded-tr-none p-2 shadow-sm max-w-[85%] border border-green-100">
                      <div className="flex items-center gap-3">
                        <Play className="w-6 h-6 text-slate-500 fill-slate-500" />
                        <div className="w-24 h-1 bg-emerald-400 rounded-full relative">
                          <div className="absolute w-2 h-2 bg-emerald-600 rounded-full top-1/2 -translate-y-1/2 left-[30%]"></div>
                        </div>
                        <span className="text-slate-500 text-xs">0:08</span>
                      </div>
                      <div className="flex justify-end items-center gap-1 mt-1">
                        <span className="text-[10px] text-slate-400">14:02</span>
                        <CheckCheck className="w-3 h-3 text-blue-500" />
                      </div>
                    </div>
                  </div>

                  {/* Bot Chat (Processing AI Text) */}
                  <div className="flex justify-start">
                    <div className="bg-white rounded-lg rounded-tl-none p-3 shadow-sm max-w-[90%] border border-slate-100">
                      <p className="text-slate-800 text-sm leading-relaxed">
                        <span className="font-semibold">Siap, Bos! 🤖</span><br/><br/>
                        Transaksi dicatat:<br/>
                        ✅ 5 Porsi Ayam Geprek<br/>
                        💰 Pemasukan: Rp 100.000<br/><br/>
                        Stok ayam dipotong, sisa: 15 porsi. Laporan kas sudah diupdate di web.
                      </p>
                      <div className="flex justify-end mt-1">
                        <span className="text-[10px] text-slate-400">14:02</span>
                      </div>
                    </div>
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

export default HowItWorks;