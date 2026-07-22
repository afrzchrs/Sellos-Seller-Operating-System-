import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Silakan login terlebih dahulu." },
        { status: 401 },
      );
    }

    const userId = session.user.id;

    const { searchParams } = new URL(req.url);
    const storeId = searchParams.get("storeId");

    if (!storeId) {
      return NextResponse.json(
        { error: "ID Toko (storeId) wajib disertakan." },
        { status: 400 },
      );
    }

    // 2. Validasi keamanan (Pastikan toko ini benar milik user)
    const validStore = await prisma.stores.findFirst({
      where: { 
        id: storeId, 
        user_id: userId 
      },
    });

    if (!validStore) {
      return NextResponse.json(
        { error: "Akses ditolak. Ini bukan toko Anda." },
        { status: 403 },
      );
    }

    // 3. PERBAIKAN PRISMA QUERY
    const topProducts = await prisma.products.findMany({
      where: {
        store_id: storeId, 
      },
      orderBy: {
        sold: "desc", 
      },
      take: 5,        
    });

    return NextResponse.json(topProducts, { status: 200 });
  } catch (err: any) {
    // Perbaikan variabel error pada console.error
    console.error("API Error:", err); 
    return NextResponse.json(
      { error: "Gagal mengambil data" },
      { status: 500 },
    );
  }
}