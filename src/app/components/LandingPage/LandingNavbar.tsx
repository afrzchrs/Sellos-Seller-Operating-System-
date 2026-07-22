"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react"; // Pastikan sudah install lucide-react

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const navLinks = [
    { name: "Fitur", href: "/#features" },
    { name: "Solusi Usaha", href: "/#solutions" },
    { name: "Pusat Edukasi", href: "/#how-it-works" },
  ];

  return (
    <nav className="fixed w-full z-50 bg-white backdrop-blur-md border-b border-gray-100 
    transition-all duration-300 px-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="shrink-0 flex items-center">
            <Link
              href="/"
              className="text-3xl font-bold text-[#10B981] tracking-tight pd"
            >
              Sellos.
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center pt-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-20 font-medium text-gray-600 pb-1 border-b-2 border-transparent 
                       hover:border-green-400 transition-colors duration-300"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Call to Action & Auth (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/Auth/login"
              className="text-20 font-medium text-gray-600 pb-1 border-b-2 border-transparent 
                       hover:border-green-400 transition-colors duration-300 pt-3"
            >
              Masuk
            </Link>
            <Link
              href="/Auth/register"
              className="bg-[#10B981] text-white text-20 px-5 py-2.5 rounded-full font-medium 
               hover:bg-green-700 transition-colors shadow-sm hover:shadow-md mr-4"
            >
              Coba Sekarang
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none p-2"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`md:hidden absolute w-full bg-white border-b border-gray-100 
          transition-all duration-300 ease-in-out origin-top ${
          isOpen
            ? "opacity-100 scale-y-100"
            : "opacity-0 scale-y-0 pointer-events-none"
        }`}
      >
        <div className="px-4 pt-2 pb-6 space-y-2 shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block px-3 py-3 text-base font-medium text-gray-700
               hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col space-y-3">
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center px-4 py-3 font-medium text-gray-600
               bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center px-4 py-3 bg-blue-600 text-white
               font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              Coba Gratis
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
