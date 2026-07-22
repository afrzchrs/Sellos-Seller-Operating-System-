import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Silakan login terlebih dahulu." },
        { status: 401 },
      );
    }

    const userId = session.user.id;

    const data = await req.json();
    const { email, password } = data;

    const updateData: any = {};

    if (email) {
      updateData.email = email;
    }

    if (password) {
      // 2. Wajib Hash Password sebelum disimpan!
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateData.password = hashedPassword;
    }

    // Jika tidak ada data yang dikirim sama sekali
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { message: "Tidak ada data yang diperbarui" },
        { status: 400 }
      );
    }

    // 3. Update database
    const newData = await prisma.user.update({
      where: {
        id: userId,
      },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    return NextResponse.json(
      { message: "Data User berhasil diupdate", user: newData },
      { status: 200 }
    );

  } catch (err: any) {
    console.error("Server Error:", err);

    // Menangani error Prisma jika Email sudah dipakai orang lain
    if (err.code === 'P2002' && err.meta?.target?.includes('email')) {
      return NextResponse.json(
        { message: "Email ini sudah terdaftar, silakan gunakan email lain." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Gagal memperbarui data" },
      { status: 500 }
    );
  }
}
