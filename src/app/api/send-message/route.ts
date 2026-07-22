import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { Telegraf } from "telegraf";
import connectDB from "@/lib/mongodb";
import { Message, ChatSession } from "@/lib/models";

export async function POST(req: Request) {
  try {
    await connectDB();

    // 1. Ambil Session ID
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId || !mongoose.Types.ObjectId.isValid(sessionId)) {
      return NextResponse.json(
        { success: false, error: "Session ID tidak valid" },
        { status: 400 },
      );
    }

    // 2. Ambil isi pesan dari frontend
    const body = await req.json();
    const { message, storeId } = body;

    if (!message) {
      return NextResponse.json(
        { success: false, error: "Pesan tidak boleh kosong" },
        { status: 400 },
      );
    }

    // 3. Cari ChatSession untuk mendapatkan telegram_chat_id
    const session = await ChatSession.findById(sessionId);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Sesi tidak ditemukan" },
        { status: 404 },
      );
    }

    const telegramChatId = session.telegram_chat_id;

    // 4. Simpan Pesan Manual tersebut ke Database
    // (Pastikan 'owner' sudah ditambahkan ke enum sender_type di models.ts seperti yang kita bahas sebelumnya)
    const newMessage = await Message.create({
      session_id: sessionId,
      sender_type: "owner", // Pastikan enum di models.ts sudah diupdate!
      message_type: "text",
      raw_content: message,
      created_at: new Date(),
    });

    // 5. Jika sukses simpan ke DB, baru Kirim Pesan ke Telegram User
    const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!);
    await bot.telegram.sendMessage(telegramChatId, message);

    return NextResponse.json({ success: true, data: newMessage });

    return NextResponse.json({ success: true, data: newMessage });
  } catch (error: any) {
    console.error("Error send message:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Gagal mengirim pesan" },
      { status: 500 },
    );
  }
}
