import React from 'react';
import { Rocket, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const CTA = () => {
  return (
    <section className="py-24 bg-white relative" id="cta">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* CTA Card */}
        <div className="relative bg-emerald-600 rounded-[2.5rem] px-6 py-16 md:px-16 md:py-20 text-center overflow-hidden shadow-2xl">
          
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64
           bg-emerald-500 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-64 h-64
           bg-emerald-700 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

          {/* Icon */}
          <div className="relative z-10 flex justify-center mb-8">
            <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
              <Rocket className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Copywriting */}
          <h2 className="relative z-10 text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
            Siap Bawa Usahamu <br className="hidden md:block" /> Naik Kelas Hari Ini?
          </h2>
          <p className="relative z-10 text-emerald-50 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Tinggalkan cara manual yang melelahkan. Biarkan AI mengurus operasional, 
            membalas chat, dan mencatat keuangan, sementara Anda fokus mengembangkan bisnis.
          </p>

          {/* Action Buttons */}
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/register" 
              className="w-full sm:w-auto flex items-center justify-center gap-2
               bg-white text-emerald-700 px-8 py-4 rounded-full font-bold text-lg
               hover:bg-slate-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              Coba Gratis Sekarang
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Microcopy / Trust Badges */}
          <div className="relative z-10 mt-8 flex flex-col sm:flex-row items-center justify-center gap-4
           text-emerald-100 text-sm font-medium">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Daftar pakai nomor WhatsApp</span>
            </div>
            {/*<div className="hidden sm:block w-1 h-1 bg-emerald-400 rounded-full"></div>*/}
            {/*<div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Gratis uji coba 14 hari</span>
            </div>*/}
            <div className="hidden sm:block w-1 h-1 bg-emerald-400 rounded-full"></div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Tanpa kartu kredit</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CTA;