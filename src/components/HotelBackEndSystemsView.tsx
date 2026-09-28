import React, { useState } from 'react';
import {
  PMSReservation,
  POSTransaction,
  HousekeepingTicket,
  HumanEscalationTicket,
} from '../types/hotel';
import {
  Database,
  Receipt,
  Sparkles,
  ShieldAlert,
  Calendar,
  CheckCircle,
  Clock,
  Send,
  UserCheck,
  Search,
  Filter,
} from 'lucide-react';

interface HotelBackEndSystemsViewProps {
  reservations: PMSReservation[];
  posTransactions: POSTransaction[];
  housekeepingTickets: HousekeepingTicket[];
  escalationTickets: HumanEscalationTicket[];
  onResolveEscalation: (id: string, resolutionNotes: string) => void;
  onUpdateReservationDates: (id: string, newCheckOut: string) => void;
  onUpdateTicketStatus: (id: string, status: HousekeepingTicket['status']) => void;
}

export const HotelBackEndSystemsView: React.FC<HotelBackEndSystemsViewProps> = ({
  reservations,
  posTransactions,
  housekeepingTickets,
  escalationTickets,
  onResolveEscalation,
  onUpdateReservationDates,
  onUpdateTicketStatus,
}) => {
  const [activeSystemTab, setActiveSystemTab] = useState<'pms' | 'pos' | 'facility' | 'escalation'>('escalation');
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-amber-400 uppercase tracking-widest">
                Hotel Back-End Systems Integration
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-400">PMS · POS · Fasilitas · Meja Eskalasi Staf</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Sistem Operasional Hotel & Data Real-Time
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
              Sesuai penelitian Wang et al. (2025) dan laporan industri Conduit (2026), chatbot hotel yang
              terhubung langsung ke sistem operasional operasional riil memiliki tingkat penyelesaian tugas
              mencapai 95.5%, jauh mengungguli chatbot FAQ konvensional.
            </p>
          </div>

          {/* Subsystem Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 self-start md:self-auto">
            <button
              onClick={() => setActiveSystemTab('escalation')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                activeSystemTab === 'escalation'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Meja Eskalasi FO</span>
              {escalationTickets.filter((t) => t.status !== 'Resolved').length > 0 && (
                <span className="bg-white text-rose-700 text-[10px] font-bold px-1.5 rounded-full ml-0.5">
                  {escalationTickets.filter((t) => t.status !== 'Resolved').length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveSystemTab('pms')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                activeSystemTab === 'pms'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>PMS Reservasi ({reservations.length})</span>
            </button>

            <button
              onClick={() => setActiveSystemTab('pos')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                activeSystemTab === 'pos'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>POS Transaksi ({posTransactions.length})</span>
            </button>

            <button
              onClick={() => setActiveSystemTab('facility')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                activeSystemTab === 'facility'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Housekeeping ({housekeepingTickets.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1. FRONT OFFICE HUMAN ESCALATION QUEUE */}
      {activeSystemTab === 'escalation' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span>Antrean Tiket Eskalasi Staf Front Office (Human Intervention Desk)</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Daftar pesan customer yang melampaui batas ambang risiko (P(Human|x) &gt; τ) untuk penanganan manual.
                </p>
              </div>

              <span className="text-xs font-mono text-slate-400">
                {escalationTickets.filter((t) => t.status !== 'Resolved').length} Tiket Menunggu Tindakan
              </span>
            </div>

            {escalationTickets.length === 0 ? (
              <div className="p-8 text-center bg-slate-950/60 rounded-xl border border-slate-850">
                <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-60" />
                <h4 className="text-sm font-semibold text-slate-300">Semua Tiket Eskalasi Teratasi</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Tidak ada pesan berisiko tinggi yang menunggu intervensi staf saat ini.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {escalationTickets.map((ticket) => {
                  const isResolved = ticket.status === 'Resolved';

                  return (
                    <div
                      key={ticket.id}
                      className={`p-4 rounded-xl border transition-all ${
                        isResolved
                          ? 'bg-slate-950/40 border-slate-800 opacity-70'
                          : 'bg-slate-950 border-rose-500/40 shadow-lg'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-850 pb-2.5 mb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono text-xs font-bold text-rose-400">
                            {ticket.id}
                          </span>
                          <span className="text-slate-600">·</span>
                          <span className="text-xs font-bold text-white">
                            Kamar {ticket.roomNumber} ({ticket.guestName})
                          </span>
                          <span className="text-[10px] bg-slate-900 text-slate-400 px-2 py-0.5 rounded font-mono">
                            Dibuat: {ticket.createdAt}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 font-mono text-xs">
                          <span className="text-slate-400">Skor ML:</span>
                          <span className="text-rose-400 font-bold bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800/60">
                            P = {(ticket.probabilityScore * 100).toFixed(1)}%
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              isResolved
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : 'bg-amber-950 text-amber-300 border border-amber-800 animate-pulse'
                            }`}
                          >
                            {ticket.status}
                          </span>
                        </div>
                      </div>

                      {/* Customer Message Body */}
                      <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-850 mb-3 text-xs">
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">
                          Pesan Asli Dari Tamu:
                        </span>
                        <p className="text-slate-200 font-medium italic">
                          "{ticket.customerMessage}"
                        </p>
                        <div className="mt-2 pt-2 border-t border-slate-800 flex flex-wrap gap-4 text-[11px] text-slate-400 font-mono">
                          <span>Intent: <strong className="text-slate-200">{ticket.detectedIntent}</strong></span>
                          <span>Kompleksitas (x1): <strong className="text-amber-400">{ticket.intentComplexity}</strong></span>
                          <span>Tingkat Risiko (x2): <strong className="text-rose-400">{ticket.riskLevel}</strong></span>
                          <span>Duty Staf: <strong className="text-slate-200">{ticket.assignedStaff}</strong></span>
                        </div>
                      </div>

                      {/* Staff Resolution Form */}
                      {!isResolved ? (
                        <div className="space-y-2 pt-1">
                          <label className="text-[11px] text-slate-400 block font-medium">
                            Kirim Jawaban Staf Front Office / Catatan Resolusi Supervisor:
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={replyTextMap[ticket.id] || ''}
                              onChange={(e) =>
                                setReplyTextMap((prev) => ({
                                  ...prev,
                                  [ticket.id]: e.target.value,
                                }))
                              }
                              placeholder="Ketik tanggapan langsung kepada tamu (contoh: 'Tagihan Rp 2 juta telah kami verifikasi dan kami batalkan')..."
                              className="flex-1 bg-slate-900 text-slate-200 text-xs px-3 py-2 rounded-lg border border-slate-750 focus:outline-none focus:border-rose-400"
                            />
                            <button
                              onClick={() => {
                                const notes =
                                  replyTextMap[ticket.id] ||
                                  'Telah diselesaikan secara manual oleh staf Front Office.';
                                onResolveEscalation(ticket.id, notes);
                              }}
                              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 active:scale-95 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shrink-0"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                              <span>Selesaikan & Balas Tamu</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs text-emerald-400 bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-800/40 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 shrink-0" />
                          <span>Resolusi: {ticket.resolutionNotes}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. PROPERTY MANAGEMENT SYSTEM (PMS) */}
      {activeSystemTab === 'pms' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-400" />
                <span>Property Management System (PMS) · Live Room Inventory & In-House Folio</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Database terpusat reservasi kamar hotel, jadwal check-in/out, dan status kamar.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                  <th className="py-2.5 px-3">Kode Booking</th>
                  <th className="py-2.5 px-3">Kamar</th>
                  <th className="py-2.5 px-3">Nama Tamu</th>
                  <th className="py-2.5 px-3">Tipe Kamar</th>
                  <th className="py-2.5 px-3">Check-In</th>
                  <th className="py-2.5 px-3">Check-Out</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Tarif / Malam</th>
                  <th className="py-2.5 px-3 text-center">Aksi Agen PMS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {reservations.map((res) => (
                  <tr key={res.id} className="hover:bg-slate-850/60 transition-colors">
                    <td className="py-3 px-3 font-mono text-amber-400 font-semibold">
                      {res.confirmationCode}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-white">
                      {res.roomNumber}
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-200">
                      {res.guestName}
                    </td>
                    <td className="py-3 px-3 text-slate-300">
                      {res.roomType}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-400">
                      {res.checkIn}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-300 font-bold">
                      {res.checkOut}
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        {res.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-200 tabular-nums">
                      Rp {res.ratePerNight.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => {
                          const nextDate = '2026-10-02';
                          onUpdateReservationDates(res.id, nextDate);
                        }}
                        className="text-[11px] px-2 py-1 bg-slate-800 hover:bg-slate-700 text-blue-300 rounded border border-slate-700 transition-colors"
                        title="Simulasi Perpanjang Menginap via PMS API"
                      >
                        Perpanjang (+2 Hari)
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. POINT OF SALE (POS) TRANSACTIONS */}
      {activeSystemTab === 'pos' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Receipt className="w-4 h-4 text-purple-400" />
                <span>Point of Sale (POS) · Tagihan Outlet Hotel (Restoran, Lounge, Spa)</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Ditarik real-time oleh Agen Billing untuk transparansi rincian folio kepada tamu.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {posTransactions.map((trx) => (
              <div
                key={trx.id}
                className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                  <div>
                    <span className="text-[10px] font-mono text-purple-400 block">{trx.id}</span>
                    <h4 className="text-xs font-bold text-white">{trx.department}</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-amber-300">
                      Kamar {trx.roomNumber}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      {trx.timestamp}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  {trx.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-slate-300">
                      <span>
                        {item.name} <span className="text-slate-500 font-mono">x{item.quantity}</span>
                      </span>
                      <span className="font-mono text-slate-400 tabular-nums">
                        Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-850 text-xs font-mono space-y-1 text-slate-400">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>Rp {trx.subtotal.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span>Pajak & Servis (21%):</span>
                    <span>Rp {trx.taxAndService.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-slate-200 font-bold text-sm pt-1 border-t border-slate-800">
                    <span className="text-amber-400">Total Posted:</span>
                    <span className="text-amber-400 tabular-nums">
                      Rp {trx.total.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. FACILITY & HOUSEKEEPING MANAGEMENT */}
      {activeSystemTab === 'facility' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Facility & Housekeeping Management System · Live Task Board</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Dikelola oleh Agen Housekeeping & Maintenance untuk dispatch tugas otomatis dan pelacakan SLA.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {housekeepingTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-emerald-400">
                      {ticket.id}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        ticket.status === 'Resolved'
                          ? 'bg-slate-800 text-slate-400'
                          : ticket.status === 'In Progress'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white">
                    Kamar {ticket.roomNumber} · {ticket.category}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {ticket.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-850 text-[11px] text-slate-400 space-y-1 font-mono">
                  <div className="flex items-center justify-between">
                    <span>Petugas:</span>
                    <span className="text-slate-200">{ticket.assignedStaff.split('(')[0]}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Target Waktu (SLA):</span>
                    <span className="text-amber-400 font-bold">{ticket.targetMinutes} menit</span>
                  </div>

                  {ticket.status !== 'Resolved' && (
                    <button
                      onClick={() => onUpdateTicketStatus(ticket.id, 'Resolved')}
                      className="w-full mt-2 py-1.5 bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-800/60 rounded text-xs font-medium transition-colors"
                    >
                      Tandai Selesai (Resolved)
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
