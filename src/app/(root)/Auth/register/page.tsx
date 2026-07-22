'use client';


import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, MessageCircle, User } from 'lucide-react';

const RegisterPage = () => {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Biasakan format camelCase: setError
  const [isLoading, setIsLoading] = useState(false);

  const handleUserRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: nama, 
          email: email, 
          password: password 
        }),
      });

      // 4. Proses respons dari API
      const data = await res.json();

      if (!res.ok) {
        // Jika respons 400 atau 500, lempar pesan error dari API agar ditangkap oleh 'catch'
        throw new Error(data.message || "Gagal melakukan registrasi");
      }

      // Jika berhasil (status 201), arahkan pengguna ke halaman login
      router.push("/Auth/login");

    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan pada server");
    } finally {
      // Pastikan loading selalu dihentikan di akhir, baik berhasil maupun gagal
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-white lg:my-10 lg:rounded-[2.5rem] overflow-hidden lg:shadow-2xl max-w-7xl mx-auto">
      
      {/* KIRI: Bagian Form Registrasi */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 md:px-24 py-12 relative overflow-y-auto hide-scrollbar">

        <div className="max-w-md w-full mx-auto mt-12 lg:mt-0">
          {/* Header */}
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">
              Mulai Perjalanan Anda
            </h1>
            <p className="text-slate-500">
              Daftar sekarang dan nikmati asisten bisnis AI gratis {/*selama 14 hari. Tanpa kartu kredit.*/}
            </p>
          </div>

          {/* Form Daftar */}
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            
            {/* Input Nama Lengkap */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Nama Lengkap</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input 
                  type="text" 
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder="Budi Santoso"
                  required
                />
              </div>
            </div>

            {/* Input Email */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input 
                  type="text" 
                  value = {email}
                  onChange = {(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder="contoh@email.com"
                  required
                />
              </div>
            </div>

            {/* Input Password */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Buat Kata Sandi</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value = {password}
                  onChange = {(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder="Minimal 8 karakter"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Syarat & Ketentuan */}
            <div className="flex items-start mt-4">
              <input 
                id="terms" 
                name="terms" 
                type="checkbox" 
                className="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded cursor-pointer" 
                required
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-slate-600">
                Saya setuju dengan{' '}
                <Link href="#" className="font-semibold text-emerald-600 hover:underline">Syarat Ketentuan</Link>
                {' '}dan{' '}
                <Link href="#" className="font-semibold text-emerald-600 hover:underline">Kebijakan Privasi</Link> Laris.in.
              </label>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              onClick={handleUserRegister}
              disabled={isLoading}
              className="w-full bg-emerald-600 text-white font-bold rounded-xl py-3.5 hover:bg-emerald-700 transition-colors shadow-sm hover:shadow-md mt-2"
            >
              {isLoading ? "Memuat" : "Buat Akun Gratus"}
            </button>
          </form>

          {/* Pemisah (Divider) */}
          <div className="mt-8 flex items-center justify-between">
            <span className="w-1/5 border-b border-slate-200 lg:w-1/4"></span>
            <span className="text-xs text-center text-slate-400 uppercase font-semibold">atau daftar cepat</span>
            <span className="w-1/5 border-b border-slate-200 lg:w-1/4"></span>
          </div>

          {/* Social Logins */}
          <div className="mt-6 flex flex-col gap-3">
            <button className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 rounded-xl py-3 text-slate-700 font-semibold hover:bg-slate-50 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Daftar dengan Google
            </button>
          </div>

          {/* Link Login */}
          <div className="mt-8 mb-8 text-center">
            <p className="text-slate-600 text-sm">
              Sudah punya akun?{' '}
              <Link href="/Auth/login" className="font-bold text-emerald-600 hover:text-emerald-700">
                Masuk di sini
              </Link>
            </p>
          </div>

        </div>
      </div>

      {/* KANAN: Visual Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-emerald-900 items-center justify-center p-12">
        {/* Dekorasi Background */}
        <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-emerald-600 to-emerald-900 opacity-90 z-0"></div>
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-emerald-500 rounded-full blur-3xl opacity-40 z-0"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-emerald-400 rounded-full blur-3xl opacity-20 z-0"></div>

        {/* Konten Value Proposition */}
        <div className="relative z-10 max-w-lg text-white">
          <div className="grid grid-cols-2 gap-6 mb-12">
            {/* Benefit Card 1 */}
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
              <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center mb-4">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">CS Otomatis</h3>
              <p className="text-emerald-100 text-sm">Bot AI siap membalas chat pelanggan 24/7 tanpa henti.</p>
            </div>
            
            {/* Benefit Card 2 */}
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 mt-8">
              <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Rekap Kas Instan</h3>
              <p className="text-emerald-100 text-sm">Ucapkan selamat tinggal pada buku catatan yang berantakan.</p>
            </div>
          </div>

          <h2 className="text-3xl font-extrabold leading-tight mb-4">
            Bergabunglah dengan ribuan UMKM cerdas lainnya.
          </h2>
          <p className="text-emerald-100 text-lg">
            Buat akun dalam 30 detik. Tidak ada biaya tersembunyi, Anda bebas membatalkan kapan saja.
          </p>
        </div>
      </div>
      
    </div>
  );
}

export default RegisterPage;