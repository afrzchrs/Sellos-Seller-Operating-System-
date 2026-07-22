// src/lib/aiCustomerService.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from './db';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash-lite" });

export async function prosesChatCustomer(teksMasuk: string, storeId: string) {
  try {
    const dataToko = await prisma.stores.findUnique({
      where: { id: storeId },
      include: {
        products: {
          where: { stock: { gt: 0 } },
          select: { id: true, name: true, price: true, stock: true }
        }
      }
    });

    if (!dataToko) return null;

    const dataKatalogTeks = JSON.stringify(dataToko.products, null, 2);

    const prompt = `
      Anda adalah WiraBot, asisten CS untuk toko ${dataToko.store_name}.
      Katalog saat ini:
      ${dataKatalogTeks}

      Tugas Anda menganalisis pesan pelanggan. Balaslah WAJIB dalam format JSON murni (tanpa \`\`\`json) dengan struktur berikut:
      {
        "pesan_balasan": "Teks ramah balasan untuk pelanggan",
        "is_order": true atau false,
        "rincian_order": [ 
           { "product_id": "ID_DARI_KATALOG", "kuantitas": 2 } 
        ]
      }

      Aturan:
      1. Jika pembeli sekadar bertanya, is_order = false, rincian_order = [].
      2. Jika pembeli secara eksplisit memesan/beli, is_order = true dan isi rincian_order sesuai ID produk di katalog.
      
      Pesan Pembeli: "${teksMasuk}"
    `;

    const result = await model.generateContent(prompt);
    const cleanJson = result.response.text().trim().replace(/```json/g, '').replace(/```/g, '');
    return JSON.parse(cleanJson);

  } catch (error) {
    console.error("Gagal AI CS:", error);
    return { pesan_balasan: "Maaf Kak, sistem kami sedang sibuk 🙏", is_order: false, rincian_order: [] };
  }
}