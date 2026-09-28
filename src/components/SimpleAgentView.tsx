import React, { useState } from 'react';
import { ChatMessage, EscalationTicket, AgentRole } from '../types/hotel';
import { routeMessage } from '../agents';
import { QUICK_PROMPTS } from '../data/mockHotelData';

export const SimpleAgentView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'agent',
      senderName: 'Agen Concierge',
      agentRole: 'concierge',
      text: 'Selamat datang di Grand Horizon Hotel! Ada yang dapat dibantu mengenai fasilitas, reservasi, housekeeping, atau tagihan kamar?',
      time: '14:00',
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [activeRole, setActiveRole] = useState<AgentRole>('concierge');
  const [activeName, setActiveName] = useState<string>('Agen Concierge');
  const [escalations, setEscalations] = useState<EscalationTicket[]>([]);
  const [humanReplyText, setHumanReplyText] = useState('');

  // Kirim pesan dari tamu hotel
  const handleSend = (userText: string) => {
    if (!userText.trim()) return;

    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'guest',
      senderName: 'Tamu (Kamar 502)',
      text: userText,
      time: timeNow,
    };

    // Jalankan routing Orchestrator
    const result = routeMessage(userText);
    setActiveRole(result.agentRole);
    setActiveName(result.agentName);

    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      sender: result.isEscalated ? 'human' : 'agent',
      senderName: result.agentName,
      agentRole: result.agentRole,
      text: result.reply,
      time: timeNow,
      isEscalated: result.isEscalated,
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInputVal('');

    // Jika kasus eskalasi, masukkan ke antrean staf manusia
    if (result.isEscalated) {
      setEscalations((prev) => [
        ...prev,
        {
          id: 'esc-' + Date.now(),
          guestMessage: userText,
          time: timeNow,
          status: 'pending',
        },
      ]);
    }
  };

  // Balasan dari Staf Manusia (Front Office)
  const handleHumanReply = (ticketId: string) => {
    if (!humanReplyText.trim()) return;
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const staffMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'human',
      senderName: 'Bpk. Rian (Duty Manager Front Office)',
      agentRole: 'human',
      text: humanReplyText,
      time: timeNow,
    };

    setMessages((prev) => [...prev, staffMsg]);
    setEscalations((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: 'resolved', humanReply: humanReplyText } : t))
    );
    setHumanReplyText('');
    setActiveRole('human');
    setActiveName('Staf Front Desk (Manusia)');
  };

  return (
    <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* SISI KIRI: CHAT TAMU HOTEL (7 Kolom) */}
      <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl flex flex-col h-[650px] shadow-lg overflow-hidden">
        {/* Header Chat */}
        <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
            <span className="font-semibold text-sm text-slate-200">Chat Tamu (WhatsApp Kamar 502)</span>
          </div>
          <span className="text-xs text-slate-400">Tamu: Bpk. Budi Santoso</span>
        </div>

        {/* Contoh Pertanyaan Cepat */}
        <div className="p-2 bg-slate-950/50 border-b border-slate-800/60 flex items-center gap-1.5 overflow-x-auto">
          {QUICK_PROMPTS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p.text)}
              className="text-xs whitespace-nowrap px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition border border-slate-700"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Daftar Pesan */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-900/60">
          {messages.map((m) => (
            <div key={m.id} className={`flex flex-col ${m.sender === 'guest' ? 'items-end' : 'items-start'}`}>
              <span className="text-[11px] text-slate-400 mb-1 px-1 flex items-center gap-1">
                {m.senderName}
                {m.sender === 'human' && (
                  <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-800 px-1.5 py-0.2 rounded">
                    Staf Manusia
                  </span>
                )}
                {m.sender === 'agent' && (
                  <span className="text-[10px] bg-sky-950 text-sky-300 border border-sky-800 px-1.5 py-0.2 rounded">
                    Bot Agen
                  </span>
                )}
              </span>
              <div
                className={`max-w-[85%] rounded-lg p-3 text-sm leading-relaxed ${
                  m.sender === 'guest'
                    ? 'bg-emerald-600 text-white rounded-br-none'
                    : m.sender === 'human'
                    ? 'bg-amber-950/80 border border-amber-700 text-amber-100 rounded-bl-none'
                    : 'bg-slate-800 border border-slate-700 text-slate-100 rounded-bl-none'
                }`}
              >
                {m.text}
                <div className="text-[10px] text-right mt-1 opacity-70">{m.time}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Kirim Pesan */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(inputVal);
          }}
          className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2"
        >
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Ketik pesan tamu..."
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            Kirim
          </button>
        </form>
      </div>

      {/* SISI KANAN: STATUS AGEN & KOLOM STAF MANUSIA (5 Kolom) */}
      <div className="lg:col-span-5 flex flex-col gap-4">
        {/* Status Agen Terakhir */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Agen yang Merespons</h2>
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-lg ${
                activeRole === 'human' ? 'bg-amber-500/20 text-amber-400' : 'bg-sky-500/20 text-sky-400'
              }`}
            >
              {activeRole === 'human' ? '👨‍💼' : '🤖'}
            </div>
            <div>
              <p className="font-semibold text-white text-sm">{activeName}</p>
              <p className="text-xs text-slate-400">
                {activeRole === 'human'
                  ? 'Kasus dialihkan ke Front Office'
                  : `Menjawab otomatis via ${activeRole.toUpperCase()} agent`}
              </p>
            </div>
          </div>
        </div>

        {/* Kolom Staf Manusia (Front Office Human Desk) */}
        <div className="bg-slate-900 border border-amber-900/40 rounded-xl p-4 flex-1 flex flex-col shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-lg">👨‍💼</span>
              <div>
                <h2 className="font-bold text-sm text-amber-300">Kolom Staf Manusia (Front Desk)</h2>
                <p className="text-[11px] text-slate-400">Menjawab komplain atau masalah yang diekskalasi</p>
              </div>
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
              {escalations.filter((e) => e.status === 'pending').length} Menunggu
            </span>
          </div>

          {/* Antrean Pesan yang Perlu Dijawab */}
          <div className="flex-1 my-3 overflow-y-auto space-y-2">
            {escalations.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4 text-slate-400 text-xs">
                <span className="text-2xl mb-1">✅</span>
                Tidak ada komplain aktif. Semua pertanyaan dijawab otomatis oleh Agen AI.
              </div>
            ) : (
              escalations.map((esc) => (
                <div
                  key={esc.id}
                  className={`p-3 rounded-lg border text-xs ${
                    esc.status === 'pending'
                      ? 'bg-amber-950/30 border-amber-700/60 text-slate-200'
                      : 'bg-slate-800/40 border-slate-700/50 text-slate-400'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1 text-[11px]">
                    <span className="font-semibold text-amber-300">Pesan Tamu:</span>
                    <span>{esc.time}</span>
                  </div>
                  <p className="italic mb-2 text-slate-100">"{esc.guestMessage}"</p>

                  {esc.status === 'pending' ? (
                    <div className="space-y-2 pt-2 border-t border-amber-900/40">
                      <div className="flex gap-1">
                        <button
                          onClick={() =>
                            setHumanReplyText('Selamat siang, mohon maaf atas kendalanya. Supervisor kami sedang menuju kamar 502 sekarang.')
                          }
                          className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded"
                        >
                          Template: Menuju Kamar
                        </button>
                        <button
                          onClick={() =>
                            setHumanReplyText('Kami telah memeriksa folio Anda dan tagihan yang keliru telah kami batalkan segera.')
                          }
                          className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded"
                        >
                          Template: Folio Beres
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        value={humanReplyText}
                        onChange={(e) => setHumanReplyText(e.target.value)}
                        placeholder="Tulis balasan staf manusia di sini..."
                        className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
                      />
                      <button
                        onClick={() => handleHumanReply(esc.id)}
                        className="w-full bg-amber-600 hover:bg-amber-500 text-white py-1.5 rounded font-medium text-xs transition"
                      >
                        Kirim Balasan Staf ke Tamu
                      </button>
                    </div>
                  ) : (
                    <div className="text-[11px] text-emerald-400 pt-1 border-t border-slate-800 flex items-center gap-1">
                      <span>✓</span> Sudah dijawab oleh Staf Front Desk
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
