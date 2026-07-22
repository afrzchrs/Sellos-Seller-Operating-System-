"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Bot,
  Save,
  MessageSquare,
  ToggleRight,
  ToggleLeft,
  Send,
} from "lucide-react";

export default function WiraBotSettingPage() {
  const params = useParams();
  const storeId = params.StoreId || params.id; // Pastikan storeId tersedia

  // 1. STATE MANAGEMENT PENGATURAN
  const [isGlobalActive, setIsGlobalActive] = useState(true);
  const [customRules, setCustomRules] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Ambil data pengaturan saat komponen pertama kali dimuat
  useEffect(() => {
    if (!storeId) return;
    const fetchSettings = async () => {
      try {
        const res = await fetch(`/api/bot-setting?storeId=${storeId}`);
        const result = await res.json();
        if (result.success && result.data) {
          setIsGlobalActive(result.data.is_global_active);
          setCustomRules(result.data.custom_rules);
        }
      } catch (err) {
        console.error("Gagal memuat pengaturan:", err);
      }
    };
    fetchSettings();
  }, [storeId]);

  // 2. STATE UNTUK SIMULATOR CHAT (TESTING)
  const [testInput, setTestInput] = useState("");
  const [testMessages, setTestMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Halo! Ada yang bisa WiraBot bantu hari ini?",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false); // Tambahan state indikator loading AI

  // 3. FUNGSI SIMPAN PENGATURAN
  const handleSave = async () => {
    if (!storeId) return;
    setIsSaving(true);

    try {
      const res = await fetch(`/api/bot-setting?storeId=${storeId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isGlobalActive, customRules }),
      });

      const result = await res.json();
      if (result.success) {
        alert("Pengaturan WiraBot berhasil disimpan!");
      } else {
        alert("Gagal menyimpan pengaturan.");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setIsSaving(false);
    }
  };

  // 4. FUNGSI SIMULASI BALASAN CHAT TESTER
  const handleTestChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testInput.trim()) return;

    // Tambahkan pesan user ke UI
    const newUserMsg = {
      id: testMessages.length + 1,
      sender: "user",
      text: testInput,
    };
    setTestMessages((prev) => [...prev, newUserMsg]);

    const currentInput = testInput;
    setTestInput("");
    setIsTyping(true); // AI mulai "mengetik"

    try {
      // Tembak ke API Chat Tester
      const res = await fetch("/api/chat-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: currentInput,
          customRules: customRules,
        }),
      });

      const result = await res.json();

      if (result.success) {
        setTestMessages((prev) => [
          ...prev,
          { id: prev.length + 1, sender: "bot", text: result.reply },
        ]);
      }
    } catch (err) {
      setTestMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          sender: "bot",
          text: "Maaf, terjadi error saat menghubungi AI.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10 pt-20 px-10">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            Pengaturan WiraBot <Bot className="w-7 h-7 text-emerald-500" />
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Kelola status operasional bot dan instruksi khusus untuk toko Anda.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-sm shadow-emerald-200 disabled:bg-emerald-400"
        >
          {isSaving ? (
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <Save className="w-5 h-5" />
          )}
          {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* KOLOM KIRI: FORM PENGATURAN */}
        <div className="w-full lg:w-7/12 space-y-6">
          {/* 1. Toggle Utama (Status Global) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${isGlobalActive ? "bg-emerald-100" : "bg-slate-100"}`}
              >
                <Bot
                  className={`w-6 h-6 ${isGlobalActive ? "text-emerald-600" : "text-slate-400"}`}
                />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">
                  Status WiraBot (Global)
                </h3>
                <p className="text-sm text-slate-500">
                  {isGlobalActive
                    ? "Bot saat ini aktif membalas otomatis 24/7."
                    : "Bot dinonaktifkan. Anda membalas manual."}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsGlobalActive(!isGlobalActive)}
              className="transition-transform hover:scale-105"
            >
              {isGlobalActive ? (
                <ToggleRight className="w-12 h-12 text-emerald-500" />
              ) : (
                <ToggleLeft className="w-12 h-12 text-slate-300" />
              )}
            </button>
          </div>

          {/* 2. Instruksi Tambahan (Custom Prompt) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 text-lg mb-2">
              Instruksi Khusus (Opsional)
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              Berikan aturan atau perilaku khusus kepada AI saat merespons
              pelanggan di toko ini.
            </p>

            <textarea
              value={customRules}
              onChange={(e) => setCustomRules(e.target.value)}
              placeholder="Contoh: Selalu ingatkan pembeli tentang promo gratis ongkir minimal belanja Rp 50.000. Jangan tawarkan produk dari kategori lain."
              className="w-full h-40 bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 resize-none font-medium text-slate-700"
            ></textarea>
          </div>
        </div>

        {/* KOLOM KANAN: LIVE PREVIEW (TESTER BOT) */}
        <div className="w-full lg:w-5/12">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden sticky top-6">
            <div className="bg-slate-900 px-6 py-4 flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="ml-2 text-sm font-bold text-slate-300 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" /> Live Preview WiraBot
              </span>
            </div>

            <div className="bg-[#E5DDD5] h-100 flex flex-col relative">
              <div className="absolute inset-0 opacity-10 bg-[url('https://i.pinimg.com/736x/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg')] bg-cover mix-blend-multiply pointer-events-none"></div>

              {/* Pesan Tester */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 z-10">
                {testMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm shadow-sm ${
                        msg.sender === "user"
                          ? "bg-[#D9FDD3] text-slate-900 rounded-tr-none"
                          : "bg-white text-slate-900 rounded-tl-none border border-slate-100"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Tester */}
              <div className="p-3 bg-white z-10 flex items-center gap-2">
                <form onSubmit={handleTestChat} className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={testInput}
                    onChange={(e) => setTestInput(e.target.value)}
                    placeholder="Ketik pesan tes..."
                    className="flex-1 bg-slate-100 border-none rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="submit"
                    disabled={!testInput.trim()}
                    className="bg-emerald-600 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-emerald-700 transition-colors shrink-0 disabled:bg-slate-300"
                  >
                    <Send className="w-4 h-4 ml-0.5" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
