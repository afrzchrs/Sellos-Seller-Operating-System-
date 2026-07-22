export default function LoadingOverlay({ isLoading }: { isLoading: boolean }) {
  // Jika isLoading bernilai false, komponen ini tidak akan dirender (hilang)
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-2xl">
        {/* Animasi Spinner */}
        <div className="w-12 h-12 border-4 border-gray-100 border-t-emerald-400 rounded-full animate-spin mb-4"></div>
        
        {/* Teks */}
        <p className="text-lg font-semibold text-gray-700 animate-pulse">
          Memuat...
        </p>
      </div>
    </div>
  );
}