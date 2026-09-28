/**
 * Agen Orchestrator (Router Pusat)
 * Menganalisis pesan tamu, mengarahkan ke agen spesialis,
 * atau mengeskalasikan ke staf manusia jika terdapat komplain/masalah berat.
 */
import { AgentResult } from '../types/hotel';
import { handleConcierge } from './conciergeAgent';
import { handleReservation } from './reservationAgent';
import { handleHousekeeping } from './housekeepingAgent';
import { handleBilling } from './billingAgent';

export function routeMessage(message: string): AgentResult {
  const text = message.toLowerCase();

  // 1. Deteksi Eskalasi Staf Manusia (Komplain tinggi / sengketa biaya)
  const isHighRisk =
    text.includes('kotor') ||
    text.includes('kecewa') ||
    text.includes('marah') ||
    text.includes('sengketa') ||
    text.includes('belum dibersihkan') ||
    text.includes('salah charge') ||
    text.includes('tidak kenal') ||
    text.includes('komplain');

  if (isHighRisk) {
    return {
      agentRole: 'human',
      agentName: 'Front Office (Eskalasi Staf)',
      reply: 'Pesan Anda terdeteksi membutuhkan penanganan staf manusia dan telah diteruskan ke Meja Front Office. Staf kami akan membalas secara langsung sesaat lagi.',
      isEscalated: true,
      reason: 'Komplain pelayanan / sengketa terdeteksi',
    };
  }

  // 2. Routing ke Agen Reservasi
  if (text.includes('booking') || text.includes('reservasi') || text.includes('ubah') || text.includes('tanggal') || text.includes('upgrade')) {
    return {
      agentRole: 'reservation',
      agentName: 'Agen Reservasi (PMS)',
      reply: handleReservation(message),
      isEscalated: false,
    };
  }

  // 3. Routing ke Agen Housekeeping
  if (text.includes('handuk') || text.includes('bersih') || text.includes('air') || text.includes('mineral') || text.includes('sampah')) {
    return {
      agentRole: 'housekeeping',
      agentName: 'Agen Housekeeping',
      reply: handleHousekeeping(message),
      isEscalated: false,
    };
  }

  // 4. Routing ke Agen Billing & POS
  if (text.includes('tagihan') || text.includes('bill') || text.includes('biaya') || text.includes('bayar') || text.includes('folio')) {
    return {
      agentRole: 'billing',
      agentName: 'Agen Billing & POS',
      reply: handleBilling(message),
      isEscalated: false,
    };
  }

  // 5. Default ke Agen Concierge
  return {
    agentRole: 'concierge',
    agentName: 'Agen Concierge',
    reply: handleConcierge(message),
    isEscalated: false,
  };
}
