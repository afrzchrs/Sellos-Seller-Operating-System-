import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/db';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    // 1. Ambil data sesi dari pengguna yang sedang login
    const session = await getServerSession(authOptions);

    // 2. Proteksi API: Jika tidak ada sesi atau ID tidak ditemukan, tolak aksesnya
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Silakan login terlebih dahulu." }, 
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // 3. Eksekusi kueri CTE yang aman dari duplikasi (Cartesian Product)
    const userStores = await prisma.$queryRaw`
      WITH ProductStats AS (
        SELECT store_id, COUNT(id) AS total_products
        FROM products
        GROUP BY store_id
      ),
      TransactionStats AS (
        SELECT store_id, SUM(total_amount) AS total_revenue
        FROM transactions
        GROUP BY store_id
      )
      SELECT 
        s.id AS "storeId",
        s.store_name AS "storeName",
        s.category AS "category",
        s.wirabot_link AS "wirabot_link", 
        s.secret_key AS "secret_key",     
        COALESCE(p.total_products, 0) AS "totalProducts",
        COALESCE(t.total_revenue, 0) AS "totalRevenue"
      FROM stores s
      LEFT JOIN ProductStats p ON s.id = p.store_id
      LEFT JOIN TransactionStats t ON s.id = t.store_id
      WHERE s.user_id = ${userId}::uuid; 
    `;

    // 4. Konversi tipe data bawaan PostgreSQL (BigInt/Decimal) ke format Number standar JavaScript
    // Karena kita memakai spread operator (...store), wirabot_link dan secret_key otomatis terbawa
    const serializedData = (userStores as any[]).map(store => ({
      ...store,
      totalProducts: Number(store.totalProducts),
      totalRevenue: Number(store.totalRevenue)
    }));

    // 5. Kembalikan data sukses
    return NextResponse.json(serializedData, { status: 200 });

  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data toko" }, 
      { status: 500 }
    );
  }
}