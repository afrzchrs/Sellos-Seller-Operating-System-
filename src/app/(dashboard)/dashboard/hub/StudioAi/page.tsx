"use client";

import React, { useState, useRef } from "react";
import {
  Sparkles,
  ImagePlus,
  Globe2,
  Tag,
  UploadCloud,
  CheckCircle2,
  Copy,
  Loader2,
  X,
  ArrowRight,
} from "lucide-react";

const StudioAIPage = () => {
  const [activeTab, setActiveTab] = useState("kreator");
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultReady, setResultReady] = useState(false);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [details, setDetails] = useState("");
  const [targetLang, setTargetLang] = useState("English"); // State untuk bahasa ekspor
  const [generatedResult, setGeneratedResult] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Menangani perubahan input file
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      setGeneratedResult("");
      setResultReady(false);
    }
  };

  // Fungsi untuk memanggil API
  const handleGenerate = async () => {
    if (!selectedImage || !imageFile) {
      alert("Tolong unggah foto produk terlebih dahulu!");
      return;
    }

    setIsProcessing(true);
    setGeneratedResult("");
    setResultReady(false);

    try {
      // Nantinya Anda bisa membuat endpoint berbeda per tab,
      // tapi untuk sekarang kita pakai generate-ad
      const response = await fetch("/api/generate-ad", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: selectedImage,
          mimeType: imageFile.type,
          details: details,
          action: activeTab, // Mengirimkan tab yang sedang aktif (kreator/etalase/ekspor)
          targetLang: targetLang, // Mengirimkan bahasa target untuk ekspor
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setGeneratedResult(data.text);
      } else {
        alert("Terjadi kesalahan: " + data.error);
      }
    } catch (error) {
      console.error(error);
      alert("Koneksi ke server gagal.");
    } finally {
      setIsProcessing(false);
      setResultReady(true);
    }
  };

  const copyToClipboard = () => {
    if (generatedResult) {
      navigator.clipboard.writeText(generatedResult);
      alert("Teks berhasil disalin!");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* KANAN: Main Workspace */}
      <main className="flex-1 p-6 lg:p-12 overflow-y-auto">
        {/* Header */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            Studio AI <Sparkles className="w-6 h-6 text-purple-500" />
          </h2>
          <p className="text-slate-500 mt-2 max-w-2xl">
            Asisten kreatif pintar Anda. Unggah foto produk dan biarkan AI
            menyusun kata-kata promosi, menentukan harga pasar, hingga
            menerjemahkannya untuk pasar global.
          </p>
        </div>

        {/* Tab Navigation Alat AI */}
        <div className="flex space-x-2 md:space-x-4 mb-8 bg-slate-200/50 p-1.5 rounded-2xl overflow-x-auto hide-scrollbar w-full max-w-3xl">
          <button
            onClick={() => {
              setActiveTab("kreator");
              setResultReady(false);
              setGeneratedResult("");
            }}
            className={`flex flex-1 items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${activeTab === "kreator" ? "bg-white text-purple-700 shadow-sm" : "text-slate-500 hover:text-slate-700 hover:bg-slate-100/50"}`}
          >
            <ImagePlus className="w-5 h-5" />
            Kreator Iklan
          </button>
          <button
            onClick={() => {
              setActiveTab("etalase");
              setResultReady(false);
              setGeneratedResult("");
            }}
            className={`flex flex-1 items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${activeTab === "etalase" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500 hover:text-slate-700 hover:bg-slate-100/50"}`}
          >
            <Tag className="w-5 h-5" />
            Asisten Etalase
          </button>
          <button
            onClick={() => {
              setActiveTab("ekspor");
              setResultReady(false);
              setGeneratedResult("");
            }}
            className={`flex flex-1 items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${activeTab === "ekspor" ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-700 hover:bg-slate-100/50"}`}
          >
            <Globe2 className="w-5 h-5" />
            Ekspor Instan
          </button>
        </div>

        {/* Workspace Area */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 lg:p-10 shadow-sm min-h-125">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* SISI KIRI: Input Form */}
            <div className="w-full lg:w-1/2 space-y-6">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
              />

              {!selectedImage ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-purple-50 hover:border-purple-300 hover:text-purple-600 transition-all group min-h-62.5"
                >
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
                    <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-purple-500" />
                  </div>
                  <h4 className="font-bold text-lg mb-1">Unggah Foto Produk</h4>
                  <p className="text-sm text-slate-500">
                    Klik untuk memilih foto (Maks 5MB)
                  </p>
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 group">
                  <img
                    src={selectedImage}
                    alt="Preview"
                    className="w-full h-64 object-cover"
                  />
                  <button
                    onClick={() => {
                      setSelectedImage(null);
                      setImageFile(null);
                      setGeneratedResult("");
                      setResultReady(false);
                    }}
                    className="absolute top-3 right-3 bg-white/80 p-2 rounded-full text-red-500 hover:bg-red-50 hover:text-red-600 transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* Input Tambahan Berdasarkan Tab */}
              {activeTab === "kreator" && (
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">
                    Ada detail khusus yang ingin ditambahkan? (Opsional)
                  </label>
                  <input
                    type="text"
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="Cth: Promo diskon akhir pekan, stok terbatas..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              )}

              {activeTab === "ekspor" && (
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">
                    Pilih Bahasa Target
                  </label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setTargetLang("English")}
                      className={`px-4 py-2 rounded-lg font-medium border transition-colors ${targetLang === "English" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"}`}
                    >
                      🇬🇧 English
                    </button>
                    <button
                      onClick={() => setTargetLang("Japanese")}
                      className={`px-4 py-2 rounded-lg font-medium border transition-colors ${targetLang === "Japanese" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"}`}
                    >
                      🇯🇵 日本語
                    </button>
                    <button
                      onClick={() => setTargetLang("Mandarin")}
                      className={`px-4 py-2 rounded-lg font-medium border transition-colors ${targetLang === "Mandarin" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"}`}
                    >
                      🇨🇳 中文
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={isProcessing || !selectedImage}
                className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-md disabled:bg-slate-400"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Memproses
                    dengan AI...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    {activeTab === "kreator"
                      ? "Buat Copywriting Iklan"
                      : activeTab === "etalase"
                        ? "Identifikasi Produk"
                        : "Terjemahkan Sekarang"}
                  </>
                )}
              </button>
            </div>

            {/* SISI KANAN: Hasil AI */}
            <div className="w-full lg:w-1/2 bg-slate-50 rounded-2xl p-6 lg:p-8 border border-slate-100 relative overflow-hidden">
              {!generatedResult && !isProcessing && (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 opacity-60">
                  <Sparkles className="w-16 h-16 mb-4" />
                  <p>
                    Hasil dari keajaiban AI akan muncul di sini.
                    <br />
                    Silakan unggah foto dan tekan tombol proses.
                  </p>
                </div>
              )}

              {isProcessing && (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-6"></div>
                  <h4 className="font-bold text-slate-700 text-lg">
                    AI Sedang Bekerja
                  </h4>
                  <p className="text-slate-500 text-sm">
                    Menganalisis gambar dan merangkai kata...
                  </p>
                </div>
              )}

              {resultReady && generatedResult && (
                <div className="animate-fadeIn space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Selesai
                    </span>
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center gap-1 text-slate-500 hover:text-slate-700 text-sm font-medium"
                    >
                      <Copy className="w-4 h-4" /> Salin Teks
                    </button>
                  </div>

                  {/* Kondisional Rendering Berdasarkan Tab */}
                  {activeTab === "etalase" ? (
                    // TAMPILAN KHUSUS ASISTEN ETALASE (KARTU)
                    <div className="space-y-4">
                      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">
                          Nama Produk Disarankan
                        </label>
                        <p className="font-semibold text-slate-900 text-lg">
                          {generatedResult.match(/NAMA PRODUK:\s*(.*)/i)?.[1] ||
                            "-"}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">
                            Kategori Terdeteksi
                          </label>
                          <p className="font-semibold text-emerald-700">
                            {generatedResult.match(/KATEGORI:\s*(.*)/i)?.[1] ||
                              "-"}
                          </p>
                        </div>
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">
                            Saran Harga Pasar
                          </label>
                          <p className="font-semibold text-orange-600">
                            {generatedResult.match(
                              /SARAN HARGA:\s*(.*)/i,
                            )?.[1] || "-"}
                          </p>
                        </div>
                      </div>

                      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">
                          Deskripsi Singkat
                        </label>
                        <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-wrap">
                          {generatedResult
                            .match(/DESKRIPSI SINGKAT:\s*([\s\S]*)/i)?.[1]
                            ?.trim() || generatedResult}
                        </p>
                      </div>

                      {/* Tombol Aksi Tambahan untuk Etalase */}
                      <button className="w-full bg-emerald-100 text-emerald-700 py-3 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-emerald-200 transition-colors mt-4">
                        Simpan ke Database Toko{" "}
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    // TAMPILAN UNTUK KREATOR IKLAN & EKSPOR INSTAN (TEKS BEBAS)
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                      <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-wrap">
                        {generatedResult}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudioAIPage;
