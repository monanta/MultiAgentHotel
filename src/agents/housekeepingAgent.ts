/**
 * HOUSEKEEPING & MAINTENANCE AGENT (AGEN KAMAR & FASILITAS)
 * 
 * Tanggung Jawab:
 * - Terhubung ke Facility Management System & Aplikasi Staf Runner.
 * - Menerbitkan tiket tugas operasional otomatis ke staf lantai (misal: pengantaran handuk, air mineral).
 * - Menetapkan SLA waktu penyelesaian (15-20 menit) dan mengonfirmasi waktu tiba kepada tamu.
 */

import { HousekeepingTicket } from '../types/hotel';

export interface HousekeepingAgentResponse {
  agentName: string;
  systemUsed: 'Facility Management System & Staf Runner';
  responseText: string;
  actionTaken: string;
  createdTicket?: HousekeepingTicket;
}

export function handleHousekeepingQuery(
  message: string,
  guestInfo: { guestName: string; roomNumber: string }
): HousekeepingAgentResponse {
  const lower = message.toLowerCase();
  const isAmenity = lower.includes('handuk') || lower.includes('air') || lower.includes('bantal') || lower.includes('sandal');

  const itemName = lower.includes('handuk')
    ? 'Handuk Mandi Ekstra'
    : lower.includes('air')
    ? 'Air Mineral Tambahan'
    : lower.includes('bantal')
    ? 'Bantal Ekstra'
    : 'Layanan Kamar';

  const ticketId = `HK-${Date.now().toString().slice(-3)}`;
  const staffRunner = 'Bambang Irawan (Housekeeping Floor Runner)';

  const newTicket: HousekeepingTicket = {
    id: ticketId,
    roomNumber: guestInfo.roomNumber,
    guestName: guestInfo.guestName,
    category: isAmenity ? 'Amenities Refill' : 'Housekeeping Clean',
    priority: 'Normal' as any,
    description: itemName,
    status: 'Dispatched',
    assignedStaff: staffRunner,
    createdAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    targetMinutes: 15,
  };

  const responseText = `Baik Bapak/Ibu ${guestInfo.guestName}, permintaan ${itemName} untuk kamar ${guestInfo.roomNumber} telah berhasil kami jadwalkan (Tiket: ${ticketId}). Petugas kami (${staffRunner}) sedang menyiapkan dan akan mengantarkannya langsung ke pintu kamar Anda dalam waktu sekitar 10-15 menit.`;

  return {
    agentName: 'Agen Housekeeping & Fasilitas',
    systemUsed: 'Facility Management System & Staf Runner',
    responseText,
    actionTaken: `Menerbitkan tiket kerja ${ticketId} ke ${staffRunner} dengan target penyelesaian 15 menit.`,
    createdTicket: newTicket,
  };
}
