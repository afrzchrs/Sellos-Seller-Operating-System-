import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/db';
import { authOptions } from '@/lib/auth';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Silakan login terlebih dahulu." }, 
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const data = await req.json();
    const { NamaToko, Kategori } = data;

    if (!NamaToko || !Kategori) {
      return NextResponse.json(
        { error: "Nama Toko dan Kategori wajib diisi." },
        { status: 400 }
      );
    }

    const existingToko = await prisma.stores.findFirst({
        where: { 
          store_name: NamaToko,
          user_id: userId
        }
    });

    if (existingToko) {
        return NextResponse.json(
          { error: "Anda sudah memiliki toko dengan nama tersebut." }, 
          { status: 400 }
        );
    }

    const secretKey = Math.random().toString(36).substring(2, 8).toUpperCase(); 

    const newStoreId = crypto.randomUUID();  

    const botUsername = "WiraKas_bot";
     const wirabotLink = `https://t.me/${botUsername}?start=${newStoreId}`;
    

    const TokoBaru = await prisma.stores.create({
        data: {
           id: newStoreId,            
           user_id: userId,
           store_name: NamaToko,
           category: Kategori,
           secret_key: secretKey,   
           wirabot_link: wirabotLink  
        }
    });

    return NextResponse.json(
      { message: "Toko berhasil terdaftar", stores: TokoBaru }, 
      { status: 201 }
    );

  } catch (error) {
    console.error("Create Store API Error:", error);
    return NextResponse.json(
      { error: "Gagal mendaftarkan toko. Terjadi kesalahan pada server." }, 
      { status: 500 }
    );
  }
}