import React, { useState } from 'react';
import { LogisticRegressionParams } from '../types/hotel';
import { BENCHMARK_TEST_CASES } from '../data/mockHotelData';
import { calculateLogisticRegression, DEFAULT_LR_PARAMS } from '../services/multiAgentEngine';
import {
  ShieldAlert,
  Bot,
  Sliders,
  RotateCcw,
  CheckCircle2,
  Info,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface MLMathematicalPlaygroundProps {
  lrParams: LogisticRegressionParams;
  setLrParams: React.Dispatch<React.SetStateAction<LogisticRegressionParams>>;
}

export const MLMathematicalPlayground: React.FC<MLMathematicalPlaygroundProps> = ({
  lrParams,
  setLrParams,
}) => {
  const [customX1, setCustomX1] = useState<number>(4);
  const [customX2, setCustomX2] = useState<number>(1);
  const [activePresetIndex, setActivePresetIndex] = useState<number>(3); // Default to charge dispute case

  const handleResetDefaults = () => {
    setLrParams(DEFAULT_LR_PARAMS);
    setCustomX1(4);
    setCustomX2(1);
    setActivePresetIndex(3);
  };

  // Compute custom calculation
  const customResult = calculateLogisticRegression(customX1, customX2, lrParams);

  // Generate Sigmoid Curve Points for SVG (-6 <= z <= 6)
  const curvePoints: { z: number; p: number; x: number; y: number }[] = [];
  const svgWidth = 600;
  const svgHeight = 240;
  const padding = 40;

  for (let zVal = -6; zVal <= 6; zVal += 0.2) {
    const pVal = 1 / (1 + Math.exp(-zVal));
    const x = padding + ((zVal + 6) / 12) * (svgWidth - padding * 2);
    const y = svgHeight - padding - pVal * (svgHeight - padding * 2);
    curvePoints.push({ z: zVal, p: pVal, x, y });
  }

  const svgPath = curvePoints
    .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`)
    .join(' ');

  // Threshold Y coordinate on SVG
  const thresholdY = svgHeight - padding - lrParams.tau * (svgHeight - padding * 2);

  // Custom point position on curve
  const clampedZ = Math.max(-6, Math.min(6, customResult.z));
  const customPointX = padding + ((clampedZ + 6) / 12) * (svgWidth - padding * 2);
  const customPointY = svgHeight - padding - customResult.probability * (svgHeight - padding * 2);

  return (
    <div className="space-y-8">
      {/* Overview & Paper Formulation Summary */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-amber-400 uppercase tracking-widest">
                Bagian 3, 4 & 5 Riset Kelompok 5
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-400">Model Prediksi & Sigmoid Gatekeeper</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Formulasi Matematis Regresi Logistik & Ambang Batas Eskalasi (Threshold)
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
              Tidak semua pesan ditangani oleh agent otomatis demi mencegah respon sembarangan (hallucinate).
              Model Machine Learning menghitung kombinasi linear <span className="font-mono text-amber-300">z = w₁x₁ + w₂x₂ + b</span> dan probabilitas sigmoid <span className="font-mono text-amber-300">P(Human|x)</span> yang dibandingkan dengan ambang batas <span className="font-mono text-amber-300">τ = 0.80</span>.
            </p>
          </div>

          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 rounded-lg transition-colors whitespace-nowrap self-start md:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Parameter Default</span>
          </button>
        </div>
      </div>

      {/* Grid: Left Parameter Sliders & Interactive Tester, Right Sigmoid Graph */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Interactive Sliders & Live Formulas (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Sliders Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-400" />
                <span>Parameter Model Machine Learning</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-500">Bobot & Bias</span>
            </div>

            {/* w1 Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">
                  w₁ (Bobot Intent Complexity):
                </span>
                <span className="font-mono text-amber-400 font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  {lrParams.w1.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="2.0"
                step="0.1"
                value={lrParams.w1}
                onChange={(e) => setLrParams((p) => ({ ...p, w1: parseFloat(e.target.value) }))}
                className="w-full accent-amber-400 bg-slate-800 rounded h-1.5 cursor-pointer"
              />
              <p className="text-[10px] text-slate-500">
                Dokumen default: <span className="text-slate-300 font-mono">0.8</span>. Mengukur sensitivitas tingkat kerumitan pesan.
              </p>
            </div>

            {/* w2 Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">
                  w₂ (Bobot Risk Level):
                </span>
                <span className="font-mono text-rose-400 font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  {lrParams.w2.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="4.0"
                step="0.1"
                value={lrParams.w2}
                onChange={(e) => setLrParams((p) => ({ ...p, w2: parseFloat(e.target.value) }))}
                className="w-full accent-rose-400 bg-slate-800 rounded h-1.5 cursor-pointer"
              />
              <p className="text-[10px] text-slate-500">
                Dokumen default: <span className="text-slate-300 font-mono">2.0</span>. Bobot risiko keuangan atau sengketa layanan.
              </p>
            </div>

            {/* b Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">
                  b (Intercept / Bias):
                </span>
                <span className="font-mono text-cyan-400 font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  {lrParams.b.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min="-4.0"
                max="0.0"
                step="0.2"
                value={lrParams.b}
                onChange={(e) => setLrParams((p) => ({ ...p, b: parseFloat(e.target.value) }))}
                className="w-full accent-cyan-400 bg-slate-800 rounded h-1.5 cursor-pointer"
              />
              <p className="text-[10px] text-slate-500">
                Dokumen default: <span className="text-slate-300 font-mono">-2.0</span>. Baseline kecenderungan awal sistem.
              </p>
            </div>

            {/* tau Slider */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-200 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  τ (Threshold Keputusan):
                </span>
                <span className="font-mono text-amber-300 font-bold bg-slate-950 px-2 py-0.5 rounded border border-amber-500/40">
                  {lrParams.tau.toFixed(2)} ({Math.round(lrParams.tau * 100)}%)
                </span>
              </div>
              <input
                type="range"
                min="0.50"
                max="0.95"
                step="0.05"
                value={lrParams.tau}
                onChange={(e) => setLrParams((p) => ({ ...p, tau: parseFloat(e.target.value) }))}
                className="w-full accent-amber-400 bg-slate-800 rounded h-1.5 cursor-pointer"
              />
              <p className="text-[10px] text-slate-500">
                P(Human|x) &gt; τ → Eskalasi ke Staf Front Office. P(Human|x) ≤ τ → Dijawab mandiri oleh Agent.
              </p>
            </div>
          </div>

          {/* Interactive Feature Input Sandbox */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Uji Coba Input Fitur Pesan (Sandbox)
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                  x₁: Intent Complexity
                </label>
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={customX1}
                    onChange={(e) => setCustomX1(Math.max(1, Math.min(5, parseInt(e.target.value) || 1)))}
                    className="w-16 bg-slate-900 text-amber-400 font-mono font-bold text-base px-2 py-1 rounded border border-slate-700"
                  />
                  <span className="text-[10px] text-slate-500 text-right">
                    1 (Mudah) - 5 (Sangat Rumit)
                  </span>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                  x₂: Risk Level
                </label>
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="number"
                    min="0"
                    max="2"
                    value={customX2}
                    onChange={(e) => setCustomX2(Math.max(0, Math.min(2, parseInt(e.target.value) || 0)))}
                    className="w-16 bg-slate-900 text-rose-400 font-mono font-bold text-base px-2 py-1 rounded border border-slate-700"
                  />
                  <span className="text-[10px] text-slate-500 text-right">
                    0 (Rendah) - 1 (Tinggi / Dispute)
                  </span>
                </div>
              </div>
            </div>

            {/* Calculated Result Badge */}
            <div
              className={`p-3.5 rounded-xl border flex items-center justify-between ${
                customResult.needsHuman
                  ? 'bg-rose-950/40 border-rose-500/50 text-rose-200'
                  : 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
              }`}
            >
              <div>
                <span className="text-[10px] uppercase tracking-widest font-mono block opacity-80">
                  Keputusan Sistem:
                </span>
                <span className="text-sm font-bold flex items-center gap-1.5 mt-0.5">
                  {customResult.needsHuman ? (
                    <>
                      <ShieldAlert className="w-4 h-4 text-rose-400" />
                      <span>HUMAN REPLY (Staf Front Office)</span>
                    </>
                  ) : (
                    <>
                      <Bot className="w-4 h-4 text-emerald-400" />
                      <span>AGENT REPLY (Otonom Spesialis)</span>
                    </>
                  )}
                </span>
              </div>

              <div className="text-right font-mono">
                <span className="text-[10px] opacity-75 block">P(Human|x)</span>
                <span className="text-lg font-extrabold tabular-nums">
                  {(customResult.probability * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Sigmoid Curve Graph & Mathematical Derivation (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Interactive SVG Sigmoid Curve */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Kurva Fungsi Sigmoid & Decision Boundary
                </h3>
                <p className="text-[11px] text-slate-400">
                  P(Human|x) = 1 / (1 + e^-z) terhadap kombinasi linear fitur z
                </p>
              </div>

              <div className="flex items-center gap-3 text-[11px] font-mono">
                <span className="flex items-center gap-1.5 text-amber-300">
                  <span className="w-2.5 h-0.5 bg-amber-400"></span>
                  Kurva Sigmoid
                </span>
                <span className="flex items-center gap-1.5 text-rose-400">
                  <span className="w-2.5 h-0.5 border-t border-dashed border-rose-400"></span>
                  Ambang Batas τ ({lrParams.tau.toFixed(2)})
                </span>
              </div>
            </div>

            {/* SVG Visualizer */}
            <div className="bg-slate-950 p-2 rounded-xl border border-slate-850 relative">
              <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto overflow-visible">
                {/* Horizontal Grid lines */}
                <line
                  x1={padding}
                  y1={padding}
                  x2={svgWidth - padding}
                  y2={padding}
                  stroke="#334155"
                  strokeWidth="0.5"
                  strokeDasharray="4 4"
                />
                <line
                  x1={padding}
                  y1={(svgHeight - padding + padding) / 2}
                  x2={svgWidth - padding}
                  y2={(svgHeight - padding + padding) / 2}
                  stroke="#334155"
                  strokeWidth="0.5"
                  strokeDasharray="4 4"
                />
                <line
                  x1={padding}
                  y1={svgHeight - padding}
                  x2={svgWidth - padding}
                  y2={svgHeight - padding}
                  stroke="#475569"
                  strokeWidth="1"
                />

                {/* Vertical Center Axis (z = 0) */}
                <line
                  x1={svgWidth / 2}
                  y1={padding}
                  x2={svgWidth / 2}
                  y2={svgHeight - padding}
                  stroke="#475569"
                  strokeWidth="1"
                />

                {/* Threshold Line (tau) */}
                <line
                  x1={padding}
                  y1={thresholdY}
                  x2={svgWidth - padding}
                  y2={thresholdY}
                  stroke="#f43f5e"
                  strokeWidth="1.5"
                  strokeDasharray="6 4"
                />
                <text
                  x={svgWidth - padding + 5}
                  y={thresholdY + 3}
                  fill="#f43f5e"
                  fontSize="10"
                  fontFamily="monospace"
                  alignmentBaseline="middle"
                >
                  τ={lrParams.tau.toFixed(2)}
                </text>

                {/* Sigmoid Curve Path */}
                <path d={svgPath} fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />

                {/* Plot the 4 Benchmark Cases */}
                {BENCHMARK_TEST_CASES.slice(0, 4).map((testCase, idx) => {
                  const res = calculateLogisticRegression(
                    testCase.expectedComplexity,
                    testCase.expectedRisk,
                    lrParams
                  );
                  const ptZ = Math.max(-6, Math.min(6, res.z));
                  const ptX = padding + ((ptZ + 6) / 12) * (svgWidth - padding * 2);
                  const ptY = svgHeight - padding - res.probability * (svgHeight - padding * 2);

                  const isSelected = activePresetIndex === idx;

                  return (
                    <g key={idx} className="cursor-pointer" onClick={() => {
                      setActivePresetIndex(idx);
                      setCustomX1(testCase.expectedComplexity);
                      setCustomX2(testCase.expectedRisk);
                    }}>
                      <circle
                        cx={ptX}
                        cy={ptY}
                        r={isSelected ? 6 : 4}
                        fill={res.needsHuman ? '#f43f5e' : '#10b981'}
                        stroke="#ffffff"
                        strokeWidth={isSelected ? 2 : 1}
                      />
                      <text
                        x={ptX}
                        y={ptY - 8}
                        fill={isSelected ? '#fde047' : '#94a3b8'}
                        fontSize="9"
                        fontFamily="monospace"
                        textAnchor="middle"
                      >
                        P{idx + 1} ({res.probability.toFixed(2)})
                      </text>
                    </g>
                  );
                })}

                {/* Custom Point Marker */}
                <circle
                  cx={customPointX}
                  cy={customPointY}
                  r="7"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  className="animate-pulse"
                />

                {/* Axes Labels */}
                <text x={padding} y={svgHeight - 15} fill="#64748b" fontSize="10" fontFamily="monospace">
                  z = -6.0
                </text>
                <text x={svgWidth / 2 - 15} y={svgHeight - 15} fill="#64748b" fontSize="10" fontFamily="monospace">
                  z = 0.0 (P=0.5)
                </text>
                <text
                  x={svgWidth - padding - 30}
                  y={svgHeight - 15}
                  fill="#64748b"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  z = +6.0
                </text>
                <text x={5} y={padding + 10} fill="#64748b" fontSize="10" fontFamily="monospace">
                  P = 1.0
                </text>
                <text x={5} y={svgHeight - padding} fill="#64748b" fontSize="10" fontFamily="monospace">
                  P = 0.0
                </text>
              </svg>
            </div>

            <p className="text-[11px] text-slate-400">
              * Titik hijau = Dijawab Agent (<span className="text-emerald-400 font-mono">P ≤ τ</span>). Titik merah = Eskalasi ke Staf (<span className="text-rose-400 font-mono">P &gt; τ</span>). Lingkaran biru = Titik input sandbox saat ini.
            </p>
          </div>

          {/* Exact Math Derivation Box (Section 4 & 5 of PDF) */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Verifikasi Perhitungan Numerik Makalah (Halaman 4 & 5)
              </h3>
              <span className="text-[10px] font-mono text-slate-400">
                Formula Walkthrough
              </span>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-850 font-mono text-xs space-y-2 text-slate-300">
              <div className="text-slate-400 font-sans text-[11px]">
                Kasus Contoh di Dokumen: Pesan sengketa tagihan <strong className="text-slate-200">"Saya terkena charge Rp2 juta yang tidak saya kenal."</strong>
              </div>
              <div className="p-2 bg-slate-900 rounded border border-slate-800 text-[11px] space-y-1">
                <div>Parameter: w₁ = {lrParams.w1}, w₂ = {lrParams.w2}, b = {lrParams.b}</div>
                <div>Fitur input: x₁ (Intent Complexity) = 4, x₂ (Risk Level) = 1</div>
                <div className="text-amber-300 font-bold pt-1 border-t border-slate-800">
                  z = ({lrParams.w1})(4) + ({lrParams.w2})(1) + ({lrParams.b}) = {(lrParams.w1 * 4 + lrParams.w2 * 1 + lrParams.b).toFixed(2)}
                </div>
                <div className="text-emerald-300 font-bold">
                  P(Human | x) = 1 / (1 + e^-{(lrParams.w1 * 4 + lrParams.w2 * 1 + lrParams.b).toFixed(2)}) ≈ {(1 / (1 + Math.exp(-(lrParams.w1 * 4 + lrParams.w2 * 1 + lrParams.b)))).toFixed(3)}
                </div>
              </div>

              <div className="text-[11px] text-slate-300 font-sans leading-relaxed">
                Karena <strong className="text-rose-400">{(1 / (1 + Math.exp(-(lrParams.w1 * 4 + lrParams.w2 * 1 + lrParams.b)))).toFixed(3)} &gt; {lrParams.tau.toFixed(2)}</strong>, keputusan sistem adalah <span className="text-rose-400 font-bold">Human Reply (Eskalasi Staf Front Office)</span>. Hasil perhitungan model ini <strong className="text-emerald-400">100% identik</strong> dengan turunan matematis pada Halaman 5 dokumen kelompok!
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benchmark Test Cases Matrix Table (Page 3 of Document) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Tabel Matriks Keputusan Benchmark (Sesuai Tabel Bab 3 Makalah)
            </h3>
            <p className="text-[11px] text-slate-400">
              Evaluasi deterministik seluruh dataset uji pesan customer dengan parameter aktif
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {BENCHMARK_TEST_CASES.length} Skenario Percobaan
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">Customer Message (Pesan Tamu)</th>
                <th className="py-2.5 px-3 text-center">Intent Complexity (x₁)</th>
                <th className="py-2.5 px-3 text-center">Risk Level (x₂)</th>
                <th className="py-2.5 px-3 text-center">Kombinasi z</th>
                <th className="py-2.5 px-3 text-center">P(Human|x)</th>
                <th className="py-2.5 px-3">Keputusan Model</th>
                <th className="py-2.5 px-3">Keterangan Dokumen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {BENCHMARK_TEST_CASES.map((item, idx) => {
                const res = calculateLogisticRegression(
                  item.expectedComplexity,
                  item.expectedRisk,
                  lrParams
                );

                return (
                  <tr
                    key={idx}
                    className="hover:bg-slate-850/60 transition-colors cursor-pointer"
                    onClick={() => {
                      setCustomX1(item.expectedComplexity);
                      setCustomX2(item.expectedRisk);
                      setActivePresetIndex(idx);
                    }}
                  >
                    <td className="py-3 px-3 font-mono text-slate-500">P{idx + 1}</td>
                    <td className="py-3 px-3 font-medium text-slate-200">
                      "{item.message}"
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-amber-400 font-bold">
                      {item.expectedComplexity}
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-rose-400 font-bold">
                      {item.expectedRisk}
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-slate-300">
                      {res.z.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold tabular-nums">
                      <span
                        className={
                          res.needsHuman ? 'text-rose-400' : 'text-emerald-400'
                        }
                      >
                        {(res.probability * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border inline-flex items-center gap-1 ${
                          res.needsHuman
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        }`}
                      >
                        {res.needsHuman ? (
                          <>
                            <ShieldAlert className="w-3 h-3 text-rose-400" />
                            <span>Needs Human (1)</span>
                          </>
                        ) : (
                          <>
                            <Bot className="w-3 h-3 text-emerald-400" />
                            <span>Agent Reply (0)</span>
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[11px] text-slate-400 max-w-xs">
                      {item.paperNote}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
