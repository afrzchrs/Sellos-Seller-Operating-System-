import React from 'react';
import { TrendingDown, MessageCircleX, BookX } from 'lucide-react';

const ProblemAgitation = () => {
  const painPoints = [
    {
      icon: <BookX className="w-8 h-8 text-emerald-600" />,
      stat: "12%",
      title: "Gagal Go-Digital",
      desc: "Hanya 12% UMKM yang berhasil pakai teknologi. Sisanya masih pusing dengan aplikasi ribet dan pembukuan manual."
    },
    {
      icon: <TrendingDown className="w-8 h-8 text-emerald-600" />,
      stat: "60%",
      title: "Terjebak Perang Harga",
      desc: "Mayoritas UMKM mengeluh susah bersaing di marketplace karena terus-terusan banting harga dengan toko besar."
    },
    {
      icon: <MessageCircleX className="w-8 h-8 text-emerald-600" />,
      stat: "44%",
      title: "Minim Literasi Promosi",
      desc: "Banyak yang kebingungan membuat konten iklan dan kewalahan membalas chat pelanggan yang menumpuk sendirian."
    }
  ];

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-6 leading-tight">
            Kenyataan Pahit: Jualan Zaman Sekarang <br className="hidden md:block" /> Makin Terasa Melelahkan
          </h2>
          <p className="text-lg text-slate-600">
            Transformasi digital seringkali terlalu rumit dan mahal. Akibatnya, potensi besar usaha Anda terbuang hanya karena kehabisan waktu mengurus hal teknis.
          </p>
        </div>

        {/* Pain Points Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {painPoints.map((point, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300 group hover:-translate-y-1"
            >
              <div className="bg-emerald-50 w-16 h-16 rounded-xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                {point.icon}
              </div>
              <h3 className="text-5xl font-extrabold text-slate-900 mb-3 tracking-tight">
                {point.stat}
              </h3>
              <h4 className="text-xl font-bold text-slate-800 mb-3">
                {point.title}
              </h4>
              <p className="text-slate-600 leading-relaxed">
                {point.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ProblemAgitation;