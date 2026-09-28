import React, { useState } from 'react';
import {
  Users,
  Smartphone,
  Tablet,
  Monitor,
  MessageSquare,
  Cpu,
  CalendarCheck,
  MapPin,
  Sparkles,
  Receipt,
  ShieldAlert,
  Database,
  Building,
  ArrowDown,
  Layers,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

export const MultiAgentArchitectureView: React.FC = () => {
  const [selectedAgentCard, setSelectedAgentCard] = useState<string>('reservation');

  const agentsData = [
    {
      id: 'reservation',
      name: 'Agen Reservasi',
      title: 'Reservation & Booking Agent',
      color: 'blue',
      icon: CalendarCheck,
      system: 'Property Management System (PMS) & DB Reservasi',
      responsibility:
        'Mengakses PMS untuk memeriksa ketersediaan kamar, mengonfirmasi booking, memproses perubahan jadwal (reschedule), perpanjangan menginap, serta kebijakan pembatalan.',
      inputs: 'Permintaan tanggal, tipe kamar, nomor reservasi, nama tamu',
      outputs: 'Konfirmasi ketersediaan, kalkulasi selisih tarif, update status PMS',
      tools: ['PMS.getReservationDetails()', 'PMS.checkRoomAvailability()', 'PMS.updateBookingDates()'],
      metrics: {
        avgResponseTime: '0.4s',
        queriesHandled: 142,
        autonomousRate: '98.5%',
      },
    },
    {
      id: 'concierge',
      name: 'Agen Concierge',
      title: 'Local Knowledge & Amenities Agent',
      color: 'amber',
      icon: MapPin,
      system: 'Local Knowledge Base & Wisata/Fasilitas API',
      responsibility:
        'Mengolah basis pengetahuan lokal dan direktori hotel untuk memberikan rekomendasi wisata kuliner, atraksi populer, reservasi restoran, jadwal shuttle bandara, serta panduan fasilitas hotel.',
      inputs: 'Pertanyaan fasilitas hotel (pool, gym, sarapan), preferensi wisata & kuliner',
      outputs: 'Rekomendasi terpersonalisasi, panduan arah, jam operasional fasilitas',
      tools: ['KnowledgeBase.searchFacilityInfo()', 'TourismAPI.getNearbyAttractions()', 'Concierge.bookTable()'],
      metrics: {
        avgResponseTime: '0.3s',
        queriesHandled: 289,
        autonomousRate: '99.1%',
      },
    },
    {
      id: 'housekeeping',
      name: 'Agen Housekeeping / Maintenance',
      title: 'Facility & Service Dispatch Agent',
      color: 'emerald',
      icon: Sparkles,
      system: 'Facility Management System & Aplikasi Staf Runner',
      responsibility:
        'Meneruskan laporan kerusakan fasilitas kamar atau permintaan kebutuhan amenitas (handuk, bantal, air mineral) langsung ke sistem manajemen fasilitas dan mendisposisikan tugas ke staf.',
      inputs: 'Nomor kamar, jenis permintaan amenitas, deskripsi kerusakan/keluhan fisik',
      outputs: 'Penerbitan tiket kerja dispatch, penentuan SLA waktu tiba, update status kamar',
      tools: ['FacilityManagement.dispatchTicket()', 'StaffApp.notifyFloorRunner()', 'SLA.startTimer()'],
      metrics: {
        avgResponseTime: '0.5s',
        queriesHandled: 187,
        autonomousRate: '94.2%',
      },
    },
    {
      id: 'billing',
      name: 'Agen Billing & POS',
      title: 'Point of Sale & Folio Agent',
      color: 'purple',
      icon: Receipt,
      system: 'Point of Sale (POS) & Database Billing Hotel',
      responsibility:
        'Mengambil data rincian transaksi secara akurat dan real-time dari POS (The Grand Brasserie, Lounge, Spa) dan PMS, menyajikan tagihan transparan, serta memverifikasi biaya.',
      inputs: 'Nomor kamar, kode verifikasi tamu, pertanyaan perincian invoice',
      outputs: 'Rekapitulasi folio per outlet, akumulasi pajak & servis 21%, bukti bayar',
      tools: ['POS.getRoomTransactions()', 'PMS.getFolioBalance()', 'Billing.generateItemizedReceipt()'],
      metrics: {
        avgResponseTime: '0.6s',
        queriesHandled: 96,
        autonomousRate: '91.8%',
      },
    },
  ];

  const activeAgent = agentsData.find((a) => a.id === selectedAgentCard) || agentsData[0];

  return (
    <div className="space-y-8">
      {/* Header Overview */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-amber-400 uppercase tracking-widest">
                Bagian 6 & 8 Riset Kelompok 5
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-400">Arsitektur Multi-Agent Hotel</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Rencana & Diagram Arsitektur Sistem Terdistribusi
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
              Memecah kompleksitas layanan hotel bintang lima menjadi agen-agen spesialis yang terkoordinasi
              melalui Orchestrator cerdas, didukung gatekeeper Machine Learning (Logistic Regression) untuk
              menentukan eskalasi ke staf manusia.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-slate-950 border border-slate-800 px-4 py-2 rounded-lg text-right">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                Total Komponen Agen
              </span>
              <span className="text-sm font-bold text-amber-400 font-mono">
                1 Orchestrator + 4 Spesialis + 1 FO Desk
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Multi-Layer Architecture Map (Matching Page 6 Diagram) */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        {/* Layer 1: Antarmuka Pengguna & Saluran Komunikasi */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              Lapisan 1: Antarmuka Pengguna & Saluran Komunikasi
            </span>
            <span className="text-[11px] text-slate-500 font-mono">Omnichannel Touchpoints</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pelanggan Box */}
            <div className="bg-slate-900 border border-slate-800/80 rounded-xl p-4">
              <div className="flex items-center gap-2 text-slate-200 font-semibold text-xs mb-2">
                <Users className="w-4 h-4 text-amber-400" />
                <span>Tamu / Pelanggan Hotel</span>
              </div>
              <p className="text-[11px] text-slate-400 mb-3">
                Mengakses layanan melalui kanal seluler pribadi atau perangkat di kamar:
              </p>
              <div className="flex gap-2">
                <div className="flex-1 bg-slate-950 border border-slate-800 p-2 rounded-lg text-center">
                  <Smartphone className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                  <span className="text-[11px] text-slate-300 block font-medium">Smartphone</span>
                  <span className="text-[10px] text-slate-500">WhatsApp / Web</span>
                </div>
                <div className="flex-1 bg-slate-950 border border-slate-800 p-2 rounded-lg text-center">
                  <Tablet className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                  <span className="text-[11px] text-slate-300 block font-medium">In-Room Tablet</span>
                  <span className="text-[10px] text-slate-500">Suite Display</span>
                </div>
              </div>
            </div>

            {/* Staf Hotel Box */}
            <div className="bg-slate-900 border border-slate-800/80 rounded-xl p-4">
              <div className="flex items-center gap-2 text-slate-200 font-semibold text-xs mb-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>Staf & Front Office Hotel</span>
              </div>
              <p className="text-[11px] text-slate-400 mb-3">
                Menerima tiket eskalasi kasus berisiko tinggi atau intervensi langsung:
              </p>
              <div className="flex gap-2">
                <div className="flex-1 bg-slate-950 border border-slate-800 p-2 rounded-lg text-center">
                  <Tablet className="w-4 h-4 text-indigo-400 mx-auto mb-1" />
                  <span className="text-[11px] text-slate-300 block font-medium">Tablet Staf</span>
                  <span className="text-[10px] text-slate-500">Runner Mobile</span>
                </div>
                <div className="flex-1 bg-slate-950 border border-slate-800 p-2 rounded-lg text-center">
                  <Monitor className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
                  <span className="text-[11px] text-slate-300 block font-medium">Desktop FO</span>
                  <span className="text-[10px] text-slate-500">Front Desk & PMS</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Downward Connection */}
        <div className="flex justify-center my-4">
          <div className="w-px h-6 bg-gradient-to-b from-blue-500 to-amber-500"></div>
        </div>

        {/* Layer 2: Orkestrator Multiagent & Lapisan Komunikasi */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border-2 border-amber-500/40 rounded-xl p-5 shadow-lg relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-xs">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-wide">
                  ORKESTRATOR MULTIAGENT & LAPISAN KOMUNIKASI
                </h3>
                <p className="text-[11px] text-slate-400">
                  Manages Message Routing, NLP Intent Understanding, dan ML Gatekeeper Evaluator
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
              <span className="text-slate-400">Decision Model:</span>
              <span className="text-amber-300 font-bold">Logistic Regression (tau=0.80)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
              <span className="text-[10px] text-amber-400 font-mono uppercase block mb-1">
                Fungsi 1: Feature Extraction
              </span>
              <p className="text-slate-300 text-[11px]">
                Mengekstrak niat (intent), nilai kompleksitas (x1), dan tingkat risiko (x2) dari pesan natural language.
              </p>
            </div>
            <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
              <span className="text-[10px] text-amber-400 font-mono uppercase block mb-1">
                Fungsi 2: Probabilitas Human
              </span>
              <p className="text-slate-300 text-[11px]">
                Menghitung z = w1*x1 + w2*x2 + b dan Sigmoid P(Human|x) untuk mencegah bot salah jawab / berhalusinasi.
              </p>
            </div>
            <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
              <span className="text-[10px] text-amber-400 font-mono uppercase block mb-1">
                Fungsi 3: Dynamic Dispatch
              </span>
              <p className="text-slate-300 text-[11px]">
                Meneruskan pesan ke agen spesialis yang tepat atau langsung menerbitkan tiket eskalasi ke Front Office.
              </p>
            </div>
          </div>
        </div>

        {/* Downward Forking Connection */}
        <div className="flex justify-center my-4">
          <div className="w-px h-6 bg-gradient-to-b from-amber-500 to-cyan-500"></div>
        </div>

        {/* Layer 3: Specialized Agents Grid (The 4 Core Agents + Escalation Desk) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              Lapisan 3: Specialized Agents (Agen Spesialisasi Operasional)
            </span>
            <span className="text-[11px] text-slate-500 font-mono">Domain Decomposition</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {agentsData.map((agent) => {
              const Icon = agent.icon;
              const isSelected = selectedAgentCard === agent.id;

              return (
                <div
                  key={agent.id}
                  onClick={() => setSelectedAgentCard(agent.id)}
                  className={`bg-slate-900 border rounded-xl p-4 cursor-pointer transition-all hover:translate-y-[-2px] ${
                    isSelected
                      ? 'border-amber-400 ring-2 ring-amber-400/20 shadow-xl'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-amber-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
                      Aktif 24/7
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white mb-0.5">{agent.name}</h4>
                  <p className="text-[11px] text-slate-400 mb-2.5 line-clamp-2">{agent.title}</p>

                  <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 space-y-1 font-mono">
                    <div className="truncate">Sistem: {agent.system.split('&')[0]}</div>
                    <div>Latensi: {agent.metrics.avgResponseTime}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Downward Connection */}
        <div className="flex justify-center my-4">
          <div className="w-px h-6 bg-gradient-to-b from-cyan-500 to-indigo-500"></div>
        </div>

        {/* Layer 4: Sistem Pendukung & Data Operasional (Hotel Back-End Systems) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
              Lapisan 4: Sistem Pendukung & Data Operasional (Hotel Back-End Systems)
            </span>
            <span className="text-[11px] text-slate-500 font-mono">Real-Time Hotel APIs</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
              <div className="flex items-center gap-2 text-blue-400 font-semibold mb-1 text-xs">
                <Database className="w-3.5 h-3.5" />
                <span>Property Management (PMS)</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Ketersediaan kamar real-time, reservasi, check-in/out, folio balance.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
              <div className="flex items-center gap-2 text-amber-400 font-semibold mb-1 text-xs">
                <MapPin className="w-3.5 h-3.5" />
                <span>Local Knowledge Base</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Direktori fasilitas hotel, panduan kuliner, wisata lokal, jam operasional.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-1 text-xs">
                <Building className="w-3.5 h-3.5" />
                <span>Facility Management</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Sistem housekeeping ticketing, status pembersihan kamar, dispatch staf runner.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
              <div className="flex items-center gap-2 text-purple-400 font-semibold mb-1 text-xs">
                <Receipt className="w-3.5 h-3.5" />
                <span>Point of Sale (POS)</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Database tagihan restoran, lounge, spa, room service, dan pajak/servis.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Agent Deep Dive Inspector */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <activeAgent.icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                {activeAgent.name}
                <span className="text-xs font-normal text-slate-400">({activeAgent.title})</span>
              </h3>
              <p className="text-xs text-amber-400/90 font-mono">
                Integrasi Utama: {activeAgent.system}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-slate-400">Tingkat Otonom:</span>
            <span className="text-emerald-400 font-bold">{activeAgent.metrics.autonomousRate}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-3">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                Tanggung Jawab Domain Spesifik:
              </span>
              <p className="text-slate-200 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-850">
                {activeAgent.responsibility}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-850">
                <span className="text-[10px] text-slate-500 block">Input Khas:</span>
                <span className="text-slate-300 text-[11px] block mt-0.5">{activeAgent.inputs}</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-850">
                <span className="text-[10px] text-slate-500 block">Output Dihasilkan:</span>
                <span className="text-slate-300 text-[11px] block mt-0.5">{activeAgent.outputs}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                Tools & API Operasional yang Diberikan Kuasa (Authorized Tools):
              </span>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 space-y-1.5 font-mono text-[11px]">
                {activeAgent.tools.map((t, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-amber-300">
                    <span className="text-slate-600">•</span>
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono">Total Query Terselesaikan:</span>
              <span className="text-amber-400 font-bold font-mono text-sm">
                {activeAgent.metrics.queriesHandled} requests
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
