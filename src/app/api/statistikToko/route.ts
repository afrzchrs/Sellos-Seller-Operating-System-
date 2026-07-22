import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db'; 
import connectDB from '@/lib/mongodb';
import { ChatSession, Message } from '@/lib/models';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const storeId = url.searchParams.get('storeId');

    if (!storeId) {
      return NextResponse.json({ error: 'Store ID tidak ditemukan' }, { status: 400 });
    }

    // Tentukan rentang waktu untuk "Bulan Ini"
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    // ==========================================
    // BAGIAN 1: QUERY KE POSTGRESQL (via Prisma)
    // ==========================================
    const transactions = await prisma.transactions.findMany({
      where: {
        store_id: storeId,
        type: 'INCOME',
        created_at: {
          gte: startOfMonth,
          lte: endOfMonth,
        }
      }
    });

    // Hitung Total Pendapatan & Pesanan Sukses
    const monthlyRevenue = transactions.reduce((sum, tx) => sum + Number(tx.total_amount), 0);
    const totalOrders = transactions.length;


    // ==========================================
    // BAGIAN 2: QUERY KE MONGODB (via Mongoose)
    // ==========================================
    // Pastikan koneksi ke MongoDB terbentuk
    await connectDB(); 

    // Cari semua ID sesi chat yang terhubung ke toko ini
    const sessions = await ChatSession.find({ active_store_id: storeId }, '_id').lean();
    const sessionIds = sessions.map(session => session._id);

    // Hitung jumlah pesan balasan dari bot ('sender_type: bot') di sesi-sesi tersebut
    // Kita juga bisa memfilter berdasarkan bulan ini agar sinkron dengan data Postgres
    const botInteractions = await Message.countDocuments({
      session_id: { $in: sessionIds },
      sender_type: 'bot',
      created_at: { $gte: startOfMonth, $lte: endOfMonth }
    });


    // ==========================================
    // BAGIAN 3: GENERATE INSIGHT AI & RESPONSE
    // ==========================================
    // Insight AI Dinamis (Sementara masih statis, bisa dihubungkan ke Gemini)
    const aiInsight = `"Penjualan Anda bulan ini mencapai Rp ${monthlyRevenue.toLocaleString('id-ID')}. Pastikan stok produk terlaris Anda selalu tersedia untuk akhir pekan!"`;

    return NextResponse.json({
      monthlyRevenue,
      totalOrders,
      botInteractions, // Sekarang data ini valid dari MongoDB!
      aiInsight,
    });

  } catch (error: any) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}