import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// Inisialisasi Gemini (Menggunakan konfigurasi Anda)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash-lite" });

export async function POST(req: Request) {
  try {
    const { imageBase64, mimeType, details, action, targetLang } = await req.json();

    if (!imageBase64) {
      return NextResponse.json({ error: 'Gambar tidak ditemukan' }, { status: 400 });
    }

    // Membersihkan string base64 dari prefix
    const base64Data = imageBase64.split(',')[1];

    // Menyiapkan variabel untuk Prompt dinamis
    let prompt = '';

    // Logika Prompt berdasarkan Tab yang aktif di Frontend
    switch (action) {
      case 'kreator':
        prompt = `
          Kamu adalah seorang copywriter profesional untuk UMKM Indonesia. 
          Tugasmu adalah membuat caption iklan Instagram/Facebook yang memikat berdasarkan foto produk ini.
          
          Detail tambahan: ${details || 'Tidak ada'}
          
          Aturan ketat:
          1. Tonjolkan Unique Selling Proposition (USP), kualitas, dan cerita di balik produk.
          2. JANGAN FOKUS PADA HARGA MURAH (anti perang harga). Fokus pada nilai (value).
          3. Gunakan bahasa Indonesia yang asik, natural, dan persuasif.
          4. Sertakan emoji relevan dan 3-5 hashtag di akhir.
        `;
        break;

      case 'etalase':
        prompt = `
          Kamu adalah asisten e-commerce untuk UMKM. Analisis foto produk ini.
          Berikan hasil analisismu dengan format persis seperti ini tanpa basa-basi:
          
          NAMA PRODUK: [Berikan saran nama produk yang SEO-friendly untuk marketplace]
          KATEGORI: [Tentukan kategori spesifik e-commerce, misal: Pakaian Pria / Atasan]
          SARAN HARGA: [Taksir harga pasar di Indonesia dalam Rupiah, misal: Rp 150.000 - Rp 200.000]
          
          DESKRIPSI SINGKAT:
          [Buat 2-3 kalimat deskripsi profesional untuk diunggah ke katalog toko online, perhatikan detail gambar.]
          
          Detail tambahan dari pemilik: ${details || 'Tidak ada'}
        `;
        break;

      case 'ekspor':
        prompt = `
          Kamu adalah ahli pemasaran ekspor internasional. 
          Tugasmu adalah membuat deskripsi produk e-commerce global berdasarkan foto ini, dan menerjemahkannya SEPENUHNYA ke dalam bahasa: ${targetLang}.
          
          Detail tambahan: ${details || 'Tidak ada'}
          
          Aturan ketat:
          1. Hasil AKHIR HARUS dalam bahasa ${targetLang}. Jangan gunakan bahasa Indonesia di hasil akhir.
          2. Tulis judul produk yang menarik untuk SEO Global.
          3. Tulis deskripsi yang menonjolkan kualitas ekspor, kerajinan tangan (jika relevan), atau keunikan lokal (exotic value).
          4. Format dengan rapi (gunakan poin-poin/bullet points untuk spesifikasi yang terlihat di gambar).
        `;
        break;

      default:
        prompt = "Deskripsikan gambar ini dengan detail.";
    }

    const imageParts = [
      {
        inlineData: {
          data: base64Data,
          mimeType: mimeType,
        },
      },
    ];

    // Eksekusi pemanggilan AI
    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });
  } catch (error) {
    console.error('Error generating AI content:', error);
    return NextResponse.json({ error: 'Gagal memproses gambar dengan AI' }, { status: 500 });
  }
}