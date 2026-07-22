// src/app/api/webhook/telegram/route.ts
import { NextResponse } from "next/server";
import { Telegraf, Markup } from "telegraf";
import connectDB from "@/lib/mongodb";
import { ChatSession, Message } from "@/lib/models";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { eksekusiTransaksiPrisma } from "@/lib/aiTransaction";
import { prosesChatCustomer } from "@/lib/aiCustomerService";
import { prisma } from "@/lib/db";

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!);

// --------------------------------------------------------
// COMMAND: /start (Dengan Fitur Deep Linking & Daftar Menu)
// --------------------------------------------------------
bot.start(async (ctx) => {
  try {
    const chatId = ctx.chat.id.toString();
    const payloadStoreId = ctx.startPayload; // Menangkap data dari t.me/bot?start=DATA

    let session = await ChatSession.findOne({ telegram_chat_id: chatId });

    if (!session) {
      session = await ChatSession.create({
        telegram_chat_id: chatId,
        role: "customer",
      });
    }

    // JIKA ADA PAYLOAD (Berarti Customer masuk dari Link Toko)
    if (payloadStoreId) {
      // Cek apakah ID toko valid di PostgreSQL
      const store = await prisma.stores.findUnique({
        where: { id: payloadStoreId },
      });

      if (store) {
        // Simpan ID toko yang sedang dikunjungi ke sesi Customer
        await ChatSession.findOneAndUpdate(
          { telegram_chat_id: chatId },
          { active_store_id: payloadStoreId, role: "customer" },
          { new: true },
        );

        // Ambil daftar produk dari toko tersebut
        const storeProducts = await prisma.products.findMany({
          where: { store_id: payloadStoreId },
        });

        // --- FORMATING DAFTAR PRODUK MENJADI TEKS ---
        let productListText = "";
        if (storeProducts.length > 0) {
          productListText = storeProducts
            .map(
              (p, index) =>
                 `${index + 1}. *${p.name}* - Rp ${p.price}`,
            )
            .join("\n");
        } else {
          productListText = "_Belum ada produk tersedia di toko ini._";
        }

        // Susun teks sambutan lengkap dengan daftar produk
        const startReply = `Halo! 👋 Selamat datang di *${store.store_name}*.\nAda yang bisa kami bantu untuk pesanan Anda hari ini?
        \n\n*📋 Daftar Produk Kami:*\n${productListText}\n\n_Silakan ketik pesanan Anda di sini ya!_`;

        // Simpan riwayat pesan bot ke MongoDB
        await Message.create({
          session_id: session._id,
          sender_type: "bot",
          message_type: "text",
          raw_content: startReply,
        });

        ctx.reply(startReply, { parse_mode: "Markdown" });
        return; // Hentikan eksekusi di sini
      }
    }

    // JIKA TIDAK ADA PAYLOAD ATAU TOKO TIDAK VALID
    const startReply =
      "Halo! WiraBot sudah terhubung. Jika Anda pembeli, pastikan Anda menggunakan Link Khusus dari penjual Anda.";

    await Message.create({
      session_id: session._id,
      sender_type: "bot",
      message_type: "text",
      raw_content: startReply,
    });

    ctx.reply(startReply);
  } catch (error) {
    console.error("Error di command start:", error);
  }
});

// --------------------------------------------------------
// COMMAND: /auth_admin <kode_rahasia>
// --------------------------------------------------------
bot.command("auth_admin", async (ctx) => {
  try {
    const chatId = ctx.chat.id.toString();
    const messageText = (ctx.message as any).text;

    // Ambil kode rahasia dari pesan
    const parts = messageText.split(" ");
    if (parts.length < 2) {
      ctx.reply("⚠️ Format salah.\nGunakan: /auth_admin <kode_rahasia>");
      return;
    }

    const inputSecretKey = parts[1];

    // Cari toko berdasarkan kode rahasia di PostgreSQL
    const store = await prisma.stores.findUnique({
      where: { secret_key: inputSecretKey },
    });

    if (!store) {
      ctx.reply(
        "❌ Akses ditolak. Kode rahasia tidak valid atau sudah tidak aktif.",
      );
      return;
    }

    // Ubah status sesi menjadi 'admin' untuk toko spesifik ini
    await ChatSession.findOneAndUpdate(
      { telegram_chat_id: chatId },
      {
        telegram_chat_id: chatId,
        role: "admin",
        active_store_id: store.id,
      },
      { upsert: true, returnDocument: "after" },
    );

    ctx.reply(
      `✅ *Autentikasi Admin Berhasil!*\n\nAnda sekarang bertugas mengelola:\n🏪 *${store.store_name}*\n\nAnda akan menerima notifikasi otomatis jika ada pesanan baru yang sudah lunas.`,
      { parse_mode: "Markdown" },
    );
  } catch (error) {
    console.error("Error di command auth_admin:", error);
    ctx.reply("Terjadi kesalahan sistem saat mencoba melakukan autentikasi.");
  }
});

// --------------------------------------------------------
// COMMAND: /status
// --------------------------------------------------------
bot.command("status", async (ctx) => {
  try {
    const chatId = ctx.chat.id.toString();

    // Cek sesi di MongoDB
    const session = await ChatSession.findOne({ telegram_chat_id: chatId });

    if (!session || session.role === "customer") {
      ctx.reply(
        "👤 Status Anda saat ini: *Customer* biasa.\nBot akan melayani Anda sebagai pembeli.",
        { parse_mode: "Markdown" },
      );
      return;
    }

    // Jika role owner, cari tahu toko apa yang sedang dikelola
    if (session.role === "owner") {
      let namaToko = "Toko tidak diketahui";

      if (session.active_store_id) {
        // Cari nama toko di PostgreSQL
        const store = await prisma.stores.findUnique({
          where: { id: session.active_store_id },
        });
        if (store) namaToko = store.store_name;
      }

      ctx.reply(
        `👑 Status Anda saat ini: *Owner*\n🏪 Toko Aktif: *${namaToko}*\n\nAnda bisa langsung mengirimkan laporan keuangan.`,
        { parse_mode: "Markdown" },
      );
    }
  } catch (error) {
    console.error("Error di command status:", error);
    ctx.reply("Gagal mengambil status.");
  }
});

// --------------------------------------------------------
// COMMAND: /logout
// --------------------------------------------------------
bot.command("logout", async (ctx) => {
  try {
    const chatId = ctx.chat.id.toString();

    // Update sesi di MongoDB: Kembalikan ke customer dan hapus active_store_id
    await ChatSession.findOneAndUpdate(
      { telegram_chat_id: chatId },
      {
        role: "customer",
        $unset: { active_store_id: 1 }, // Menghapus field active_store_id dari dokumen
      },
      { new: true },
    );

    ctx.reply(
      "🔒 Anda telah berhasil *Logout*.\n\nWiraBot sekarang mengenali Anda sebagai Customer biasa. Untuk mengelola toko kembali, silakan gunakan perintah /auth.",
      { parse_mode: "Markdown" },
    );
  } catch (error) {
    console.error("Error di command logout:", error);
    ctx.reply("Gagal melakukan logout.");
  }
});

// --------------------------------------------------------
// EVENT: MENANGANI KLIK TOMBOL PILIH TOKO
// --------------------------------------------------------
bot.action(/PILIH_TOKO_(.+)/, async (ctx) => {
  try {
    const chatId = ctx.chat?.id.toString();
    const storeId = ctx.match[1]; // Mengambil ID Toko dari tombol yang diklik

    if (!chatId) return;

    // Cari nama toko untuk ditampilkan di pesan balasan
    const store = await prisma.stores.findUnique({ where: { id: storeId } });

    if (!store) {
      ctx.answerCbQuery("Toko tidak ditemukan!"); // Memunculkan tooltip kecil di layar
      return;
    }

    // Simpan Sesi (Owner & active_store_id) ke MongoDB
    await ChatSession.findOneAndUpdate(
      { telegram_chat_id: chatId },
      {
        telegram_chat_id: chatId,
        role: "owner",
        active_store_id: storeId,
      },
      { upsert: true, returnDocument: "after" },
    );

    // Hilangkan efek "loading" pada tombol yang diklik
    ctx.answerCbQuery("Toko berhasil dipilih!");

    // Hapus tombol dari layar dan ganti pesannya
    // Hapus tombol dari layar dan ganti pesannya dengan panduan lengkap
    ctx.editMessageText(
      `🚀 WiraBot sekarang aktif mengelola:\n*${store.store_name}*\n\n` +
        `Silakan kirim pesan suara (Voice Note) atau teks laporan keuangan Anda.\n\n` +
        `💡 *Contoh Pesan/Suara yang dipahami WiraBot:*\n` +
        `🗣️ _"Hari ini laku 3 porsi cumi saus padang"_\n` +
        `🗣️ _"Catat pemasukan, kepiting saus tiram terjual 5 totalnya 500 ribu"_\n` +
        `🗣️ _"Ada pesanan masuk 2 udang bakar madu"_`,
      { parse_mode: "Markdown" },
    );
  } catch (error) {
    console.error("Error saat memilih toko:", error);
    ctx.answerCbQuery("Terjadi kesalahan saat memilih toko.");
  }
});
// --------------------------------------------------------
// EVENT: TEXT MESSAGE
// --------------------------------------------------------
bot.on("text", async (ctx) => {
  try {
    const chatId = ctx.chat.id.toString();
    const textMessage = ctx.message.text;

    if (textMessage.startsWith("/")) return;

    let session = await ChatSession.findOne({ telegram_chat_id: chatId });
    if (!session) {
      session = await ChatSession.create({
        telegram_chat_id: chatId,
        role: "customer",
      });
    }

    const isAdminOrOwner = session.role === "owner" || session.role === "admin";

    await Message.create({
      session_id: session._id,
      sender_type: isAdminOrOwner ? "admin" : "user",
      message_type: "text",
      raw_content: textMessage,
    });

    if ((session as any).session_status === "manual" && !isAdminOrOwner) {
      return; // Berhenti di sini. Pesan sudah tersimpan di atas, jadi aman!
    }

    let botReply = "";

    // 4. Logika Pemisahan Peran (Routing)
    if (isAdminOrOwner) {
      const storeId = session.active_store_id;

      if (!storeId) {
        botReply = "⚠️ ID Toko Anda belum diatur. Silakan login ulang.";
      }
      // FITUR TAMBAH PRODUK BARU
      else if (textMessage.toLowerCase().startsWith("tambah ")) {
        // Ekstrak dengan pola Regex: "Tambah [Nama Produk] harga [Angka]"
        const match = textMessage.match(/tambah\s+(.+?)\s+harga\s+(\d+)/i);

        if (match) {
          const namaProdukBaru = match[1].trim();
          const hargaProduk = Number(match[2]);

          await prisma.products.create({
            data: {
              store_id: storeId,
              name: namaProdukBaru,
              price: hargaProduk,
              stock: 0, // Default 0
              sold: 0,
            },
          });
          botReply = `✅ Produk *${namaProdukBaru}* dengan harga Rp ${hargaProduk.toLocaleString("id-ID")} berhasil ditambahkan ke database toko Anda!`;
        } else {
          botReply =
            "❌ Format penambahan produk salah. Gunakan format:\n*Tambah <nama produk> harga <angka tanpa titik>*";
        }
      }
      // PROSES TRANSAKSI TEKS MANUAL
      else {
        ctx.reply("Menganalisis laporan keuangan Anda...");
        botReply = await eksekusiTransaksiPrisma(textMessage, storeId);
      }
    } else {
      // -----------------------------------------------------
      // LOGIKA CUSTOMER SERVICE (PEMBELI)
      // -----------------------------------------------------
      const TARGET_STORE_ID = session.active_store_id;

      if (!TARGET_STORE_ID) {
        ctx.reply(
          "⚠️ Anda belum terhubung ke toko mana pun. Silakan klik link toko yang diberikan oleh penjual Anda.",
        );
        return;
      }

      // Kirim pesan loading sementara
      await ctx.reply("Memeriksa ketersediaan... 🔍");

      try {
        // Bungkus proses AI ke dalam try-catch agar aman dari timeout/error
        const aiResponse = await prosesChatCustomer(
          textMessage,
          TARGET_STORE_ID,
        );

        // Validasi struktur respons AI
        if (
          aiResponse &&
          aiResponse.is_order &&
          aiResponse.rincian_order &&
          aiResponse.rincian_order.length > 0
        ) {
          // PROSES CHECKOUT
          let totalBelanja = 0;
          const itemPesanan = [];

          // Hitung total dan persiapkan data item
          for (const item of aiResponse.rincian_order) {
            const produk = await prisma.products.findUnique({
              where: { id: item.product_id },
            });
            if (produk) {
              const subtotal = Number(produk.price) * item.kuantitas;
              totalBelanja += subtotal;
              itemPesanan.push({
                product_id: produk.id,
                quantity: item.kuantitas,
                subtotal: subtotal,
              });
            }
          }

          // Validasi jika produk yang dipesan kosong/tidak valid
          if (itemPesanan.length === 0) {
            botReply =
              "⚠️ Maaf, produk yang Anda pesan sepertinya tidak tersedia atau formatnya tidak dikenali.";
          } else {
            // Buat Transaksi PENDING di Database
            const pesanan = await prisma.transactions.create({
              data: {
                store_id: TARGET_STORE_ID,
                type: "PENDING",
                total_amount: totalBelanja,
                source: "telegram_customer",
                notes: `Customer ID: ${chatId}`,
                transaction_items: {
                  create: itemPesanan,
                },
              },
            });

            // Ambil data toko untuk QR Payment
            const storeData = await prisma.stores.findUnique({
              where: { id: TARGET_STORE_ID },
              select: { qr_payment: true, store_name: true },
            });

            const captionPesan = `${aiResponse.pesan_balasan}\n\n💰 *Total Tagihan: Rp ${totalBelanja.toLocaleString("id-ID")}*\n\n⚠️ _Silakan lakukan pembayaran dalam 10 menit. Jika sudah, klik tombol di bawah ini._`;

            // Kirim QR Code atau Fallback Text beserta tombol konfirmasi
            if (storeData && storeData.qr_payment) {
              try {
                // 1. Coba kirim dengan foto QR Code
                await ctx.replyWithPhoto(
                  { url: storeData.qr_payment },
                  {
                    caption: captionPesan,
                    parse_mode: "Markdown",
                    ...Markup.inlineKeyboard([
                      Markup.button.callback(
                        "✅ Saya Sudah Transfer",
                        `PAY_${pesanan.id}`,
                      ),
                    ]),
                  },
                );
              } catch (photoError) {
                console.error(
                  "Gagal memuat gambar QR dari URL:",
                  storeData.qr_payment,
                );

                // 2. JIKA GAGAL: Kirim teks saja sebagai cadangan (Fallback)
                await ctx.reply(
                  `${captionPesan}\n\n_(Catatan: Sistem gagal memuat gambar QR Code. Silakan hubungi admin toko untuk detail nomor rekening.)_`,
                  {
                    parse_mode: "Markdown",
                    ...Markup.inlineKeyboard([
                      Markup.button.callback(
                        "✅ Saya Sudah Transfer",
                        `PAY_${pesanan.id}`,
                      ),
                    ]),
                  },
                );
              }
            } else {
              await ctx.reply(
                `${aiResponse.pesan_balasan}\n\n⚠️ Maaf, toko *${storeData?.store_name}* belum mengatur metode pembayaran QR Code otomatis.\n\n` +
                  `Pesanan Anda sudah dicatat senilai *Rp ${totalBelanja.toLocaleString("id-ID")}*. Silakan hubungi admin toko untuk detail transfer.\n\nJika sudah transfer, klik konfirmasi di bawah ini.`,
                {
                  parse_mode: "Markdown",
                  ...Markup.inlineKeyboard([
                    Markup.button.callback(
                      "✅ Saya Sudah Transfer",
                      `PAY_${pesanan.id}`,
                    ),
                  ]),
                },
              );
            }

            return; // Selesai memproses order
          }
        } else {
          // HANYA CHAT BIASA
          botReply =
            aiResponse?.pesan_balasan ||
            "Maaf, saya tidak mengerti. Bisa diulangi?";
        }
      } catch (error) {
        console.error("Error di logika Customer Service (AI/DB):", error);
        botReply =
          "⚠️ Maaf, sistem kami sedang memproses terlalu banyak permintaan. Silakan coba pesan lagi dalam beberapa saat.";
      }
    }

    // 5. Simpan pesan balasan BOT ke database
    await Message.create({
      session_id: session._id,
      sender_type: "bot",
      message_type: "text",
      raw_content: botReply,
    });

    // 6. Kirim balasan ke Telegram
    ctx.reply(botReply, { parse_mode: "Markdown" });
  } catch (error) {
    console.error("Error memproses teks:", error);
  }
});

// --------------------------------------------------------
// EVENT: KLIK KONFIRMASI PEMBAYARAN OLEH CUSTOMER
// --------------------------------------------------------
bot.action(/PAY_(.+)/, async (ctx) => {
  try {
    const transactionId = ctx.match[1];

    // 1. Cari data pesanan
    const pesanan = await prisma.transactions.findUnique({
      where: { id: transactionId },
      include: {
        transaction_items: { include: { products: true } },
        stores: true,
      },
    });

    if (!pesanan) {
      ctx.answerCbQuery("Pesanan tidak ditemukan.");
      return;
    }

    if (pesanan.type === "INCOME") {
      ctx.answerCbQuery("Pesanan ini sudah lunas sebelumnya!");
      return;
    }

    // 2. VALIDASI KEDALUWARSA (10 MENIT)
    // Hitung selisih waktu sekarang dengan waktu pesanan dibuat
    const waktuSekarang = new Date();
    const waktuDibuat = new Date(pesanan.created_at!);
    const selisihMenit =
      (waktuSekarang.getTime() - waktuDibuat.getTime()) / (1000 * 60);

    if (selisihMenit > 10) {
      // Jika lebih dari 10 menit, batalkan (bisa diubah typenya jadi 'EXPIRED')
      await prisma.transactions.update({
        where: { id: transactionId },
        data: { type: "EXPIRED" },
      });
      ctx.editMessageCaption(
        "❌ *Pesanan Dibatalkan*\nMaaf, batas waktu pembayaran 10 menit telah habis. Silakan buat pesanan baru.",
        { parse_mode: "Markdown" },
      );
      ctx.answerCbQuery("Waktu pembayaran habis.");
      return;
    }

    // 3. JIKA VALID & MASIH DALAM WAKTU 10 MENIT, UBAH JADI LUNAS
    await prisma.$transaction(async (tx) => {
      // Update status transaksi ke INCOME
      await tx.transactions.update({
        where: { id: transactionId },
        data: { type: "INCOME" },
      });

      // Kurangi stok produk secara otomatis
      for (const item of pesanan.transaction_items) {
        if (item.product_id) {
          await tx.products.update({
            where: { id: item.product_id },
            data: {
              stock: { decrement: item.quantity },
              sold: { increment: item.quantity },
            },
          });
        }
      }
    });

    // 4. TERUSKAN NOTIFIKASI KE ADMIN TOKO
    // Cari semua sesi di MongoDB yang menjabat sebagai 'admin' untuk toko ini
    const adminSessions = await ChatSession.find({
      role: "admin",
      active_store_id: pesanan.store_id,
    });

    if (adminSessions.length > 0) {
      let rincianMenu = pesanan.transaction_items
        .map((item) => `- ${item.quantity}x ${item.products?.name}`)
        .join("\n");

      const pesanKeAdmin = `🔔 *ORDER BARU MASUK (SUDAH LUNAS)!*\n\n🏪 Toko: ${pesanan.stores?.store_name}\n\n*Rincian Pesanan:*\n${rincianMenu}\n\n💰 *Total:* Rp ${Number(pesanan.total_amount).toLocaleString("id-ID")}\n\n_Segera siapkan pesanan ini untuk Customer!_`;

      // Kirim pesan (broadcast) ke semua penjual/manajer yang login di toko tersebut
      for (const admin of adminSessions) {
        if (admin.telegram_chat_id) {
          await bot.telegram.sendMessage(admin.telegram_chat_id, pesanKeAdmin, {
            parse_mode: "Markdown",
          });
        }
      }
    }

    // Hapus tombol dan perbarui pesan di layar Customer
    ctx.editMessageCaption(
      `✅ *Pembayaran Berhasil!* \n\nTerima kasih, pesanan Anda senilai Rp ${Number(pesanan.total_amount).toLocaleString("id-ID")} telah diteruskan ke pihak restoran/toko. Mohon ditunggu ya! 🎉`,
      { parse_mode: "Markdown" },
    );

    // 4. TERUSKAN NOTIFIKASI KE OWNER
    // Cari siapa owner dari toko ini melalui sesi MongoDB
    const ownerSession = await ChatSession.findOne({
      role: "owner",
      active_store_id: pesanan.store_id,
    });

    if (ownerSession && ownerSession.telegram_chat_id) {
      let rincianMenu = pesanan.transaction_items
        .map((item) => `- ${item.quantity}x ${item.products?.name}`)
        .join("\n");

      const pesanKeOwner = `🔔 *ORDER BARU MASUK (SUDAH LUNAS)!*\n\n🏪 Toko: ${pesanan.stores?.store_name}\n\n*Rincian Pesanan:*\n${rincianMenu}\n\n💰 *Total:* Rp ${Number(pesanan.total_amount).toLocaleString("id-ID")}\n\n_Segera siapkan pesanan ini ya Bos!_`;

      // Kirim pesan dari bot langsung ke chat ID si Owner
      await bot.telegram.sendMessage(
        ownerSession.telegram_chat_id,
        pesanKeOwner,
        { parse_mode: "Markdown" },
      );
    }
  } catch (error) {
    console.error("Error saat konfirmasi pembayaran:", error);
    ctx.answerCbQuery("Terjadi kesalahan sistem.");
  }
});

// --------------------------------------------------------
// EVENT: VOICE MESSAGE
// --------------------------------------------------------
bot.on("voice", async (ctx) => {
  try {
    const chatId = ctx.chat.id.toString();
    const voiceId = ctx.message.voice.file_id;

    let session = await ChatSession.findOne({ telegram_chat_id: chatId });
    if (!session) {
      session = await ChatSession.create({
        telegram_chat_id: chatId,
        role: "customer",
      });
    }

    // Tentukan apakah pengirim adalah admin/owner
    const isAdminOrOwner = session.role === "owner" || session.role === "admin";

    const fileLink = await ctx.telegram.getFileLink(voiceId);
    const voiceUrl = fileLink.href;

    if ((session as any).session_status !== "manual") {
      ctx.reply("🎧 Audio diterima, sedang mentranskrip...");
    }

    const audioResponse = await fetch(voiceUrl);
    const arrayBuffer = await audioResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Audio = buffer.toString("base64");

    // b. Inisialisasi Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash-lite" });

    // c. Transkripsi Audio
    const result = await model.generateContent([
      "Tolong transkripsikan pesan suara ini ke dalam teks dengan akurat. Hanya berikan teks hasil transkripsinya saja tanpa ada kalimat pembuka/penutup.",
      {
        inlineData: { data: base64Audio, mimeType: "audio/ogg" },
      },
    ]);
    const transcriptionText = result.response.text().trim();

    // Simpan pesan voice USER
    await Message.create({
      session_id: session._id,
      sender_type: isAdminOrOwner ? "admin" : "user",
      message_type: "voice",
      raw_content: voiceUrl,
    });

    if ((session as any).session_status === "manual" && !isAdminOrOwner) {
      return; // Berhenti di sini, tidak ada balasan otomatis dari bot.
    }

    let botReply = "";

    // -----------------------------------------------------
    // LOGIKA PEMROSESAN HASIL TRANSKRIPSI (OWNER VS CUSTOMER)
    // -----------------------------------------------------
    if (session.role === "owner") {
      const storeId = session.active_store_id;

      if (!storeId) {
        botReply =
          "⚠️ ID Toko Anda belum diatur. Silakan login ulang dengan /auth_owner <password> <store_id>";
      } else {
        // Eksekusi hasil transkripsi ke PostgreSQL via Prisma
        const hasilEksekusi = await eksekusiTransaksiPrisma(
          transcriptionText,
          storeId,
        );
        botReply = `📝 *Hasil Transkripsi:*\n"${transcriptionText}"\n\n${hasilEksekusi}`;
      }
    } else {
      botReply = `📝 *Anda bilang:*\n"${transcriptionText}"\n\nPesan suara Anda akan diteruskan ke admin.`;
    }

    // Simpan pesan BOT
    await Message.create({
      session_id: session._id,
      sender_type: "bot",
      message_type: "text",
      raw_content: botReply,
    });

    ctx.reply(botReply, { parse_mode: "Markdown" });
  } catch (error) {
    console.error("Error memproses voice:", error);
    ctx.reply(
      "Maaf, terjadi kesalahan saat mentranskripsi atau mencatat pesan suara Anda.",
    );
  }
});

// --------------------------------------------------------
// HANDLER API NEXT.JS
// --------------------------------------------------------
export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connectDB();
    await bot.handleUpdate(body);

    return NextResponse.json(
      { ok: true, message: "Update diproses" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 200 },
    );
  }
}
