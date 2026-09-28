/**
 * Agen Reservasi (PMS)
 * Menangani perubahan jadwal booking, ketersediaan, dan upgrade tipe kamar.
 */
export function handleReservation(msg: string): string {
  const text = msg.toLowerCase();
  if (text.includes('ubah') || text.includes('ganti') || text.includes('tanggal') || text.includes('reschedule')) {
    return 'Permintaan perubahan tanggal diproses di sistem PMS: Reservasi Kamar 502 telah dijadwalkan ulang tanpa biaya penalti.';
  }
  if (text.includes('tipe') || text.includes('upgrade') || text.includes('kamar')) {
    return 'Pilihan kamar tersedia: Deluxe King (Rp 1.200.000/malam) dan Executive Suite (Rp 2.500.000/malam). Upgrade dapat diproses langsung.';
  }
  return 'Saya Agen Reservasi PMS. Saya siap membantu pengecekan status booking, perubahan tanggal inap, maupun upgrade kamar.';
}
