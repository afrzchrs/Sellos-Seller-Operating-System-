"use client";

import React, { useState, useEffect } from "react";
import LoadingOverlay from "@/app/components/Loading/LoadingOverlay";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Lightbulb,
  TrendingUp,
  ShoppingBag,
  Wallet,
  Package,
  ArrowRight,
  Star,
} from "lucide-react";

interface BestStoreProducts {
  id: string;
  name: string;
  price: number;
  stock: number;
  sold?: number;
  pendapatan?: string;
}

interface DashboardData {
  monthlyRevenue: number;
  totalOrders: number;
  botInteractions: number;
  aiInsight: string;
}

const Beranda = () => {
  const params = useParams();
  const currentStoreId = params.StoreId as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [topProducts, setTopProducts] = useState<BestStoreProducts[]>([]);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    monthlyRevenue: 0,
    totalOrders: 0,
    botInteractions: 0,
    aiInsight: "Memuat insight...",
  });

  useEffect(() => {
    setIsLoading(true);
    setError("");

    const loadDashboardData = async () => {
      if (!currentStoreId) return;
      try {
        const res = await fetch(`/api/topProduct?storeId=${currentStoreId}`);
        if (!res.ok) throw new Error("Gagal mengambil produk terlaris");
        const topProductsData = await res.json();
        
        // Memastikan data yang masuk adalah array
        if (Array.isArray(topProductsData)) {
          setTopProducts(topProductsData);
        } else {
          setTopProducts([]);
        }
      } catch (err: any) {
        setError(err.message);
      }
    };

    const loadDashboardStatistic = async () => {
      if (!currentStoreId) return;
      try {
        const res = await fetch(`/api/statistikToko?storeId=${currentStoreId}`);
        if (!res.ok) throw new Error("Gagal mengambil data statistik toko");
        const statData = await res.json();

        // PERBAIKAN: Simpan ke setDashboardData, BUKAN ke setTopProducts
        setDashboardData({
          monthlyRevenue: statData.monthlyRevenue || 0,
          totalOrders: statData.totalOrders || 0,
          botInteractions: statData.botInteractions || 0,
          aiInsight: statData.aiInsight || "Belum ada insight hari ini.",
        });
      } catch (err: any) {
        setError(err.message);
      }
    };

    // Jalankan kedua fetch secara bersamaan (paralel) agar lebih cepat
    Promise.all([loadDashboardData(), loadDashboardStatistic()]).finally(() => {
      setIsLoading(false);
    });

  }, [currentStoreId]);

  if (error) {
    return (
      <div className="p-4 m-10 text-center text-red-500 bg-red-50 rounded-lg">
        Error: {error}
      </div>
    );
  }

  return (
    <div>
      <main className="flex-1 pt-5 lg:py-20 px-10 overflow-y-auto">
        <LoadingOverlay isLoading={isLoading} />
        <div className="space-y-8 animate-in fade-in duration-500">
          
          {/* 1. HIGHLIGHT AI (Saran Cerdas) */}
          <div className="bg-linear-to-r from-purple-700 via-indigo-600 to-purple-800 rounded-3xl p-1 relative overflow-hidden shadow-lg">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl opacity-10 -translate-y-1/2 translate-x-1/2"></div>
            <div className="bg-white/10 backdrop-blur-md rounded-[1.35rem] p-6 lg:p-8 flex items-start sm:items-center gap-5 border border-white/20">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                <Lightbulb className="w-8 h-8 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-purple-100 font-bold text-sm tracking-wider uppercase mb-1 flex items-center gap-2">
                  💡 Insight AI Hari Ini
                </h3>
                <p className="text-white text-lg lg:text-xl font-medium leading-relaxed">
                  {dashboardData.aiInsight}
                </p>
              </div>
            </div>
          </div>

          {/* 2. RINGKASAN METRIK (Kesehatan Toko) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Metrik 1: Total Pendapatan */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
              <div>
                <p className="text-slate-500 text-sm font-medium mb-1">Pendapatan Bulan Ini</p>
                <h3 className="text-3xl font-extrabold text-slate-900">
                  Rp {dashboardData.monthlyRevenue.toLocaleString("id-ID")}
                </h3>
              </div>
            </div>

            {/* Metrik 2: Total Pesanan */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div>
                <p className="text-slate-500 text-sm font-medium mb-1">Pesanan Sukses</p>
                <h3 className="text-3xl font-extrabold text-slate-900">
                  {dashboardData.totalOrders} <span className="text-base font-normal text-slate-400">order</span>
                </h3>
              </div>
            </div>

            {/* Metrik 3: Bot Chat Interaksi */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                  <Star className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <div>
                <p className="text-slate-500 text-sm font-medium mb-1">Pelayanan WiraBot</p>
                <h3 className="text-3xl font-extrabold text-slate-900">
                  {dashboardData.botInteractions} <span className="text-base font-normal text-slate-400">chat dibalas</span>
                </h3>
              </div>
            </div>
          </div>

          {/* 3. PRODUK TERLARIS */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mt-8">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-slate-500" />
                <h3 className="font-bold text-lg text-slate-900">Produk Terlaris Bulan Ini</h3>
              </div>
              <Link href={`/dashboard/Store/${currentStoreId}/EtalaseKatalogAi`} className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">
                Lihat Katalog
              </Link>
            </div>

            <div className="p-2 sm:p-6">
              {topProducts.length === 0 ? (
                <div className="p-4 text-center text-gray-500">Toko Anda belum memiliki produk yang terjual.</div>
              ) : (
                <div className="space-y-4">
                  {topProducts.slice(0, 5).map((product, index) => (
                    <div key={product.id || index} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm ${
                          index === 0 ? "bg-yellow-100 text-yellow-600 border border-yellow-200"
                          : index === 1 ? "bg-slate-100 text-slate-500 border border-slate-200"
                          : "bg-orange-50 text-orange-700 border border-orange-100"
                        }`}>
                          #{index + 1}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">{product.name}</h4>
                          <p className="text-sm text-slate-500">{product.sold || 0} item terjual</p>
                        </div>
                      </div>
                      <div className="text-right flex items-center gap-4">
                        <div className="hidden sm:block">
                          <p className="text-xs text-slate-400 font-medium mb-0.5">Pendapatan</p>
                          <p className="font-bold text-slate-900">
                            Rp {(Number(product.price) * (product.sold || 0)).toLocaleString("id-ID")}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Beranda;