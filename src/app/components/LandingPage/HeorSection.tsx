const HeorSection = () => {
  return (
    <>
    <header>
      <section className="w-full mx-auto py-4 h-150 grid grid-cols-2" id="Hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-[#1E293B] mt-45">
          <img
            src="/BusinessPlan.svg"
            alt="Hero Image"
            className="w-full h-auto scale-200"
          />
        </div>
        <div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-[#1E293B] mt-35">
            <h1 className="text-4xl font-bold mb-4">
              Asisten Pintar untuk Kelola Toko, Keuangan, dan Pelanggan Anda
            </h1>
            <p className="text-lg text-[#64748B]">
              Catat Penjualan, Kelola stok, balas chat, hingga bikin konten
              jualan otomatis hanya lewat WhatsApp.
            </p>
          </div>
          <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mt-10">
            <a
              href="/Auth/register"
              className="inline-block bg-[#10B981] text-white px-6 py-3 rounded-full font-medium
         hover:bg-green-700 mr-4 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              Mulai Sekarang
            </a>
            <a
              href="/#how-it-works"
              className="inline-block text-[#10B981] underline font-medium hover:text-green-700 transition-colors"
            >
              Pelajari Lebih Lanjut
            </a>
          </div>
        </div>
      </section>
    </header>
    </>
  );
};

export default HeorSection;
