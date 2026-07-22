import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/db';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Silakan login terlebih dahulu." }, 
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const storeId = searchParams.get("storeId");

    if (!storeId) {
      return NextResponse.json(
        { error: "ID Toko (storeId) wajib disertakan." },
        { status: 400 },
      );
    }

    // Cukup lakukan 1 kali query saja
    const validStore = await prisma.stores.findFirst({
      where: { 
        id: storeId, 
        user_id: session.user.id 
      },
    });

    if (!validStore) {
      return NextResponse.json(
        { error: "Akses ditolak. Ini bukan toko Anda." },
        { status: 403 },
      );
    }

    return NextResponse.json(validStore, { status: 200 });

  } catch (err: any) {
    console.error("API GET Error:", err); 
    return NextResponse.json(
      { error: "Gagal mengambil data toko" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: Request) { 
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Silakan login terlebih dahulu." }, 
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const storeId = searchParams.get("storeId");

    if (!storeId) {
      return NextResponse.json(
        { error: "ID Toko (storeId) wajib disertakan." },
        { status: 400 },
      );
    }

    const validStore = await prisma.stores.findFirst({
      where: { 
        id: storeId, 
        user_id: session.user.id 
      },
    });

    if (!validStore) {
      return NextResponse.json(
        { error: "Akses ditolak. Ini bukan toko Anda." },
        { status: 403 },
      );
    }

    const data = await req.json();
    const { namaToko, kategori, deskripsi, alamat, kontak } = data;

    // Pemetaan data update
    const updateData = {
      store_name: namaToko || undefined,
      category: kategori || undefined,
      description: deskripsi || undefined,
      address: alamat || undefined,
      phone: kontak || undefined,
    };

    const hasUpdates = Object.values(updateData).some(val => val !== undefined);
    
    if (!hasUpdates) {
      return NextResponse.json(
        { error: "Tidak ada data perubahan yang dikirim." },
        { status: 400 }
      );
    }

    const dataTokoBaru = await prisma.stores.update({
      where: { id: storeId },
      data: updateData
    });

    return NextResponse.json(
      { message: "Pengaturan Toko berhasil diperbarui", stores: dataTokoBaru },
      { status: 200 }
    );

  } catch (err: any) {
    console.error("API PATCH Error:", err); 
    return NextResponse.json(
      { error: "Terjadi kesalahan saat memperbarui data toko" },
      { status: 500 },
    );
  }
}