import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Message, ChatSession } from '@/lib/models';

export async function GET(req: Request) {
  try {
    // 1. Pastikan koneksi ke database terbentuk
    await connectDB();

    // 2. Ambil parameter dari URL (opsional: untuk filter berdasarkan session_id)
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');

    // Siapkan query pencarian
    let query = {};
    if (sessionId) {
      query = { session_id: sessionId };
    }

    // 3. Tarik data dari MongoDB
    const messages = await Message.find(query)
      .sort({ created_at: 1 }) // Urutkan dari yang terlama ke terbaru (kronologis chat)
      .populate({
        path: 'session_id', 
        model: ChatSession,
        select: 'telegram_chat_id role active_store_id' // Ambil info sesi yang dibutuhkan
      })
      .lean(); // .lean() mempercepat query karena mengembalikan plain JavaScript object

    // 4. Kembalikan data dalam format JSON
    return NextResponse.json({
      success: true,
      count: messages.length,
      data: messages
    });

  } catch (error: any) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Terjadi kesalahan pada server' }, 
      { status: 500 }
    );
  }
}