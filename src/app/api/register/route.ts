import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db'; 
import bcrypt from 'bcryptjs';

export async function POST(req:Request) {
    try{
        const data = await req.json();
        const { name, email, password } = data;

        const user = await prisma.user.findUnique({
            where: { email : email}
        });

        if(user){
            return NextResponse.json({ message: "Email sudah digunakan"}, {status:400});
        }

        const hashedpass = await bcrypt.hash(password,10);

        const newuser = await prisma.user.create({
            data:{
                name,
                email,
                password: hashedpass,
            }
        })

        return NextResponse.json({ message: "Registrasi berhasil", user : newuser}, 
            {status : 201})
    }catch(error){
        return NextResponse.json({ message: "terjadi kesalahan server" }, {status: 500})
    }
}