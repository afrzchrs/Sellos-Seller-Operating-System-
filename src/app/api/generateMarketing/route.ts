import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Inisialisasi Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);


export async function POST(req: Request) {
  try {
    const { productName, productCategory, format } = await req.json();

    if (!productName || !format) {
      return NextResponse.json({ error: 'Data produk atau format tidak lengkap' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash-lite" });
    let prompt = "";

    // Meracik instruksi AI berdasarkan format yang dipilih pengguna
    switch (format) {
      case 'ig':
        prompt = `Kamu adalah *copywriter* ahli. Buat *caption* Instagram/Facebook untuk produk UMKM bernama "${productName}" (Kategori: ${productCategory}).
        Aturan:
        1. Gunakan bahasa Indonesia yang santai, persuasif, dan *engaging*.
        2. Fokus pada *Value* dan *Unique Selling Proposition* (USP), JANGAN fokus pada banting harga/harga murah.
        3. Buat pembukaan (hook) yang menarik perhatian.
        4. Berikan ajakan bertindak (Call to Action/CTA) di akhir.
        5. Sertakan beberapa emoji dan 3-5 hashtag relevan.`;
        break;

      case 'tiktok':
        prompt = `Kamu adalah *content creator* TikTok. Buat skrip video singkat (15-30 detik) untuk mempromosikan produk "${productName}" (Kategori: ${productCategory}).
        Aturan:
        1. Tuliskan teks yang akan muncul di layar (On-Screen Text) dalam kurung siku, misal: [Teks: ...].
        2. Berikan narasi (Voiceover) yang natural, kekinian, dan tidak kaku.
        3. Fokus pada keunggulan produk.
        4. Akhiri dengan CTA untuk mengklik keranjang kuning atau link di bio.`;
        break;

      case 'en':
        prompt = `You are an expert international e-commerce copywriter. Write a professional, SEO-optimized product description for an Indonesian product named "${productName}" (Category: ${productCategory}) targeted for the global market.
        Rules:
        1. MUST be entirely in English.
        2. Emphasize the quality, authenticity, or handcrafted nature of the product.
        3. Format clearly with headings: "Product Overview", "Why You'll Love It", and "Shipping Info".
        4. Mention that international shipping is available.`;
        break;

      case 'jp':
        prompt = `あなたは国際的なEコマースの専門コピーライターです。「${productName}」（カテゴリー：${productCategory}）というインドネシアの製品について、日本市場向けのプロフェッショナルでSEOに最適化された商品説明を書いてください。
        ルール：
        1. 全て日本語で書くこと。
        2. 製品の品質、真正性、または手作りの特性を強調すること。
        3. 「商品概要」、「おすすめの理由」、「配送について」という見出しを使って整理すること。
        4. 国際配送が可能である旨を記載すること。`;
        break;

      default:
        return NextResponse.json({ error: 'Format tidak dikenali' }, { status: 400 });
    }

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json({ text });

  } catch (error: any) {
    console.error('Error generating marketing content:', error);
    return NextResponse.json({ error: 'Gagal membuat konten dengan AI' }, { status: 500 });
  }
}