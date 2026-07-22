import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db'; 

export async function GET(){
    try{
        const allTransactionItem = await prisma.transaction_items.findMany();

        return NextResponse.json(allTransactionItem, { status: 200 });
    }catch(error){
        console.error("Database Error:", error);
        return NextResponse.json(
         { error: "Gagal mengambil data transaksi item" }, 
         { status: 500 }
        );
    }
}