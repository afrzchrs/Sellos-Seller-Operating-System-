'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { 
  MessageSquare, 
  Search, 
  Bot, 
  User, 
  Send, 
  MoreVertical, 
  CheckCheck, 
  Clock,
  AlertCircle,
  ToggleRight,
  ToggleLeft,
  ArrowLeft
} from 'lucide-react';

export default function RiwayatChatPage() {
  const params = useParams();
  // Pastikan key ini sesuai dengan nama folder dinamis Anda, misal [StoreId] atau [id]
  const storeId = params.StoreId || params.id; 

  const [contacts, setContacts] = useState<any[]>([]);
  const [activeContactId, setActiveContactId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoadingContacts, setIsLoadingContacts] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  // 1. Ambil Daftar Kontak/Sesi Chat berdasarkan Store ID
  const fetchContacts = async () => {
    if (!storeId) return;
    try {
      const res = await fetch(`/api/SessionChat?storeId=${storeId}`);
      if (res.ok) {
        const data = await res.json();
        // Menyesuaikan jika data dibungkus dalam objek { success, data } atau langsung array
        const listKontak = Array.isArray(data) ? data : (data.data || []);
        
        setContacts(listKontak);
        if (listKontak.length > 0 && !activeContactId) {
          setContacts(listKontak);
        if (listKontak.length > 0 && !activeContactId) {
          // Ambil _id dari item pertama
          setActiveContactId(listKontak[0]._id); 
        }
        }
      }
    } catch (error) {
      console.error("Gagal memuat kontak:", error);
    } finally {
      setIsLoadingContacts(false);
    }
  };

  // 2. Ambil Pesan Berdasarkan Sesi Aktif (_id ChatSession)
  const fetchMessages = async (sessionId: string) => {
    try {
      setIsLoadingMessages(true);
      const res = await fetch(`/api/messages?sessionId=${sessionId}`);
      if (res.ok) {
        const data = await res.json();
        const listPesan = Array.isArray(data) ? data : (data.data || []);
        setMessages(listPesan);
      }
    } catch (error) {
      console.error("Gagal memuat pesan:", error);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  // Jalankan polling real-time kontak setiap 3 detik
  useEffect(() => {
    fetchContacts();
    const intervalContacts = setInterval(fetchContacts, 3000);
    return () => clearInterval(intervalContacts);
  }, [storeId]);

  // Jalankan polling real-time pesan berdasarkan sesi yang sedang dibuka
  useEffect(() => {
    if (activeContactId) {
      fetchMessages(activeContactId);
      const intervalMessages = setInterval(() => fetchMessages(activeContactId), 3000);
      return () => clearInterval(intervalMessages);
    }
  }, [activeContactId]);

  const activeContact = contacts.find(c => c._id === activeContactId);

// 3. Fungsi Human Handoff (Matikan/Nyalakan Bot di Sesi Ini)
  const toggleBotStatus = async () => {
    if (!activeContact) return;
    const newStatus = !activeContact.isBotActive;

    try {
      // UBAH DISINI: Gunakan query parameter ?sessionId=
      await fetch(`/api/toggle-bot?sessionId=${activeContactId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isBotActive: newStatus })
      });
      
      setContacts(contacts.map(c => 
        c._id === activeContactId ? { ...c, isBotActive: newStatus } : c
      ));
    } catch (error) {
      console.error("Gagal mengubah status bot:", error);
    }
  };

  // 4. Fungsi Kirim Pesan Manual oleh Pemilik Toko ke Telegram Pembeli
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeContactId) return;

    const textKirim = inputText;
    setInputText('');

    try {
      // UBAH DISINI: Gunakan query parameter ?sessionId=
      const res = await fetch(`/api/send-message?sessionId=${activeContactId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textKirim, storeId })
      });

      if (res.ok) {
        fetchMessages(activeContactId); // Refresh pesan langsung
      }
    } catch (error) {
      console.error("Gagal mengirim pesan manual:", error);
    }
  };
  return (
    <div className="h-[calc(100vh-80px)] flex flex-col space-y-4 animate-in fade-in duration-500 px-6 pt-6 pb-6">
      
      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          Riwayat Chat <MessageSquare className="w-6 h-6 text-blue-500" />
        </h2>
        <p className="text-slate-500 text-sm mt-1">Pantau interaksi WiraBot secara real-time dan ambil alih percakapan kapan saja.</p>
      </div>

      {/* CHAT INTERFACE (SPLIT LAYOUT) */}
      <div className="flex-1 bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex">
        
        {/* SISI KIRI: DAFTAR KONTAK */}
        <div className={`w-full md:w-1/3 lg:w-1/4 border-r border-slate-100 flex flex-col ${activeContactId !== null ? 'hidden md:flex' : 'flex'}`}>
          
          <div className="p-4 border-b border-slate-100">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Cari pelanggan..." className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-300 transition-colors" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {contacts.length === 0 ? (
              <p className="text-center text-xs text-slate-400 p-6">Belum ada chat masuk dari pelanggan.</p>
            ) : (
              contacts.map((contact) => (
                <div 
                  key={contact._id} 
                  onClick={() => setActiveContactId(contact._id)}
                  className={`p-4 border-b border-slate-50 cursor-pointer transition-colors flex items-start gap-3 relative ${activeContactId === contact._id ? 'bg-blue-50/50' : 'hover:bg-slate-50'}`}
                >
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
                    <User className="w-6 h-6 text-slate-400" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="font-bold text-slate-900 truncate pr-4">{contact.name || `User Telegram (${contact.telegram_chat_id?.slice(-4)})`}</h4>
                      <span className="text-xs text-slate-400 shrink-0">{contact.time || 'Baru saja'}</span>
                    </div>
                    <p className="text-sm truncate mb-1.5 text-slate-500">
                      {contact.lastMessage || 'Mengirim pesan...'}
                    </p>
                    
                    {/* Status Bot/Manual */}
                    <div className="flex items-center gap-1 mt-1">
                      {contact.isBotActive ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                          <Bot className="w-3 h-3" /> WiraBot Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                          <User className="w-3 h-3" /> Manual (Anda)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* SISI KANAN: RUANG OBROLAN */}
        <div className={`flex-1 flex flex-col bg-slate-50/30 ${activeContactId === null ? 'hidden md:flex' : 'flex'}`}>
          
          {activeContact ? (
            <>
              {/* Header Ruang Chat */}
              <div className="h-16 px-6 border-b border-slate-100 bg-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                  <button onClick={() => setActiveContactId(null)} className="md:hidden text-slate-400 hover:text-slate-600">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 sm:flex">
                    <User className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{activeContact.name || `Pelanggan (${activeContact.telegram_chat_id})`}</h3>
                    <p className="text-xs text-slate-500">Telegram Chat ID: {activeContact.telegram_chat_id}</p>
                  </div>
                </div>
              </div>

              {/* BAR HUMAN HANDOFF */}
              <div className={`px-6 py-3 flex items-center justify-between border-b transition-colors ${activeContact.isBotActive ? 'bg-emerald-50 border-emerald-100' : 'bg-amber-50 border-amber-100'}`}>
                <div className="flex items-center gap-3">
                  {activeContact.isBotActive ? (
                    <Bot className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                  )}
                  <div>
                    <p className={`text-sm font-bold ${activeContact.isBotActive ? 'text-emerald-800' : 'text-amber-800'}`}>
                      {activeContact.isBotActive ? 'WiraBot Sedang Melayani' : 'WiraBot Dinonaktifkan'}
                    </p>
                    <p className={`text-xs ${activeContact.isBotActive ? 'text-emerald-600' : 'text-amber-700'}`}>
                      {activeContact.isBotActive ? 'Balasan otomatis menyala.' : 'Anda memegang kendali penuh (Human Handoff).'}
                    </p>
                  </div>
                </div>
                
                <button 
                  onClick={toggleBotStatus}
                  className="flex items-center gap-2 text-sm font-bold bg-white px-3 py-1.5 rounded-lg border shadow-sm transition-colors hover:bg-slate-50"
                >
                  {activeContact.isBotActive ? (
                    <><ToggleRight className="w-5 h-5 text-emerald-500" /> Matikan Bot</>
                  ) : (
                    <><ToggleLeft className="w-5 h-5 text-slate-400" /> Nyalakan Bot</>
                  )}
                </button>
              </div>

              {/* Area Bubble Pesan */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender_type === 'user' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[75%] lg:max-w-[60%] flex flex-col ${msg.sender_type === 'user' ? 'items-start' : 'items-end'}`}>
                      
                      <span className="text-[10px] font-bold text-slate-400 mb-1 flex items-center gap-1">
                        {msg.sender_type === 'user' ? <><User className="w-3 h-3" /> Pelanggan</> : msg.sender_type === 'bot' ? <><Bot className="w-3 h-3" /> WiraBot</> : <><User className="w-3 h-3" /> Anda (Manual)</>}
                      </span>

                      <div className={`px-4 py-2.5 rounded-2xl text-sm md:text-base leading-relaxed ${
                        msg.sender_type === 'user' 
                          ? 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm' 
                          : msg.sender_type === 'bot'
                          ? 'bg-emerald-100 text-emerald-900 rounded-tr-none'
                          : 'bg-blue-600 text-white rounded-tr-none shadow-md'
                      }`}>
                        {msg.raw_content}
                      </div>

                      <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400 font-medium">
                        <Clock className="w-3 h-3" /> {new Date(msg.createdAt || msg.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Area Input (Hanya aktif jika Bot dimatikan) */}
              <div className="p-4 bg-white border-t border-slate-100">
                {activeContact.isBotActive ? (
                  <div className="w-full bg-slate-50 border border-slate-200 text-slate-400 text-sm font-medium py-3 rounded-xl flex justify-center items-center gap-2 cursor-not-allowed">
                    <Bot className="w-4 h-4" /> WiraBot sedang memegang kendali. Matikan bot di atas untuk membalas manual.
                  </div>
                ) : (
                  <form onSubmit={handleSendMessage} className="flex items-end gap-3">
                    <textarea 
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Ketik balasan manual ke Telegram pembeli..."
                      className="flex-1 max-h-32 min-h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                      rows={1}
                    />
                    <button 
                      type="submit"
                      disabled={!inputText.trim()}
                      className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-colors disabled:bg-slate-300 shadow-sm shrink-0"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </form>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-400 opacity-60">
              <MessageSquare className="w-16 h-16 mb-4" />
              <p>Pilih percakapan di sebelah kiri untuk mulai memantau chat.</p>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}