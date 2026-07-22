import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { StoreSetting } from '@/lib/models';

// 1. GET: Ambil pengaturan saat ini
export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const storeId = searchParams.get('storeId');

    if (!storeId) {
      return NextResponse.json({ success: false, error: 'Store ID wajib diisi' }, { status: 400 });
    }

    // Cari pengaturan, jika belum ada kembalikan nilai default
    let setting = await StoreSetting.findOne({ store_id: storeId }).lean();
    
    if (!setting) {
      setting = { is_global_active: true, custom_rules: '' };
    }

    return NextResponse.json({ success: true, data: setting });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 2. POST: Simpan pengaturan baru
export async function POST(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const storeId = searchParams.get('storeId');

    if (!storeId) {
      return NextResponse.json({ success: false, error: 'Store ID wajib diisi' }, { status: 400 });
    }

    const body = await req.json();
    const { isGlobalActive, customRules } = body;

    // Gunakan findOneAndUpdate dengan opsi upsert: true (jika data belum ada, buat baru)
    const updatedSetting = await StoreSetting.findOneAndUpdate(
      { store_id: storeId },
      { 
        is_global_active: isGlobalActive,
        custom_rules: customRules 
      },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, data: updatedSetting });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}