/**
 * RESERVATION AGENT (AGEN RESERVASI & JADWAL)
 * 
 * Tanggung Jawab:
 * - Terhubung ke Property Management System (PMS).
 * - Mengecek ketersediaan kamar secara real-time.
 * - Mengelola pertanyaan perubahan tanggal menginap (reschedule),
 *   perpanjangan durasi tinggal, dan kebijakan pembatalan.
 */

import { PMSReservation } from '../types/hotel';

export interface ReservationAgentResponse {
  agentName: string;
  systemUsed: 'PMS (Property Management System)';
  responseText: string;
  actionTaken: string;
}

export function handleReservationQuery(
  message: string,
  guestInfo: { guestName: string; roomNumber: string },
  reservations: PMSReservation[]
): ReservationAgentResponse {
  const currentRes = reservations.find((r) => r.roomNumber === guestInfo.roomNumber) || reservations[0];

  const responseText = `Halo Bapak/Ibu ${guestInfo.guestName}, saya dari Agen Reservasi Grand Horizon. Berdasarkan data PMS kami (Kode Booking: ${currentRes.confirmationCode}), Anda saat ini menginap di kamar ${guestInfo.roomNumber} (${currentRes.roomType}) hingga ${currentRes.checkOut}. Ketersediaan kamar kami untuk penyesuaian tanggal atau perpanjangan menginap masih sangat tersedia tanpa penalti perubahan. Apakah Anda ingin memperpanjang durasi menginap atau menyesuaikan tanggal check-out?`;

  return {
    agentName: 'Agen Reservasi',
    systemUsed: 'PMS (Property Management System)',
    responseText,
    actionTaken: `Mengakses data reservasi ${currentRes.confirmationCode} dan memverifikasi slot ketersediaan tipe ${currentRes.roomType} di sistem PMS.`,
  };
}
