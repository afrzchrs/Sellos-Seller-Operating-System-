import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, customRules } = body;

    if (!message) {
      return NextResponse.json({ success: false, error: 'Pesan kosong' }, { status: 400 });
    }

    // Tuliskan Logika AI Anda di sini. 
    // Contoh integrasi sederhana jika menggunakan OpenAI/Gemini:
    // const prompt = `Kamu adalah CS WiraBot. Aturan toko: ${customRules}. Balas pesan ini: ${message}`;
    // const aiResponse = await callYourAI(prompt);

    // Untuk sementara, kita buat mock balasan cerdas yang membaca input dan rules:
    const mockAiResponse = `(Simulasi AI) Saya mengerti. Anda berkata: "${message}". ${
      customRules 
        ? `Saya akan mematuhi aturan ini: "${customRules.substring(0, 30)}..."` 
        : 'Tidak ada aturan khusus yang diterapkan.'
    }`;

    // Simulasi delay jaringan AI (1 detik)
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({ success: true, reply: mockAiResponse });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}