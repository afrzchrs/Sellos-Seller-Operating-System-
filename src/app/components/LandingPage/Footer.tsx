import React from 'react';
import Link from 'next/link';
import { MessageCircle, Mail } from 'lucide-react';
import { FaFacebook, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 pt-16 pb-8 border-t border-slate-800 w-full bottom-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Section: Link & Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="text-2xl font-bold text-white tracking-tight">
              Sellos.
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Platform asisten bisnis cerdas berbasis AI untuk bantu UMKM Indonesia naik kelas, kelola operasional cukup dari WhatsApp.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-emerald-600 hover:text-white transition-all">
                <FaInstagram className="w-5 h-5"/>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-emerald-600 hover:text-white transition-all">
                <FaFacebook className="w-5 h-5"/>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-emerald-600 hover:text-white transition-all">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Produk */}
          <div>
            <h4 className="text-white font-semibold mb-6">Produk</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li>
                <Link href="#features" className="hover:text-emerald-400 transition-colors">Fitur Unggulan</Link>
              </li>
              <li>
                <Link href="#solutions" className="hover:text-emerald-400 transition-colors">Solusi Industri</Link>
              </li>
              <li>
                <Link href="#pricing" className="hover:text-emerald-400 transition-colors">Paket Harga</Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-emerald-400 transition-colors">Coba Gratis</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Bantuan & Edukasi (Tempat FAQ Berada) */}
          <div>
            <h4 className="text-white font-semibold mb-6">Bantuan</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li>
                <Link href="/faq" className="hover:text-emerald-400 transition-colors">FAQ / Tanya Jawab</Link>
              </li>
              <li>
                <Link href="/panduan" className="hover:text-emerald-400 transition-colors">Panduan Penggunaan</Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-emerald-400 transition-colors">Blog & Edukasi Bisnis</Link>
              </li>
              <li>
                <a href="mailto:bantuan@Sellos" className="inline-flex items-center gap-2 hover:text-emerald-400 transition-colors">
                  <Mail className="w-4 h-4" /> bantuan@Sellos
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Legalitas */}
          <div>
            <h4 className="text-white font-semibold mb-6">Legalitas</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li>
                <Link href="/syarat-ketentuan" className="hover:text-emerald-400 transition-colors">Syarat & Ketentuan</Link>
              </li>
              <li>
                <Link href="/kebijakan-privasi" className="hover:text-emerald-400 transition-colors">Kebijakan Privasi</Link>
              </li>
              <li>
                <Link href="/keamanan-data" className="hover:text-emerald-400 transition-colors">Keamanan Data</Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Section: Copyright */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm text-center md:text-left">
            &copy; {currentYear} Sellos (PT Solusi AI Indonesia). Hak Cipta Dilindungi.
          </p>
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <span>Dibuat dengan ❤️ untuk UMKM Indonesia</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;