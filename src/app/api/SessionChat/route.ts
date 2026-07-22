    import { NextResponse } from 'next/server';
    import connectDB from '@/lib/mongodb';
    import { ChatSession } from '@/lib/models';

    export async function GET(req: Request) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const storeId = searchParams.get('storeId');

        if (!storeId) {
        return NextResponse.json({ success: false, error: "Store ID kosong" }, { status: 400 });
        }

        const sessions = await ChatSession.find({ active_store_id: storeId })
        .sort({ updated_at: -1 })
        .lean();

        // Mapping data agar properti isBotActive terbaca dengan benar di Frontend
        const formattedSessions = sessions.map((session: any) => ({
        ...session,
        // Ubah session_status string ('active') menjadi boolean true/false
        isBotActive: session.session_status === 'active', 
        }));

        return NextResponse.json({ success: true, data: formattedSessions });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    }