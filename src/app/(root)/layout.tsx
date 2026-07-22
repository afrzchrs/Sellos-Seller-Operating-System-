import React from "react";
import Navbar from "@/app/components/LandingPage/LandingNavbar";
import Footer from "@/app/components/LandingPage/Footer";
import "../globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="grow pt-16 px-20">{children}</main>
      <Footer />
    </>
  );
}
