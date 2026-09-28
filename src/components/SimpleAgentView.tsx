import React, { useState } from 'react';
import { ChatMessage, PMSReservation, POSTransaction, HousekeepingTicket, HumanEscalationTicket } from '../types/hotel';
import {
  extractFeatures,
  evaluateEscalationML,
  handleReservationQuery,
  handleConciergeQuery,
  handleHousekeepingQuery,
  handleBillingQuery,
  DEFAULT_LR_PARAMS,
} from '../agents';
import { Send, Bot, User, UserCheck, AlertCircle, RotateCcw, CheckCircle2, Cpu } from 'lucide-react';

interface SimpleAgentViewProps {
  reservations: PMSReservation[];
  posTransactions: POSTransaction[];
  housekeepingTickets: HousekeepingTicket[];
  escalationTickets: HumanEscalationTicket[];
  onAddHousekeepingTicket: (ticket: HousekeepingTicket) => void;
  onAddEscalationTicket: (ticket: HumanEscalationTicket) => void;
  onResolveEscalation: (id: string, notes: string) => void;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

export const SimpleAgentView: React.FC<SimpleAgentViewProps> = ({
  reservations,
  posTransactions,
  escalationTickets,
  onAddHousekeepingTicket,
  onAddEscalationTicket,
  onResolveEscalation,
  messages,
  setMessages,
}) => {
  const currentGuest = reservations[0]; // Budi Santoso (Kamar 802)
  const [guestInput, setGuestInput] = useState('');
  const [staffInput, setStaffInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Status visual agen aktif
  const [activeAgentInfo, setActiveAgentInfo] = useState<{
    name: string;
    role: string;
    detail: string;
    isHuman: boolean;
  }>({
    name: 'Orchestrator Agent',
    role: 'Sistem Standby',
    detail: 'Menunggu pesan tamu masuk untuk dianalisis dan diarahkan ke agen spesialis.',
    isHuman: false,
  });

  // 4 Contoh Pertanyaan Sesuai Skenario Hotel
  const quickCases = [
    { text: 'Jam check-in hotel berapa?', label: 'Agen Concierge', type: 'concierge' },
    { text: 'Saya mau ubah tanggal booking.', label: 'Agen Reservasi', type: 'reservation' },
    { text: 'Kamar saya belum dibersihkan sejak pagi.', label: 'Eskalasi Staf', type: 'human' },
    { text: 'Saya terkena charge Rp2 juta yang tidak saya kenal.', label: 'Eskalasi Staf', type: 'human' },
  ];

  // Fungsi pengiriman pesan tamu
  const handleGuestSend = (text: string) => {
    const cleanText = text.trim();
    if (!cleanText || isTyping) return;

    const time = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    // 1. Tampilkan pesan tamu langsung di chat
    const guestMsg: ChatMessage = {
      id: `guest-${Date.now()}`,
      sender: 'guest',
      channel: 'whatsapp',
      text: cleanText,
      timestamp: time,
    };
    setMessages((prev) => [...prev, guestMsg]);
    setGuestInput('');
    setIsTyping(true);

    // 2. Analisis NLP & ML via Orchestrator
    const features = extractFeatures(cleanText, {
      roomNumber: currentGuest.roomNumber,
      guestName: currentGuest.guestName,
    });

    const ml = evaluateEscalationML(features.intentComplexity, features.riskLevel, DEFAULT_LR_PARAMS);

    let replyText = '';
    let agentDisplayName = '';
    let agentDetailText = '';
    let isEscalated = false;

    if (ml.needsHuman) {
      // Kasus Komplain / Sengketa Finansial -> Eskalasi ke Staf Manusia
      isEscalated = true;
      agentDisplayName = 'Staf Front Office (Manusia)';
      agentDetailText = `Orchestrator mendeteksi risiko tinggi (P=${(ml.probability * 100).toFixed(0)}% > 80%). Dialihkan ke Staf Front Office.`;
      replyText = `Pesan Anda telah kami teruskan ke Staf Front Office (Bpk. Rian Pratama). Staf kami sedang memeriksa dan akan segera membalas langsung di sini.`;

      onAddEscalationTicket({
        id: `ESC-${Date.now().toString().slice(-4)}`,
        roomNumber: currentGuest.roomNumber,
        guestName: currentGuest.guestName,
        customerMessage: cleanText,
        probabilityScore: ml.probability,
        riskLevel: features.riskLevel,
        intentComplexity: features.intentComplexity,
        detectedIntent: features.intentName,
        assignedStaff: 'Rian Pratama (Front Office)',
        status: 'Awaiting Front Office',
        createdAt: time,
      });
    } else {
      // Dijawab oleh Agen Spesialis
      if (features.targetAgent === 'reservation') {
        const res = handleReservationQuery(cleanText, currentGuest, reservations);
        agentDisplayName = 'Agen Reservasi';
        agentDetailText = 'Mengakses Property Management System (PMS) untuk ketersediaan kamar.';
        replyText = res.responseText;
      } else if (features.targetAgent === 'housekeeping') {
        const hk = handleHousekeepingQuery(cleanText, currentGuest);
        agentDisplayName = 'Agen Housekeeping';
        agentDetailText = 'Menerbitkan tiket ke staf runner kamar dengan SLA 15 menit.';
        replyText = hk.responseText;
        if (hk.createdTicket) onAddHousekeepingTicket(hk.createdTicket);
      } else if (features.targetAgent === 'billing') {
        const bill = handleBillingQuery(cleanText, currentGuest, posTransactions, reservations);
        agentDisplayName = 'Agen Billing & POS';
        agentDetailText = 'Mengambil rincian transaksi dari Point of Sale (POS) dan folio kamar.';
        replyText = bill.responseText;
      } else {
        const conc = handleConciergeQuery(cleanText, currentGuest);
        agentDisplayName = 'Agen Concierge';
        agentDetailText = 'Membaca direktori fasilitas hotel dan rekomendasi lokal.';
        replyText = conc.responseText;
      }
    }

    setActiveAgentInfo({
      name: agentDisplayName,
      role: isEscalated ? 'Eskalasi Staf' : 'Agen Spesialis',
      detail: agentDetailText,
      isHuman: isEscalated,
    });

    // 3. Respon bot muncul dalam 300ms
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: isEscalated ? 'human_staff' : 'agent',
          agentSource: isEscalated ? 'human_escalation' : features.targetAgent,
          channel: 'whatsapp',
          text: replyText,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsTyping(false);
    }, 350);
  };

  // Fungsi pengiriman balasan oleh Staf Manusia
  const handleStaffSend = () => {
    const text = staffInput.trim();
    if (!text) return;

    const time = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    setMessages((prev) => [
      ...prev,
      {
        id: `staff-${Date.now()}`,
        sender: 'human_staff',
        agentSource: 'human_escalation',
        channel: 'whatsapp',
        text: `[Staf Front Office]: ${text}`,
        timestamp: time,
      },
    ]);

    // Tandai tiket eskalasi selesai
    const pending = escalationTickets.find((t) => t.status !== 'Resolved');
    if (pending) {
      onResolveEscalation(pending.id, text);
    }

    setStaffInput('');
    setActiveAgentInfo({
      name: 'Staf Front Office (Bpk. Rian Pratama)',
      role: 'Intervensi Manusia',
      detail: 'Staf manusia telah membalas langsung ke tamu.',
      isHuman: true,
    });
  };

  const pendingTicket = escalationTickets.find((t) => t.status !== 'Resolved');

  return (
    <div className="space-y-4">
      {/* 1. Indikator Agen yang Bekerja (Jelas & Real-Time) */}
      <div className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 transition-all ${
        activeAgentInfo.isHuman 
          ? 'bg-rose-950/40 border-rose-500/50 text-rose-200' 
          : 'bg-slate-900 border-slate-800 text-slate-200'
      }`}>
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
            activeAgentInfo.isHuman ? 'bg-rose-500 text-white' : 'bg-amber-400 text-slate-950'
          }`}>
            {activeAgentInfo.isHuman ? <UserCheck className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-white">{activeAgentInfo.name}</span>
              <span className={`text-[10px] px-2 py-0.2 rounded font-semibold ${
                activeAgentInfo.isHuman ? 'bg-rose-500/30 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
              }`}>
                {activeAgentInfo.role}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">{activeAgentInfo.detail}</p>
          </div>
        </div>

        <button
          onClick={() => {
            setMessages([
              {
                id: 'init-1',
                sender: 'agent',
                channel: 'whatsapp',
                text: `Halo ${currentGuest.guestName}, selamat datang di Grand Horizon Hotel. Layanan Customer Service kami siap membantu Anda 24 jam.`,
                timestamp: '11:00',
              },
            ]);
            setActiveAgentInfo({
              name: 'Orchestrator Agent',
              role: 'Sistem Standby',
              detail: 'Menunggu pesan tamu masuk untuk dianalisis dan diarahkan ke agen spesialis.',
              isHuman: false,
            });
          }}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 self-end sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Chat</span>
        </button>
      </div>

      {/* 2. Dua Layar Utama: Chat Tamu & Kolom Balasan Staf Manusia */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* LAYAR KIRI: CHAT TAMU */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl flex flex-col h-[520px] overflow-hidden">
          {/* Header Chat */}
          <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-400" />
              Obrolan Tamu Hotel (Kamar 802)
            </span>
            <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
              Online 24 Jam
            </span>
          </div>

          {/* Isi Pesan */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin">
            {messages.map((m) => {
              const isGuest = m.sender === 'guest';
              const isStaff = m.sender === 'human_staff';

              return (
                <div key={m.id} className={`flex flex-col ${isGuest ? 'items-end' : 'items-start'}`}>
                  <span className="text-[10px] text-slate-500 mb-0.5 px-1">
                    {isGuest ? 'Tamu (Bpk. Budi Santoso)' : isStaff ? 'Staf Front Office (Manusia)' : 'Agen Hotel (Bot)'}
                  </span>
                  <div
                    className={`max-w-[85%] rounded-xl px-3 py-2 text-xs whitespace-pre-wrap leading-relaxed shadow-sm ${
                      isGuest
                        ? 'bg-amber-600 text-white rounded-tr-none'
                        : isStaff
                        ? 'bg-rose-950 border border-rose-500/70 text-rose-100 rounded-tl-none font-sans'
                        : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none'
                    }`}
                  >
                    {m.text}
                  </div>
                  <span className="text-[9px] text-slate-600 px-1 mt-0.5">{m.timestamp}</span>
                </div>
              );
            })}

            {isTyping && (
              <div className="text-xs text-amber-300 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 w-fit flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
                <span>Agen sedang memproses jawaban...</span>
              </div>
            )}
          </div>

          {/* Tombol Contoh Pertanyaan Cepat */}
          <div className="p-2.5 bg-slate-950 border-t border-slate-850">
            <span className="text-[10px] text-slate-400 block mb-1">
              Klik contoh pesan tamu di bawah untuk mencoba respon agen:
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {quickCases.map((c, i) => (
                <button
                  key={i}
                  onClick={() => handleGuestSend(c.text)}
                  className="text-left text-[11px] p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800 transition-colors"
                >
                  <div className="truncate font-medium">"{c.text}"</div>
                  <div className="text-[9px] text-amber-400 font-mono mt-0.5">Tujuan: {c.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Input Chat Tamu */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleGuestSend(guestInput);
            }}
            className="p-2.5 bg-slate-950 border-t border-slate-800 flex gap-1.5"
          >
            <input
              type="text"
              value={guestInput}
              onChange={(e) => setGuestInput(e.target.value)}
              placeholder="Tulis pesan tamu di sini (contoh: minta handuk, tanya wifi, komplain)..."
              className="flex-1 bg-slate-900 text-slate-100 text-xs px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              disabled={!guestInput.trim() || isTyping}
              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1 disabled:opacity-50"
            >
              <span>Kirim</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* LAYAR KANAN: KOLOM BALASAN STAF MANUSIA */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl flex flex-col h-[520px] overflow-hidden justify-between">
          <div>
            <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-rose-400" />
                Kolom Respon Staf Manusia (Front Desk)
              </span>
              {pendingTicket ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
                  Butuh Balasan Staf
                </span>
              ) : (
                <span className="text-[10px] text-slate-500">Standby</span>
              )}
            </div>

            <div className="p-3 space-y-3">
              {/* Notifikasi jika ada eskalasi dari tamu */}
              {pendingTicket ? (
                <div className="bg-rose-950/30 border border-rose-500/40 rounded-lg p-2.5 text-xs text-rose-200 space-y-1">
                  <div className="flex items-center gap-1 font-semibold text-rose-300">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>Pesan Tamu yang Memerlukan Jawaban Anda:</span>
                  </div>
                  <p className="italic bg-slate-950 p-2 rounded text-slate-200 border border-rose-500/20">
                    "{pendingTicket.customerMessage}"
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Kategori: {pendingTicket.detectedIntent} · Skor Risiko: {(pendingTicket.probabilityScore * 100).toFixed(0)}%
                  </p>
                </div>
              ) : (
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-850 text-xs text-slate-400">
                  Saat ini tidak ada komplain tertunda. Jika tamu mengirim komplain berat atau sengketa tagihan, sistem otomatis mengalihkannya ke sini.
                </div>
              )}

              {/* Template Cepat Staf */}
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-medium block">Pilihan jawaban cepat staf:</span>
                {[
                  'Tagihan Rp2 juta tersebut adalah otorisasi jaminan sementara dan telah kami batalkan.',
                  'Mohon maaf atas ketidaknyamanannya, staf housekeeping sedang menuju kamar Anda sekarang.',
                  'Permintaan Anda telah kami catat dan diperbarui di sistem hotel.',
                ].map((tpl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setStaffInput(tpl)}
                    className="w-full text-left text-[11px] p-2 rounded bg-slate-950 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-850 truncate block"
                  >
                    • {tpl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Area Input Staf Manusia */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 space-y-2">
            <label className="text-[11px] text-slate-300 font-medium block">
              Ketik Balasan Staf Manusia ke Tamu:
            </label>
            <textarea
              rows={3}
              value={staffInput}
              onChange={(e) => setStaffInput(e.target.value)}
              placeholder="Tulis klarifikasi staf di sini (pesan ini akan langsung masuk ke chat tamu)..."
              className="w-full bg-slate-900 text-slate-100 text-xs p-2.5 rounded-lg border border-slate-700 focus:outline-none focus:border-rose-400"
            />
            <button
              onClick={handleStaffSend}
              disabled={!staffInput.trim()}
              className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Kirim Jawaban Staf ke Tamu</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
