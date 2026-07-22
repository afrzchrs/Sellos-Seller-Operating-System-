import NextAuth, { DefaultSession } from "next-auth";

// Mengubah (memperluas) tipe bawaan NextAuth
declare module "next-auth" {
  interface Session {
    user: {
      id: string; // Memberitahu TypeScript bahwa id itu ada dan berupa string
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
  }
}