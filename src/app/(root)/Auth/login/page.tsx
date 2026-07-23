"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
  MessageCircle,
} from "lucide-react";
const LoginPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [error, seterror] = useState("");
  const [isloading, setIsLoading] = useState(false);

  const handleGoogleLogin = () => {
    // Akan otomatis melempar user ke halaman Google dan kembali ke /dashboard
    signIn("google", { callbackUrl: "/dashboard/hub" });
  };

  const handleUserLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    seterror("");
    setIsLoading(true);
    try{
      const result = await signIn("login-email", {
        email: email, 
        password: password,
        redirect: false, 
      });
  
      if (result?.error) {
        console.log("Gagal login:", result.error);
        console.log({error})
        alert("Password atau email tidak terdaftar")
      } else {
        console.log("Berhasil login!");
        router.push("/dashboard/hub");
        router.refresh();
      }
    }catch(err:any){
      setIsLoading(false);
      seterror(err.message || "Gagal mengirim data ke server. Coba lagi");
    }finally{
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-white my-10 rounded-[2.5rem] overflow-hidden">
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-20 md:px-24 py-12 ">
        <Link
          href="/"
          className="absolute top-8 left-8 sm:left-12 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Beranda
        </Link>

        <div className="max-w-md w-full mx-auto">
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">
              Selamat Datang Kembali
            </h1>
            <p className="text-slate-500">
              Masuk ke dashboad Sellos untuk mulai memantau penjualan dan
              mengelola WiraBot Anda.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleUserLogin}>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange = {
                    (e) => setemail(e.target.value)
                  }
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder="contoh@email.com atau 0812..."
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-700">
                  Kata Sandi
                </label>
                <Link
                  href="/lupa-password"
                  className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
                >
                  Lupa sandi?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange = {
                    (e) => setpassword(e.target.value)
                  }
                  className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded cursor-pointer"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-slate-600 cursor-pointer"
              >
                Ingat saya di perangkat ini
              </label>
            </div>

            <button
              type="submit"
              onClick = {handleUserLogin}
              disabled={isloading}
              className="w-full bg-emerald-600 text-white font-bold rounded-xl py-3.5 hover:bg-emerald-700 transition-colors shadow-sm hover:shadow-md"
            >
              {isloading ? "memuat" : "Masuk"}
            </button>
          </form>

          <div className="mt-8 flex items-center justify-between">
            <span className="w-1/5 border-b border-slate-200 lg:w-1/4"></span>
            <span className="text-xs text-center text-slate-400 uppercase font-semibold">
              atau masuk dengan
            </span>
            <span className="w-1/5 border-b border-slate-200 lg:w-1/4"></span>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 rounded-xl py-3 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </button>
          </div>

          <div className="mt-10 text-center">
            <p className="text-slate-600 text-sm">
              Belum punya akun?{" "}
              <Link
                href="/Auth/register"
                className="font-bold text-emerald-600 hover:text-emerald-700"
              >
                Daftar Gratis Sekarang
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex lg:w-1/2 relative bg-emerald-900 overflow-hidden items-center justify-center p-12">
        <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-emerald-600 to-emerald-900 opacity-90 z-0"></div>
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-emerald-500 rounded-full blur-3xl opacity-40 z-0"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-emerald-400 rounded-full blur-3xl opacity-20 z-0"></div>

        <div className="relative z-15 max-w-lg text-white">
          <div className="w-16 h-16 bg-white/20 rounded-2xl backdrop-blur-md flex items-center justify-center mb-8 border border-white/30">
            <span className="text-2xl font-bold text-white">Sell.</span>
          </div>
          <h2 className="text-4xl font-extrabold leading-tight mb-6">
            Jalankan bisnis tanpa pusing pembukuan manual.
          </h2>
          <p className="text-emerald-100 text-lg mb-10 leading-relaxed">
            "Semenjak pakai Sellos, saya gak pernah lagi salah catat stok atau
            kelewatan balas chat pelanggan. Semua sudah diurus sama AI, saya
            tinggal fokus masak."
          </p>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-700 rounded-full overflow-hidden border-2 border-emerald-400">
              <div className="w-full h-full bg-emerald-300 flex items-center justify-center text-emerald-800 font-bold">
                B
              </div>
            </div>
            <div>
              <p className="font-bold text-white">Budi Santoso</p>
              <p className="text-sm text-emerald-200">
                Pemilik Warung Ayam Geprek
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
