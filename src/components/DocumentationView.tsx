import React from 'react';
import {
  Users,
  BookOpen,
  Award,
  Layers,
  FileCheck2,
  TrendingUp,
  Brain,
  Sparkles,
} from 'lucide-react';

export const DocumentationView: React.FC = () => {
  const teamMembers = [
    {
      name: 'M. Al lail Qadrillah',
      role: 'Perumusan Problem, Arsitektur Sistem & ML Integration',
    },
    {
      name: 'Dimas Prabowo',
      role: 'Desain Multi-Agent, Evaluasi Komputasi & Studi Literatur',
    },
    {
      name: 'Monanta Alfiareza',
      role: 'Implementasi Metode AI/ML/DL & Formulasi Matematis Sigmoid',
    },
    {
      name: 'Frans Alwan',
      role: 'Integrasi Sistem Hotel (PMS/POS/Housekeeping) & Evaluasi Layanan',
    },
  ];

  const literatureStudies = [
    {
      citation: 'Wang et al. (2025)',
      title: 'Artificial Intelligence in Tourism: A Systematic Literature Review and Future Research Agenda',
      scope: 'Analisis komprehensif 177 artikel jurnal ilmiah.',
      insight:
        'Mengonfirmasi bahwa AI konversasional dan GenAI kini menjadi inti layanan pelanggan di sektor pariwisata. AI terbukti mampu mengotomasi tugas repetitif dan menyediakan layanan 24 jam dengan integrasi mendalam ke sistem operasional.',
    },
    {
      citation: 'Bibliometric-Systematic Review (2026)',
      title: 'Conversational AI in Hospitality and Tourism: A Bibliometric-Systematic Review',
      scope: '71 artikel jurnal internasional periode 2010–2025.',
      insight:
        'Memetakan perjalanan tamu mulai dari pencarian awal, booking kamar, layanan concierge personalisasi, hingga pemulihan layanan darurat (service recovery) dengan arsitektur multi-agent cerdas.',
    },
    {
      citation: 'Laporan Riset Industri (Conduit, 2026)',
      title: 'Operational Impact of Connected Autonomous Multi-Agent Hotel Systems',
      scope: 'Survei efisiensi hotel modern & jaringan perhotelan internasional.',
      insight:
        'Mencatat peningkatan tingkat penyelesaian query (query completion rate) dari 90,6% menjadi 95,5% ketika agen chatbot hotel terhubung langsung ke sistem operasional (CRS, CRM, Housekeeping, dan POS) dibanding hanya berfungsi sebagai FAQ statis.',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Banner with Generated Luxury Hotel Asset */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-950">
          <img
            src="/src/assets/images/hotel_grand_lobby_1790619235735.jpg"
            alt="Grand Horizon Luxury Hotel Lobby"
            className="w-full h-full object-cover object-center brightness-75 scale-105 transition-transform duration-1000"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>

          <div className="absolute bottom-6 left-6 right-6">
            <span className="text-[11px] font-mono text-amber-400 uppercase tracking-widest bg-amber-950/80 border border-amber-800/80 px-2.5 py-1 rounded">
              Laporan Ilmiah & Spesifikasi Proyek Sistem
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 tracking-tight">
              Multi-Agent Intelligent Customer Service Hotel
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Disusun oleh Kelompok 5 untuk membedah rancangan arsitektur multi-agent terdistribusi,
              integrasi data operasional hotel (PMS/POS), serta mitigasi risiko halusinasi melalui model
              Regresi Logistik.
            </p>
          </div>
        </div>
      </div>

      {/* Group 5 Team Matrix */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                1. Peran Anggota Tim (Kelompok 5) & Matriks Tanggung Jawab
              </h3>
              <p className="text-xs text-slate-400">
                Kolaborasi intensif perancangan arsitektur cerdas dan implementasi model matematika
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-amber-400 font-bold bg-amber-950/60 border border-amber-800/60 px-2.5 py-1 rounded">
            Kelompok 5
          </span>
        </div>

        {/* Member Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {teamMembers.map((member, idx) => (
            <div
              key={idx}
              className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2 hover:border-slate-700 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs font-mono">
                0{idx + 1}
              </div>
              <h4 className="text-xs font-bold text-white">{member.name}</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">{member.role}</p>
            </div>
          ))}
        </div>

        {/* Matrix Table (Page 2 of PDF) */}
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="py-2.5 px-3">Tugas / Tanggung Jawab</th>
                <th className="py-2.5 px-3 text-center">M. Al lail Qadrillah</th>
                <th className="py-2.5 px-3 text-center">Dimas Prabowo</th>
                <th className="py-2.5 px-3 text-center">Monanta Alfiareza</th>
                <th className="py-2.5 px-3 text-center">Frans Alwan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {[
                'Perumusan problem & studi literatur',
                'Ilustrasi data & perhitungan komputasi',
                'Desain arsitektur multi-agent & diagram sistem',
                'Implementasi metode AI/ML/DL',
              ].map((task, idx) => (
                <tr key={idx} className="hover:bg-slate-850/60 transition-colors">
                  <td className="py-2.5 px-3 font-medium text-slate-200">{task}</td>
                  <td className="py-2.5 px-3 text-center text-emerald-400 font-bold">✓</td>
                  <td className="py-2.5 px-3 text-center text-emerald-400 font-bold">✓</td>
                  <td className="py-2.5 px-3 text-center text-emerald-400 font-bold">✓</td>
                  <td className="py-2.5 px-3 text-center text-emerald-400 font-bold">✓</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Problem & Solution Synthesis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            <span>2. Deskripsi Problem Perhotelan</span>
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Layanan hotel menghadapi spektrum permintaan yang sangat luas: reservasi & perubahan booking,
            informasi/rekomendasi wisata lokal (concierge), keluhan kerusakan kamar (housekeeping/maintenance),
            rincian tagihan (billing), hingga kasus sengketa yang membutuhkan kebijakan staf front office.
          </p>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 text-xs text-slate-400 space-y-1.5">
            <strong className="text-slate-200 block">Keterbatasan Chatbot Tunggal Generik:</strong>
            <p>
              Chatbot tunggal kesulitan menangani beragam sistem backend karena tiap domain butuh integrasi
              khusus: reservasi butuh PMS, concierge butuh knowledge base lokal, dan billing butuh POS.
            </p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            <span>Dampak & Output yang Diharapkan</span>
          </h3>
          <div className="space-y-3 text-xs">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-850">
              <span className="text-emerald-400 font-semibold block mb-0.5">Dampak ke Tamu:</span>
              <p className="text-slate-300">
                Waktu tunggu respons jauh lebih singkat (layanan 24/7), akurasi informasi reservasi dan tagihan meningkat,
                serta kepuasan tamu melonjak karena dilayani oleh agen spesialis yang tepat.
              </p>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-850">
              <span className="text-blue-400 font-semibold block mb-0.5">Dampak ke Operasional Hotel:</span>
              <p className="text-slate-300">
                Beban kerja repetitif pada staf front office berkurang (khususnya shift malam), koordinasi antar-departemen
                lebih efisien, dan risiko kesalahan data billing/reservasi dapat ditekan secara signifikan.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Scientific Literature References (Section 5 & 7 of PDF) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-cyan-400" />
            <span>Penelitian Terkait & Dasar Ilmiah Sistem</span>
          </h3>
          <span className="text-[11px] font-mono text-slate-400">Literature Citations</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {literatureStudies.map((lit, idx) => (
            <div
              key={idx}
              className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <span className="text-amber-400 font-mono text-xs font-bold block">
                  {lit.citation}
                </span>
                <h4 className="text-xs font-bold text-white leading-snug">{lit.title}</h4>
                <p className="text-[11px] text-slate-400 italic">{lit.scope}</p>
              </div>

              <div className="pt-2 border-t border-slate-850 text-xs text-slate-300 leading-relaxed">
                {lit.insight}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
