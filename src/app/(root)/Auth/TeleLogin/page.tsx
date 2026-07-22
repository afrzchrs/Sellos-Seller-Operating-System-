"use client";

import React, { useState, useEffect, useRef } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MessageCircle, Loader2, ArrowLeft } from "lucide-react";

export default function WaLoginPage() {
  const router = useRouter();

  // State Manajemen
  const [step, setStep] = useState<1 | 2>(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);

  // Reference untuk auto-focus input OTP
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Efek untuk Hitung Mundur (Countdown) Kirim Ulang OTP
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  // Efek untuk auto-focus ke kotak pertama saat masuk ke tahap 2
  useEffect(() => {
    if (step === 2) {
      otpRefs.current[0]?.focus();
    }
  }, [step]);

  // TAHAP 1: Handler Kirim Nomor WA
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (phone.length < 9) {
      setError("Masukkan nomor WhatsApp yang valid.");
      return;
    }

    setIsLoading(true);

    try {
      // Pemanggilan API Pengirim OTP (Pastikan route /api/send-wa-otp sudah dibuat)
      const res = await fetch("/api/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal mengirim OTP");
      }

      setIsLoading(false);
      setStep(2);
      setCountdown(60); // Mulai hitung mundur 60 detik
    } catch (err: any) {
      setIsLoading(false);
      setError(err.message || "Gagal mengirim kode OTP. Silakan coba lagi.");
    }
  };

  // Handler Perubahan Input pada Kotak OTP
  const handleChangeOtp = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Hanya izinkan angka

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Otomatis pindah fokus ke kotak berikutnya
    if (value !== "" && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };
  // TAHAP 2: Handler Verifikasi OTP & Login NextAuth
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const otpString = otp.join("");
    if (otpString.length < 6) {
      setError("Masukkan 6 digit kode OTP dengan lengkap.");
      return;
    }

    setIsLoading(true);

    try {
      // Eksekusi Login NextAuth
      const result = await signIn("login-wa", {
        phone: phone,
        otp: otpString,
        redirect: false, // Mencegah reload agar error bisa ditangkap state
      });

      if (result?.error) {
        setError(result.error); // Menangkap pesan dari authOptions (misal: "OTP salah")
        setIsLoading(false);
      } else {
        // Jika sukses, arahkan ke Dashboard
        router.push("/dashboard/hub");
        router.refresh();
      }
    } catch (err) {
      setIsLoading(false);
      setError("Terjadi kesalahan pada server saat verifikasi.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-8 sm:p-10">
          {/* Bagian Header Form */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4 text-emerald-600">
              <MessageCircle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Masuk ke Akun</h2>
            <p className="text-slate-500 text-sm mt-2">
              {step === 1
                ? "Gunakan username telegram andas."
                : "Masukkan 6 digit kode verifikasi."}
            </p>
          </div>

          {/* Menampilkan Pesan Error */}
          {error && (
            <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm font-semibold rounded-xl text-center border border-red-100 animate-in fade-in">
              {error}
            </div>
          )}

          {/* ============================================== */}
          {/* TAHAP 1: FORM INPUT NOMOR WHATSAPP               */}
          {/* ============================================== */}
          {step === 1 && (
            <form
              onSubmit={handleSendOtp}
              className="space-y-6 animate-in fade-in slide-in-from-left-4"
            >
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Username Telegram
                </label>
                <div className="relative flex items-center">
                  {/*<span className="absolute left-4 text-slate-500 font-bold border-r border-slate-200 pr-3">
                    +62
                  </span>*/}
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value.replace(/\D/g, ""))
                    } // Hanya terima angka
                    placeholder="username telegram anda"
                    className="w-full pl-4 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold text-lg focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || phone.length < 9}
                className="w-full bg-emerald-600 text-white font-bold py-3.5 rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 disabled:bg-emerald-400 disabled:cursor-not-allowed shadow-md shadow-emerald-200"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : null}
                {isLoading ? "Mengirim Kode..." : "Kirim Kode OTP"}
              </button>
            </form>
          )}

          {/* ============================================== */}
          {/* TAHAP 2: FORM VERIFIKASI OTP                     */}
          {/* ============================================== */}
          {step === 2 && (
            <form
              onSubmit={handleVerifyOtp}
              className="space-y-8 animate-in fade-in slide-in-from-right-4"
            >
              {/* Info Nomor & Tombol Kembali */}
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-sm font-bold text-slate-700 tracking-wide">
                  +62 {phone}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setOtp(["", "", "", "", "", ""]);
                    setError("");
                  }}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                >
                  <ArrowLeft className="w-3 h-3" /> Ubah
                </button>
              </div>

              {/* Input OTP Modern (Split Boxes) */}
              <div className="flex justify-between gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      otpRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    value={digit}
                    onChange={(e) => handleChangeOtp(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-14 text-center text-2xl font-bold bg-white border border-slate-300 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none transition-all text-slate-900"
                    maxLength={1}
                  />
                ))}
              </div>

              {/* Tombol Submit & Resend */}
              <div className="space-y-4">
                <button
                  type="submit"
                  disabled={isLoading || otp.join("").length < 6}
                  className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 disabled:bg-slate-400 disabled:cursor-not-allowed shadow-md"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : null}
                  {isLoading ? "Memverifikasi..." : "Verifikasi & Masuk"}
                </button>

                <div className="text-center">
                  {countdown > 0 ? (
                    <p className="text-sm text-slate-500 font-medium">
                      Kirim ulang kode dalam{" "}
                      <span className="font-bold text-slate-900">
                        {countdown}s
                      </span>
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="text-sm font-bold text-emerald-600 hover:text-emerald-700"
                    >
                      Kirim Ulang OTP
                    </button>
                  )}
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
