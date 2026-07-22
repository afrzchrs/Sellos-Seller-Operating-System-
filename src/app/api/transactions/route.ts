import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth"; // Sesuaikan dengan path auth.ts Anda

// ==========================================
// 1. GET: MENGAMBIL RIWAYAT TRANSAKSI TOKO
// ==========================================
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const storeId = searchParams.get("storeId");

    if (!storeId) {
      return NextResponse.json({ error: "ID Toko tidak disertakan." }, { status: 400 });
    }

    // Ambil semua transaksi, urutkan dari yang terbaru
    const transactions = await prisma.transactions.findMany({
      where: { store_id: storeId },
      orderBy: { created_at: 'desc' },
    });

    // Format data agar sesuai dengan kebutuhan Frontend
    const formattedData = transactions.map((tx) => {
      // Memisahkan Kategori dan Deskripsi dari notes (Format: "[Kategori] Deskripsi")
      let category = "Lainnya";
      let desc = tx.notes || "Tanpa Keterangan";
      const match = desc.match(/^\[(.*?)\] (.*)$/);
      if (match) {
        category = match[1];
        desc = match[2];
      }

      return {
        id: tx.id,
        date: tx.created_at, // Biarkan frontend yang memformat tanggal
        desc: desc,
        category: category,
        type: tx.type === 'INCOME' ? 'in' : 'out',
        amount: Number(tx.total_amount),
        source: tx.source.toLowerCase() === 'telegram_bot' ? 'bot' : 'manual'
      };
    });

    return NextResponse.json(formattedData, { status: 200 });

  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json({ error: "Gagal mengambil data transaksi" }, { status: 500 });
  }
}

// ==========================================
// 2. POST: MENYIMPAN TRANSAKSI MANUAL
// ==========================================
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const { storeId, type, amount, desc, category } = data;

    if (!storeId || !amount || !desc) {
      return NextResponse.json({ error: "Data tidak lengkap." }, { status: 400 });
    }

    // Gabungkan kategori dan deskripsi untuk disimpan ke kolom notes
    const formattedNotes = `[${category}] ${desc}`;
    const dbType = type === 'in' ? 'INCOME' : 'EXPENSE';

    const newTransaction = await prisma.transactions.create({
      data: {
        store_id: storeId,
        type: dbType,
        total_amount: Number(amount),
        source: 'MANUAL', // Tandai bahwa ini diinput manual
        notes: formattedNotes,
      },
    });

    return NextResponse.json({ message: "Transaksi berhasil disimpan", transaction: newTransaction }, { status: 201 });

  } catch (error) {
    console.error("Error saving manual transaction:", error);
    return NextResponse.json({ error: "Terjadi kesalahan pada server." }, { status: 500 });
  }
}