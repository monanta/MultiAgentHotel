import React, { useState } from 'react';
import { CognitiveCycle, LogisticRegressionResult, ExtractionFeatures } from '../types/hotel';
import {
  Brain,
  Target,
  Compass,
  Eye,
  GitFork,
  ListOrdered,
  Wrench,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Cpu,
  Layers,
} from 'lucide-react';

interface CognitiveCycleInspectorProps {
  cycle: CognitiveCycle | null;
  features: ExtractionFeatures | null;
  mlResult: LogisticRegressionResult | null;
  agentName: string;
  agentDomain: string;
}

export const CognitiveCycleInspector: React.FC<CognitiveCycleInspectorProps> = ({
  cycle,
  features,
  mlResult,
  agentName,
  agentDomain,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeStepTab, setActiveStepTab] = useState<'all' | 'cycle' | 'tools' | 'ml'>('all');

  if (!cycle) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 text-center">
        <Brain className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
        <h4 className="text-sm font-semibold text-slate-300">Komponen Internal Agen Belum Aktif</h4>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Kirimkan pesan dari tamu di sebelah kiri atau pilih salah satu benchmark prompt untuk menyaksikan
          siklus internal kognitif agen: <span className="text-amber-400 font-mono text-[11px]">Perceive → Reason → Plan → Act → Learn</span>.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
      {/* Header */}
      <div className="bg-slate-850 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
                Siklus Kognitif Internal Agen
              </h3>
              <span className="text-[11px] text-amber-400 font-medium">({agentName})</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Domain Operasional: <span className="text-slate-200">{agentDomain}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[11px]">
            <button
              onClick={() => setActiveStepTab('all')}
              className={`px-2 py-0.5 rounded ${activeStepTab === 'all' ? 'bg-amber-500/20 text-amber-300 font-medium' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Semua Siklus
            </button>
            <button
              onClick={() => setActiveStepTab('cycle')}
              className={`px-2 py-0.5 rounded ${activeStepTab === 'cycle' ? 'bg-amber-500/20 text-amber-300 font-medium' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Reasoning & Plan
            </button>
            <button
              onClick={() => setActiveStepTab('tools')}
              className={`px-2 py-0.5 rounded ${activeStepTab === 'tools' ? 'bg-amber-500/20 text-amber-300 font-medium' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Action/Tools ({cycle.actions.length})
            </button>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-slate-400 hover:text-slate-200 rounded transition-colors"
            title={isExpanded ? 'Tutup Detail' : 'Buka Detail'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Quick Flow Indicator (Section 9 PDF) */}
          <div className="bg-slate-950/80 rounded-lg p-3 border border-slate-800/80">
            <div className="flex items-center justify-between text-[10px] text-slate-500 uppercase tracking-widest font-mono mb-2">
              <span>Siklus Kognitif BDI (Perceive → Understand → Reason → Plan → Act → Learn)</span>
              <span className="text-emerald-400 font-semibold">Tereksekusi</span>
            </div>
            <div className="grid grid-cols-6 gap-1 text-center font-mono text-[11px]">
              <div className="bg-slate-900 border border-slate-800 py-1 px-1 rounded text-slate-300">
                1. Perceive
              </div>
              <div className="bg-slate-900 border border-slate-800 py-1 px-1 rounded text-slate-300">
                2. Understand
              </div>
              <div className="bg-slate-900 border border-slate-800 py-1 px-1 rounded text-amber-300 border-amber-500/40">
                3. Reason
              </div>
              <div className="bg-slate-900 border border-slate-800 py-1 px-1 rounded text-amber-300 border-amber-500/40">
                4. Plan
              </div>
              <div className="bg-slate-900 border border-slate-800 py-1 px-1 rounded text-cyan-300 border-cyan-500/40">
                5. Act
              </div>
              <div className="bg-slate-900 border border-slate-800 py-1 px-1 rounded text-emerald-300 border-emerald-500/40">
                6. Learn
              </div>
            </div>
          </div>

          {/* 8 Components Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {/* 1. GOAL */}
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3">
              <div className="flex items-center gap-1.5 text-amber-400 font-semibold mb-1">
                <Target className="w-3.5 h-3.5" />
                <span>1. Goal (Tujuan Agen)</span>
              </div>
              <p className="text-slate-300 leading-relaxed">{cycle.goal}</p>
            </div>

            {/* 2. BELIEF / STATE */}
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3">
              <div className="flex items-center gap-1.5 text-blue-400 font-semibold mb-1">
                <Compass className="w-3.5 h-3.5" />
                <span>2. Belief / State (Kondisi Terkini Hotel)</span>
              </div>
              <p className="text-slate-300 leading-relaxed">{cycle.belief}</p>
            </div>

            {/* 3. PERCEPTION / CONTEXT */}
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3">
              <div className="flex items-center gap-1.5 text-purple-400 font-semibold mb-1">
                <Eye className="w-3.5 h-3.5" />
                <span>3. Perception / Context (Input & Ekstraksi)</span>
              </div>
              <p className="text-slate-300 leading-relaxed">{cycle.perception}</p>
              {features && (
                <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex flex-wrap gap-x-3 gap-y-1">
                  <span>Intent: <strong className="text-slate-200">{features.intentName}</strong></span>
                  <span>Kompleksitas (x1): <strong className="text-slate-200 font-mono">{features.intentComplexity}</strong></span>
                  <span>Risiko (x2): <strong className="text-slate-200 font-mono">{features.riskLevel}</strong></span>
                </div>
              )}
            </div>

            {/* 4. REASONING */}
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3">
              <div className="flex items-center gap-1.5 text-indigo-400 font-semibold mb-1">
                <Brain className="w-3.5 h-3.5" />
                <span>4. Reasoning (Analisis & Evaluasi Kebijakan)</span>
              </div>
              <p className="text-slate-300 leading-relaxed">{cycle.reasoning}</p>
              {mlResult && (
                <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Skor Sigmoid z: <strong className="font-mono text-slate-200">{mlResult.z.toFixed(2)}</strong></span>
                  <span>P(Human|x): <strong className="font-mono text-amber-300">{(mlResult.probability * 100).toFixed(1)}%</strong></span>
                  <span>Status: <strong className={mlResult.needsHuman ? 'text-rose-400' : 'text-emerald-400'}>{mlResult.needsHuman ? 'Eskalasi Staf' : 'Otonom Agen'}</strong></span>
                </div>
              )}
            </div>

            {/* 5. PLANNING */}
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3">
              <div className="flex items-center gap-1.5 text-cyan-400 font-semibold mb-1">
                <ListOrdered className="w-3.5 h-3.5" />
                <span>5. Planning (Rencana Langkah Kerja)</span>
              </div>
              <ul className="space-y-1 text-slate-300">
                {cycle.planning.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-cyan-500 font-mono text-[10px] mt-0.5">•</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 6. INTENTION */}
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-1">
                <GitFork className="w-3.5 h-3.5" />
                <span>6. Intention (Komitmen Tindakan)</span>
              </div>
              <p className="text-slate-300 leading-relaxed">{cycle.intention}</p>
            </div>
          </div>

          {/* 7. ACTION / TOOLS & 8. FEEDBACK / LEARNING */}
          <div className="space-y-3">
            {/* ACTION / TOOLS */}
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-amber-400 font-semibold text-xs">
                  <Wrench className="w-3.5 h-3.5" />
                  <span>7. Action / Tools (Pemanggilan API & Sistem Hotel)</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">
                  {cycle.actions.length} Operasi API Dijalankan
                </span>
              </div>

              <div className="space-y-2">
                {cycle.actions.map((act, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-900 border border-slate-800/90 rounded-md p-2.5 text-xs font-mono space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-amber-300 font-semibold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                        {act.toolName}()
                      </span>
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                        Sistem: {act.system}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 bg-slate-950 p-2 rounded border border-slate-850">
                      <span className="text-slate-500 font-sans block mb-1 text-[10px] uppercase tracking-wider">
                        Parameter Input:
                      </span>
                      <pre className="text-slate-300 whitespace-pre-wrap font-mono text-[10px]">
                        {JSON.stringify(act.parameters, null, 2)}
                      </pre>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-sans">
                      <CheckCircle className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>{act.resultSummary}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 8. FEEDBACK / LEARNING */}
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3 text-xs">
              <div className="flex items-center gap-1.5 text-teal-400 font-semibold mb-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>8. Feedback / Learning (Evaluasi Hasil & Pembaruan State)</span>
              </div>
              <p className="text-slate-300 leading-relaxed">{cycle.feedbackLearning}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
