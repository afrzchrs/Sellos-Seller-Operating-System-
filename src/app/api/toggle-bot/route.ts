import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import { ChatSession } from '@/lib/models';

export async function POST(req: Request) {
  try {
    await connectDB();

    // Ambil sessionId dari Query Parameter URL
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');

    // Validasi Session ID
    if (!sessionId || !mongoose.Types.ObjectId.isValid(sessionId)) {
      return NextResponse.json({ success: false, error: 'Session ID tidak valid' }, { status: 400 });
    }

    // Ambil data (body) yang dikirim dari frontend
    const body = await req.json();
    const { isBotActive } = body;

    // Tentukan status string berdasarkan boolean
    const newStatus = isBotActive ? 'active' : 'manual'; 

    // Update di database
    const updatedSession = await ChatSession.findByIdAndUpdate(
      sessionId,
      { session_status: newStatus },
      { new: true }
    );

    if (!updatedSession) {
      return NextResponse.json({ success: false, error: 'Sesi tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedSession });

  } catch (error: any) {
    console.error('Error toggle bot:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Terjadi kesalahan pada server' }, 
      { status: 500 }
    );
  }
}