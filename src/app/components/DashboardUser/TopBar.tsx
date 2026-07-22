"use client";

import React, { useState, useEffect, useRef } from "react";
import FormBuatToko from "./fromBuatToko";
import { useSession, signOut } from "next-auth/react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  User,
  Settings,
  LogOut,
  ChevronDown,
  Check,
  Store,
  Plus,
} from "lucide-react";

interface StoreData {
  storeId: string;
  storeName: string;
  category: string;
  totalProducts: number;
  totalRevenue: number;
}

const TopBar = () => {
  const params = useParams();
  const currentStoreId = params.StoreId;

  const { data: session } = useSession();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isStoreListOpen, setIsStoreListOpen] = useState(false);
  const [stores, setStores] = useState<StoreData[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);
  const storeListRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const activeStore = stores.find((store) => store.storeId === currentStoreId);
  const displayStoreName = activeStore ? activeStore.storeName : "Memuat Toko...";

  const fetchStores = async () => {
    try {
      setError("");

      const res = await fetch("/api/toko");

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Gagal mengambil data toko");
      }

      const data = await res.json();
      setStores(data);
    } catch (err: any) {
      setError(err);
    }
  };

  const saveNewStores = async () => {
    try {
    } catch (err: any) {
      setError(err);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  // Menutup dropdown otomatis jika pengguna mengklik area di luar menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (
        storeListRef.current &&
        !storeListRef.current.contains(event.target as Node)
      ) {
        setIsStoreListOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut({
      redirect: true,
      callbackUrl: "/Auth/login",
    });
  };

  const handleSuccessCreate = () => {
    setIsModalOpen(false);
    fetchStores();
    alert("Toko berhasil dibuat!");
  };

  return (
    <>
    <nav
      className="fixed w-5xl z-50 bg-white backdrop-blur-md border-b border-gray-100 
    transition-all duration-300 left-64 px-6"
    >
      <div className="flex h-16 items-center justify-between">
        <div className="relative" ref={storeListRef}>
          <button
            onClick={() => {
              setIsStoreListOpen(!isStoreListOpen);
              setIsProfileOpen(false);
            }}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100 transition-colors focus:outline-none"
          >
            <div className="flex bg-emerald-200 text-lg font-bold text-slate-800 rounded-xl items-center py-1.5 px-3">
              <Store className="w-4 h-6 scale-170 text-slate-400" />
            </div>
            <h1 className="font-bold text-lg text-slate-800 tracking-tight hidden sm:block">
               {displayStoreName}
            </h1>


            <ChevronDown
              className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${isStoreListOpen ? "rotate-180" : ""}`}
            />
          </button>
          {isStoreListOpen && (
            <div className="absolute left-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-2 border-b border-slate-100 mb-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Pilih Cabang Toko
                </p>
              </div>

              <div className="px-2 py-1 flex flex-col gap-1">
                {stores.map((stores) => (
                  <Link
                    key={stores.storeId}
                    href={`/dashboard/Store/${stores.storeId}`}
                    onClick={() => setIsStoreListOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 rounded-xl hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                  >
                    <Store className="w-4 h-4 text-slate-400" />
                    {stores.storeName}
                  </Link>
                ))}
              </div>

              <div className="px-2 mt-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center justify-center gap-2 w-full px-3 py-2 text-sm font-semibold text-emerald-600 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors"
                >
                  + Tambah Toko Baru
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 p-1.5 rounded-full hover:bg-slate-100 transition-colors focus:outline-none border border-transparent hover:border-slate-200"
          >
            <div className="w-9 h-9 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-sm">
              <User className="w-5 h-5" />
            </div>

            <div className="hidden sm:block text-left">
              <p className="text-sm font-bold text-slate-700 leading-none">
                {session?.user?.name}
              </p>
            </div>

            <ChevronDown
              className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-3 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 animate-in fade-in slide-in-from-top-2">
              {/* Detail Info User */}
              <div className="px-5 py-3 border-b border-slate-100 mb-1">
                <p className="text-sm font-bold text-slate-900">
                  {session?.user?.name}
                </p>
                <p className="text-xs text-slate-500 mt-0.5 truncate">
                  {session?.user?.email}
                </p>
              </div>

              <div className="px-2 py-1 flex flex-col gap-1">
                <Link
                  href={`/dashboard/Store/${currentStoreId}/Pengaturan`}
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 rounded-xl hover:bg-slate-50 hover:text-emerald-600 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  Pengaturan Akun
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-colors mt-1"
                >
                  <LogOut className="w-4 h-4" />
                  Keluar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
    {isModalOpen&&(
      <FormBuatToko
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccessCreate}
      />
    )}
    </>
  );
};

export default TopBar;
