import React, { useState } from 'react';
import {
  ChatMessage,
  ChannelType,
  ExtractionFeatures,
  LogisticRegressionParams,
  LogisticRegressionResult,
  CognitiveCycle,
  PMSReservation,
  POSTransaction,
  HousekeepingTicket,
  HumanEscalationTicket,
} from '../types/hotel';
import { BENCHMARK_TEST_CASES } from '../data/mockHotelData';
import {
  extractFeatures,
  calculateLogisticRegression,
  runSpecializedAgentCycle,
  DEFAULT_LR_PARAMS,
} from '../services/multiAgentEngine';
import { CognitiveCycleInspector } from './CognitiveCycleInspector';
import {
  Send,
  Smartphone,
  Tablet,
  Globe,
  Bot,
  User,
  ShieldAlert,
  Calendar,
  Sparkles,
  BedDouble,
  Receipt,
  RotateCcw,
  CheckCheck,
  Zap,
  ArrowRight,
  Info,
} from 'lucide-react';

interface ChatOmnichannelSimulatorProps {
  reservations: PMSReservation[];
  posTransactions: POSTransaction[];
  housekeepingTickets: HousekeepingTicket[];
  escalationTickets: HumanEscalationTicket[];
  lrParams: LogisticRegressionParams;
  onAddHousekeepingTicket: (ticket: HousekeepingTicket) => void;
  onAddEscalationTicket: (ticket: HumanEscalationTicket) => void;
}

export const ChatOmnichannelSimulator: React.FC<ChatOmnichannelSimulatorProps> = ({
  reservations,
  posTransactions,
  housekeepingTickets,
  escalationTickets,
  lrParams,
  onAddHousekeepingTicket,
  onAddEscalationTicket,
}) => {
  const [selectedChannel, setSelectedChannel] = useState<ChannelType>('whatsapp');
  const [selectedRoomNumber, setSelectedRoomNumber] = useState<string>('802');
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Active guest info
  const currentGuest = reservations.find((r) => r.roomNumber === selectedRoomNumber) || reservations[0];

  // Conversation history
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init-1',
      sender: 'agent',
      agentSource: 'orchestrator',
      channel: 'whatsapp',
      text: `Halo Bapak/Ibu ${currentGuest.guestName}! Selamat datang di Grand Horizon Hotel (Kamar ${currentGuest.roomNumber} - ${currentGuest.roomType}). Layanan Customer Service Multi-Agent kami siap membantu kebutuhan reservasi, concierge, housekeeping, dan tagihan Anda 24 jam.`,
      timestamp: '11:00',
    },
  ]);

  // Latest trace state for inspector
  const [latestFeatures, setLatestFeatures] = useState<ExtractionFeatures | null>(null);
  const [latestMLResult, setLatestMLResult] = useState<LogisticRegressionResult | null>(null);
  const [latestCycle, setLatestCycle] = useState<CognitiveCycle | null>(null);
  const [latestAgentName, setLatestAgentName] = useState<string>('Orchestrator');
  const [latestAgentDomain, setLatestAgentDomain] = useState<string>('Sistem Operasional Hotel');

  const handleSendMessage = async (textToSend: string) => {
    const text = textToSend.trim();
    if (!text || isProcessing) return;

    const userMsgId = `user-${Date.now()}`;
    const nowTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    // 1. Add Guest message to chat
    const newGuestMsg: ChatMessage = {
      id: userMsgId,
      sender: 'guest',
      channel: selectedChannel,
      text,
      timestamp: nowTime,
      metadata: {
        roomNumber: currentGuest.roomNumber,
        guestName: currentGuest.guestName,
      },
    };

    setMessages((prev) => [...prev, newGuestMsg]);
    setInputMessage('');
    setIsProcessing(true);

    // 2. Multi-Agent Pipeline Execution
    setTimeout(async () => {
      try {
        // Step A: Feature Extraction (NLP / Transformer)
        const features = extractFeatures(text, {
          roomNumber: currentGuest.roomNumber,
          guestName: currentGuest.guestName,
        });

        // Step B: Logistic Regression Model Computation
        const mlResult = calculateLogisticRegression(
          features.intentComplexity,
          features.riskLevel,
          lrParams
        );

        // Step C: Route to Specialized Agent or Escalation Desk
        const agentType = mlResult.needsHuman ? 'human_escalation' : features.targetAgent;

        let agentDisplayName = 'Agen Concierge';
        let domainName = 'Local Knowledge Base & Fasilitas';

        if (agentType === 'reservation') {
          agentDisplayName = 'Agen Reservasi';
          domainName = 'Property Management System (PMS)';
        } else if (agentType === 'housekeeping') {
          agentDisplayName = 'Agen Housekeeping & Maintenance';
          domainName = 'Facility Management & Staf Runner';
        } else if (agentType === 'billing') {
          agentDisplayName = 'Agen Billing & POS';
          domainName = 'Point of Sale (POS) & Hotel Folio';
        } else if (agentType === 'human_escalation') {
          agentDisplayName = 'Front Office Human Escalation';
          domainName = 'Staf Duty Manager / Supervisor';
        }

        // Step D: Execute Agent Internal Cycle & Tool Integration
        const { cycle, responseText, createdTicket, createdEscalation } = runSpecializedAgentCycle(
          agentType,
          text,
          features,
          mlResult,
          {
            reservations,
            posTransactions,
            hkTickets: housekeepingTickets,
            escalationTickets,
          }
        );

        // If housekeeping ticket created, notify parent state
        if (createdTicket) {
          onAddHousekeepingTicket(createdTicket);
        }

        // If human escalation ticket created, notify parent state
        if (createdEscalation) {
          onAddEscalationTicket(createdEscalation);
        }

        // Update latest inspector state
        setLatestFeatures(features);
        setLatestMLResult(mlResult);
        setLatestCycle(cycle);
        setLatestAgentName(agentDisplayName);
        setLatestAgentDomain(domainName);

        // Add Agent Response to Chat
        const agentMsg: ChatMessage = {
          id: `agent-${Date.now()}`,
          sender: mlResult.needsHuman ? 'human_staff' : 'agent',
          agentSource: agentType,
          channel: selectedChannel,
          text: responseText,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          metadata: {
            intent: features.intent,
            intentComplexity: features.intentComplexity,
            riskLevel: features.riskLevel,
            probabilityHuman: mlResult.probability,
            decision: mlResult.needsHuman ? 'human_escalation' : 'agent',
            roomNumber: currentGuest.roomNumber,
            guestName: currentGuest.guestName,
          },
        };

        setMessages((prev) => [...prev, agentMsg]);
      } catch (err) {
        console.error('Error in agent cycle:', err);
      } finally {
        setIsProcessing(false);
      }
    }, 400);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `msg-reset-${Date.now()}`,
        sender: 'agent',
        agentSource: 'orchestrator',
        channel: selectedChannel,
        text: `Percakapan direset. Halo Bapak/Ibu ${currentGuest.guestName}, apa yang bisa kami bantu hari ini?`,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setLatestCycle(null);
    setLatestFeatures(null);
    setLatestMLResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Channel Selector & Active Guest Context */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Channel Selection */}
        <div>
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">
            Pilih Kanal Komunikasi Tamu (Omnichannel Request):
          </span>
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setSelectedChannel('whatsapp')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
                selectedChannel === 'whatsapp'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>WhatsApp API</span>
            </button>
            <button
              onClick={() => setSelectedChannel('in_room_tablet')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
                selectedChannel === 'in_room_tablet'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Tablet className="w-3.5 h-3.5" />
              <span>In-Room Smart Tablet</span>
            </button>
            <button
              onClick={() => setSelectedChannel('web_widget')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
                selectedChannel === 'web_widget'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Web Assistant</span>
            </button>
          </div>
        </div>

        {/* Guest Context Selector */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-[11px] text-slate-400 block">Tamu Menginap Aktif:</span>
            <span className="text-xs font-semibold text-slate-200">
              {currentGuest.guestName} (Kamar {currentGuest.roomNumber})
            </span>
          </div>

          <select
            value={selectedRoomNumber}
            onChange={(e) => {
              setSelectedRoomNumber(e.target.value);
              handleResetChat();
            }}
            className="bg-slate-950 text-slate-200 text-xs rounded-lg border border-slate-700 px-3 py-1.5 focus:outline-none focus:border-amber-400"
          >
            {reservations.map((r) => (
              <option key={r.roomNumber} value={r.roomNumber}>
                Kamar {r.roomNumber} - {r.guestName} ({r.roomType})
              </option>
            ))}
          </select>

          <button
            onClick={handleResetChat}
            className="p-1.5 text-slate-400 hover:text-slate-200 bg-slate-950 border border-slate-800 rounded-lg hover:border-slate-700 transition-colors"
            title="Reset Percakapan"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main 2-Column Layout: Left Chat Interface, Right Agent Trace & Nervous System */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Chat Omnichannel Screen (7 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div
            className={`border rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[650px] transition-colors ${
              selectedChannel === 'whatsapp'
                ? 'bg-slate-950 border-emerald-950/60'
                : selectedChannel === 'in_room_tablet'
                ? 'bg-slate-950 border-amber-950/60'
                : 'bg-slate-950 border-blue-950/60'
            }`}
          >
            {/* Chat Device Header */}
            <div
              className={`px-4 py-3 border-b flex items-center justify-between ${
                selectedChannel === 'whatsapp'
                  ? 'bg-emerald-950/40 border-emerald-900/40 text-emerald-200'
                  : selectedChannel === 'in_room_tablet'
                  ? 'bg-amber-950/30 border-amber-900/40 text-amber-200'
                  : 'bg-blue-950/40 border-blue-900/40 text-blue-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
                    selectedChannel === 'whatsapp'
                      ? 'bg-emerald-500 text-slate-950'
                      : selectedChannel === 'in_room_tablet'
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-blue-500 text-slate-950'
                  }`}
                >
                  GH
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white flex items-center gap-2">
                    Grand Horizon Service Hub
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Kamar {currentGuest.roomNumber} · {currentGuest.guestName} ({currentGuest.roomType})
                  </p>
                </div>
              </div>

              <div className="text-[11px] font-mono text-slate-400">
                {selectedChannel === 'whatsapp'
                  ? 'WhatsApp Official'
                  : selectedChannel === 'in_room_tablet'
                  ? 'In-Room Suite Tablet'
                  : 'Web Live Concierge'}
              </div>
            </div>

            {/* Chat Message Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin scrollbar-thumb-slate-800">
              {messages.map((msg) => {
                const isGuest = msg.sender === 'guest';
                const isEscalation = msg.metadata?.decision === 'human_escalation';

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isGuest ? 'items-end' : 'items-start'}`}
                  >
                    {/* Sender Tag */}
                    <div className="text-[10px] text-slate-400 mb-1 px-1 flex items-center gap-1.5">
                      {isGuest ? (
                        <>
                          <span>{currentGuest.guestName}</span>
                          <User className="w-2.5 h-2.5 text-slate-400" />
                        </>
                      ) : (
                        <>
                          {isEscalation ? (
                            <ShieldAlert className="w-3 h-3 text-rose-400" />
                          ) : (
                            <Bot className="w-3 h-3 text-amber-400" />
                          )}
                          <span className={isEscalation ? 'text-rose-300 font-semibold' : 'text-amber-300'}>
                            {isEscalation
                              ? 'Duty Front Office Manager (Eskalasi Staf)'
                              : msg.agentSource === 'reservation'
                              ? 'Agen Reservasi (PMS)'
                              : msg.agentSource === 'housekeeping'
                              ? 'Agen Housekeeping & Fasilitas'
                              : msg.agentSource === 'billing'
                              ? 'Agen Billing & POS'
                              : 'Agen Concierge'}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Bubble */}
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs shadow-md leading-relaxed whitespace-pre-wrap ${
                        isGuest
                          ? selectedChannel === 'whatsapp'
                            ? 'bg-emerald-700 text-emerald-50 rounded-tr-none'
                            : 'bg-amber-600 text-white rounded-tr-none'
                          : isEscalation
                          ? 'bg-slate-900 border-2 border-rose-500/60 text-slate-100 rounded-tl-none'
                          : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                      }`}
                    >
                      {msg.text}

                      {/* Diagnostic summary footer inside agent message */}
                      {msg.metadata && !isGuest && (
                        <div className="mt-2.5 pt-2 border-t border-slate-800/80 text-[10px] flex items-center justify-between text-slate-400">
                          <span className="font-mono">
                            x1={msg.metadata.intentComplexity} · x2={msg.metadata.riskLevel} · P=
                            {((msg.metadata.probabilityHuman || 0) * 100).toFixed(1)}%
                          </span>
                          <span
                            className={
                              isEscalation ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'
                            }
                          >
                            {isEscalation ? 'Eskalasi Staf' : 'Otonom Agen'}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="text-[10px] text-slate-500 mt-1 px-1 flex items-center gap-1">
                      <span>{msg.timestamp}</span>
                      {isGuest && <CheckCheck className="w-3 h-3 text-emerald-400" />}
                    </div>
                  </div>
                );
              })}

              {isProcessing && (
                <div className="flex items-center gap-2 text-xs text-amber-400/90 bg-slate-900/80 border border-slate-800/80 px-3 py-2 rounded-xl w-fit">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                  <span>Orchestrator mengekstraksi intent & menghitung Logistic Regression...</span>
                </div>
              )}
            </div>

            {/* Benchmark Preset Prompts Bar */}
            <div className="px-3 py-2 bg-slate-900/90 border-t border-slate-800/80">
              <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block mb-1.5">
                Benchmark Prompts (Berdasarkan Makalah Kelompok 5):
              </span>
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {BENCHMARK_TEST_CASES.slice(0, 4).map((testCase, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(testCase.message)}
                    disabled={isProcessing}
                    className="text-[11px] text-left px-2.5 py-1.5 rounded-md bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 text-slate-300 hover:text-white transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Zap className="w-3 h-3 text-amber-400" />
                    <span>"{testCase.message}"</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputMessage);
              }}
              className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Tulis pesan tamu (contoh: 'Saya mau ubah tanggal booking', 'Jam check-in berapa?')..."
                disabled={isProcessing}
                className="flex-1 bg-slate-950 text-slate-100 text-xs px-3.5 py-2.5 rounded-xl border border-slate-700/80 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 transition-all placeholder:text-slate-500"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isProcessing}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 rounded-xl font-medium text-xs flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20 disabled:opacity-50 disabled:pointer-events-none"
              >
                <span>Kirim</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Orchestration Nervous System & Decision Engine Trace (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Decision Pipeline Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-mono text-xs font-bold">
                  OR
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Orchestrator & ML Decision Gateway
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Alur: Customer Message → Feature Extraction → Logistic Regression → Policy
                  </p>
                </div>
              </div>

              {latestMLResult && (
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded border tabular-nums ${
                    latestMLResult.needsHuman
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}
                >
                  {latestMLResult.needsHuman ? 'HUMAN ESCALATION' : 'AUTONOMOUS AGENT'}
                </span>
              )}
            </div>

            {/* Extracted Features Panel */}
            {latestFeatures ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                    Detected Intent
                  </span>
                  <span className="font-semibold text-slate-100 block truncate mt-0.5">
                    {latestFeatures.intentName}
                  </span>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                    Intent Complexity (x1)
                  </span>
                  <span className="font-mono text-base font-bold text-amber-400 block mt-0.5">
                    {latestFeatures.intentComplexity}
                    <span className="text-[10px] text-slate-500 font-normal"> / 5</span>
                  </span>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                    Risk Level (x2)
                  </span>
                  <span className="font-mono text-base font-bold text-rose-400 block mt-0.5">
                    {latestFeatures.riskLevel}
                    <span className="text-[10px] text-slate-500 font-normal"> / 2</span>
                  </span>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                    Target Domain
                  </span>
                  <span className="font-semibold text-cyan-300 block truncate mt-0.5">
                    {latestAgentName.replace('Agen ', '')}
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 text-xs text-slate-500 text-center">
                Belum ada pesan diproses. Kirim pesan dari tamu untuk melihat ekstraksi fitur NLP.
              </div>
            )}

            {/* Sigmoid Calculation Box */}
            {latestMLResult && (
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono">
                    Formulasi Matematis (Bagian 4 PDF):
                  </span>
                  <span className="font-mono text-amber-300 font-semibold">
                    z = {latestMLResult.z.toFixed(2)} · P(Human|x) = {(latestMLResult.probability * 100).toFixed(1)}%
                  </span>
                </div>

                {/* Progress bar visualizer */}
                <div className="space-y-1">
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden relative">
                    <div
                      className={`h-full transition-all duration-500 ${
                        latestMLResult.needsHuman ? 'bg-rose-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(0, latestMLResult.probability * 100))}%` }}
                    />
                    {/* Threshold marker */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-amber-400 z-10"
                      style={{ left: `${latestMLResult.threshold * 100}%` }}
                      title={`Ambang Batas tau = ${latestMLResult.threshold}`}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>0.0 (Otonom Agen)</span>
                    <span className="text-amber-400 font-semibold">
                      Threshold tau = {latestMLResult.threshold.toFixed(2)}
                    </span>
                    <span>1.0 (Eskalasi Staf)</span>
                  </div>
                </div>

                <div className="text-[11px] font-mono text-slate-300 bg-slate-900 p-2 rounded border border-slate-850 whitespace-pre-wrap leading-relaxed">
                  {latestMLResult.stepCalculation}
                </div>
              </div>
            )}
          </div>

          {/* Cognitive Cycle Inspector (Section 9) */}
          <CognitiveCycleInspector
            cycle={latestCycle}
            features={latestFeatures}
            mlResult={latestMLResult}
            agentName={latestAgentName}
            agentDomain={latestAgentDomain}
          />
        </div>
      </div>
    </div>
  );
};
