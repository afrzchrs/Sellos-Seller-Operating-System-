// src/lib/aiTransaction.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from './db'; // Sesuaikan jika Anda mengekspornya dengan nama lain, misal: import { db } from './db'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash-lite" });

// Fungsi 1: Ekstrak Teks ke JSON
export async function ekstrakDataTransaksi(teks: string) {
  const prompt = `
    Anda adalah asisten admin keuangan. Ekstrak informasi dari teks berikut ke dalam format JSON.
    Teks: "${teks}"
    
    Aturan JSON:
    - "niat": "pemasukan" atau "pengeluaran" atau "cek"
    - "nama_produk": nama barang yang disebutkan (string)
    - "kuantitas": jumlah barang (angka/integer)
    - "total_harga": total harga keseluruhan dalam angka tanpa titik/koma (integer). Jika tidak disebutkan, isi null.

    Hanya kembalikan string JSON valid, tanpa markdown.
  `;

  const result = await model.generateContent(prompt);
  const responseText = result.response.text().trim();
  const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '');
  return JSON.parse(cleanJson);
}

// Fungsi 2: Proses Database PostgreSQL
export async function eksekusiTransaksiPrisma(teks: string, storeId: string) {
  try {
    const data = await ekstrakDataTransaksi(teks);
    
    if (data.niat !== 'pemasukan') {
       return "Maaf, saat ini saya baru diprogram untuk mencatat pemasukan.";
    }

    // Cari produk di PostgreSQL
    const produk = await prisma.products.findFirst({
      where: {
        store_id: storeId,
        name: { contains: data.nama_produk, mode: 'insensitive' },
      },
    });

    if (!produk) {
      return `Produk "*${data.nama_produk}*" tidak ditemukan di database. Apakah Anda ingin menambahkannya?\n\n*(Balas: "Tambah ${data.nama_produk} harga 15000")*`;
    }

    const hargaSatuan = Number(produk.price);
    const totalHarga = data.total_harga ? Number(data.total_harga) : hargaSatuan * data.kuantitas;

    // Transaksi Atomik Prisma
    await prisma.$transaction(async (tx) => {
      const transaksiBaru = await tx.transactions.create({
        data: {
          store_id: storeId,
          type: 'INCOME',
          total_amount: totalHarga,
          source: 'telegram_bot',
          notes: `Dicatat otomatis via AI dari teks: ${teks}`,
        },
      });

      await tx.transaction_items.create({
        data: {
          transaction_id: transaksiBaru.id,
          product_id: produk.id,
          quantity: data.kuantitas,
          subtotal: totalHarga,
        },
      });

      await tx.products.update({
        where: { id: produk.id },
        data: {
          stock: { decrement: data.kuantitas },
          sold: { increment: data.kuantitas },
        },
      });
    });

    return `✅ *Transaksi Berhasil!*\n\n📦 Produk: ${produk.name}\n🔢 Qty: ${data.kuantitas}\n💰 Total: Rp ${totalHarga.toLocaleString('id-ID')}\n\n*Stok telah diperbarui.*`;

  } catch (error) {
    console.error("Gagal eksekusi Prisma:", error);
    return "Terjadi kesalahan sistem saat mencoba mencatat ke database.";
  }
}