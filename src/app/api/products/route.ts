import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";

// ==========================================
// 1. FUNGSI GET: MENGAMBIL DATA PRODUK (PER CABANG)
// ==========================================
export async function GET(req: Request) { 
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const userId = session.user.id;
    const { searchParams } = new URL(req.url);
    const storeId = searchParams.get("storeId");

    if (!storeId) {
      return NextResponse.json({ error: "ID Toko tidak disertakan." }, { status: 400 });
    }

    const validStore = await prisma.stores.findFirst({
      where: { id: storeId, user_id: userId },
    });

    if (!validStore) {
      return NextResponse.json({ error: "Akses ditolak. Ini bukan toko Anda." }, { status: 403 });
    }

    const storeProducts = await prisma.products.findMany({
      where: { store_id: storeId },
    });

    return NextResponse.json(storeProducts, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil data produk" }, { status: 500 });
  }
}

// ==========================================
// 2. FUNGSI POST: MENAMBAH PRODUK BARU (KE CABANG TERTENTU)
// ==========================================
export async function POST(req: Request) {  
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const userId = session.user.id;

    const data = await req.json();
    
    const { name, category, price, stock, storeId } = data;

    if (!storeId) {
      return NextResponse.json({ error: "Pilih toko terlebih dahulu." }, { status: 400 });
    }
    const validStore = await prisma.stores.findFirst({
      where: { id: storeId, user_id: userId },
    });

    if (!validStore) {
      return NextResponse.json({ error: "Akses ditolak. Ini bukan toko Anda." }, { status: 403 });
    }

    const newProduct = await prisma.products.create({
      data: {
        store_id: storeId, 
        name: name,             
        price: Number(price),
        stock: Number(stock),
      },
    });

    return NextResponse.json({ message: "Produk berhasil ditambahkan", product: newProduct }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({ error: "Terjadi kesalahan pada server." }, { status: 500 });
  }
}