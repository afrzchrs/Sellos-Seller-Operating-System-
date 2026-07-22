"use client";

import { useSession, signOut } from "next-auth/react";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Settings,
  LogOut,
  Mail,
  Lock,
  Edit2,
  Save,
  X,
  AlertTriangle,
} from "lucide-react";

const SettingsPage = () => {
  const { data: session, update } = useSession();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [email, setEmail] = useState("");
  const [tempEmail, setTempEmail] = useState("");
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [tempPassword, setTempPassword] = useState("");

  useEffect(() => {
    if (session?.user?.email) {
      setEmail(session.user.email);
    }
  }, [session]);

  const handleEditEmail = () => {
    setTempEmail(email);
    setIsEditingEmail(true);
  };

  const handleSaveEmail = async () => {
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/updateEmail", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: tempEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal memperbarui data");
      }

      // JIKA BERHASIL:
      setEmail(tempEmail);
      setIsEditingEmail(false);
      await update({ email: tempEmail });
      alert("Email berhasil diperbarui!");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // --- HANDLER PASSWORD ---
  const handleEditPassword = () => {
    setTempPassword("");
    setIsEditingPassword(true);
  };

  const handleSavePassword = async () => {
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/updateEmail", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        // PERBAIKAN: Kirim tempPassword ke backend
        body: JSON.stringify({ password: tempPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal memperbarui kata sandi");
      }

      // JIKA BERHASIL:
      setIsEditingPassword(false);
      setTempPassword("");
      alert("Kata sandi berhasil diperbarui!");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => { 
    await signOut({
      redirect: true,
      callbackUrl: "/Auth/login",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-6 lg:p-12 overflow-y-auto">
        {/* Header */}
        <div className="mb-10 max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            Pengaturan Akun <Settings className="w-7 h-7 text-slate-400" />
          </h2>
          <p className="text-slate-500 mt-2">
            Kelola informasi kredensial masuk (login) dan keamanan akun Anda di
            sini.
          </p>
        </div>

        <div className="mb-10 max-w-5xl mx-auto space-y-8">
          {/* Card: Keamanan Akun */}
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-lg text-slate-900">
                Kredensial Masuk
              </h3>
            </div>

            <div className="p-6 space-y-8">
              {/* Seksi Email */}
              <div>
                <label className="text-sm font-semibold text-slate-500 flex items-center gap-2 mb-3">
                  <Mail className="w-4 h-4" /> Alamat Email
                </label>

                {!isEditingEmail ? (
                  <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <span className="font-medium text-slate-900">{email}</span>
                    <button
                      onClick={handleEditEmail}
                      className="text-emerald-600 font-semibold text-sm flex items-center gap-1.5 hover:text-emerald-700 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" /> Ubah
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <input
                      type="email"
                      value={tempEmail}
                      onChange={(e) => setTempEmail(e.target.value)}
                      className="flex-1 px-4 py-3 bg-white border border-emerald-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all text-slate-900"
                      autoFocus
                    />
                    <button
                      onClick={handleSaveEmail}
                      className="bg-emerald-600 text-white p-3 rounded-xl hover:bg-emerald-700 transition-colors shadow-sm"
                    >
                      <Save className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setIsEditingEmail(false)}
                      className="bg-slate-100 text-slate-600 p-3 rounded-xl hover:bg-slate-200 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>

              <hr className="border-slate-100" />

              {/* Seksi Password */}
              <div>
                <label className="text-sm font-semibold text-slate-500 flex items-center gap-2 mb-3">
                  <Lock className="w-4 h-4" /> Kata Sandi
                </label>

                {!isEditingPassword ? (
                  <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <span className="font-medium text-slate-900 tracking-widest mt-1">
                      ••••••••••••
                    </span>
                    <button
                      onClick={handleEditPassword}
                      className="text-emerald-600 font-semibold text-sm flex items-center gap-1.5 hover:text-emerald-700 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" /> Ubah
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <input
                      type="password"
                      placeholder="Masukkan kata sandi baru"
                      value={tempPassword}
                      onChange={(e) => setTempPassword(e.target.value)}
                      className="flex-1 px-4 py-3 bg-white border border-emerald-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all text-slate-900"
                      autoFocus
                    />
                    <button
                      onClick={handleSavePassword}
                      className="bg-emerald-600 text-white p-3 rounded-xl hover:bg-emerald-700 transition-colors shadow-sm"
                    >
                      <Save className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingPassword(false);
                        setTempPassword("");
                      }}
                      className="bg-slate-100 text-slate-600 p-3 rounded-xl hover:bg-slate-200 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Card: Keluar / Logout */}
          <div className="bg-white border border-red-200 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-1">
                  Keluar dari Aplikasi
                </h4>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Sesi Anda di perangkat ini akan diakhiri. WiraBot akan tetap
                  berjalan dan membalas pesan pelanggan di latar belakang.
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 bg-red-50 text-red-600 border border-red-200 px-6 py-3 rounded-xl font-bold hover:bg-red-600 hover:text-white transition-all"
            >
              <LogOut className="w-5 h-5" />
              Keluar Sekarang
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
