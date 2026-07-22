import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; 

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Silakan login terlebih dahulu." }, 
        { status: 401 }
      );
    }

    const userId = session.user.id;

    const userStores = await prisma.stores.findMany({
      where: { user_id: userId },
      select: { id: true },
    });

    const storeIds = userStores.map((store) => store.id);

    if (storeIds.length === 0) {
      return NextResponse.json({
        totalRevenue: 0,
        totalTransactions: 0,
        chartData: [
          { day: 'Sen', sales: 0, label: 'Rp 0' },
          { day: 'Sel', sales: 0, label: 'Rp 0' },
          { day: 'Rab', sales: 0, label: 'Rp 0' },
          { day: 'Kam', sales: 0, label: 'Rp 0' },
          { day: 'Jum', sales: 0, label: 'Rp 0' },
          { day: 'Sab', sales: 0, label: 'Rp 0' },
          { day: 'Min', sales: 0, label: 'Rp 0' },
        ],
      });
    }

    const transactions = await prisma.transactions.findMany({
      where: {
        store_id: { in: storeIds },
        type: 'INCOME',
      },
      select: {
        total_amount: true,
        created_at: true,
      },
    });

    let totalRevenue = 0;
    const totalTransactions = transactions.length;

    const dailyMap: { [key: string]: number } = {
      'Sen': 0, 'Sel': 0, 'Rab': 0, 'Kam': 0, 'Jum': 0, 'Sab': 0, 'Min': 0
    };

    const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

    transactions.forEach((tx) => {
      const amount = Number(tx.total_amount) || 0;
      totalRevenue += amount;

      if (tx.created_at) {
        const date = new Date(tx.created_at);
        const dayName = dayNames[date.getDay()];
        dailyMap[dayName] = (dailyMap[dayName] || 0) + amount;
      }
    });

    const maxSales = Math.max(...Object.values(dailyMap), 1);
    const daysOrder = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
    let peakSalesValue = -1;
    let peakDay = '';

    daysOrder.forEach(day => {
      if (dailyMap[day] > peakSalesValue) {
        peakSalesValue = dailyMap[day];
        peakDay = day;
      }
    });

    const chartData = daysOrder.map((day) => {
      const salesAmount = dailyMap[day];
      const heightPercentage = Math.round((salesAmount / maxSales) * 100);
      
      return {
        day,
        sales: heightPercentage > 0 ? heightPercentage : 5,
        rawSales: salesAmount,
        label: `Rp ${salesAmount.toLocaleString('id-ID')}`,
        isPeak: day === peakDay && salesAmount > 0,
      };
    });

    return NextResponse.json({
      totalRevenue,
      totalTransactions,
      chartData,
    });

  } catch (error: any) {
    console.error('DETAIL ERROR API INSIGHTS:', error.message || error);
    return NextResponse.json({ error: error.message || 'Gagal memuat data insight' }, { status: 500 });
  }
}