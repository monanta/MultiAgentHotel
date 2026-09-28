/**
 * Agen Concierge
 * Menangani informasi umum hotel: jam check-in/out, sarapan, kolam renang, wifi.
 */
export function handleConcierge(msg: string): string {
  const text = msg.toLowerCase();
  if (text.includes('check-in') || text.includes('check in') || text.includes('jam')) {
    return 'Waktu Check-in resmi hotel adalah pukul 14:00 WIB dan Check-out maksimal pukul 12:00 WIB. Layanan penitipan bagasi gratis tersedia di lobby 24 jam.';
  }
  if (text.includes('sarapan') || text.includes('breakfast') || text.includes('makan')) {
    return 'Sarapan buffet disajikan di Restoran Saffron (Lantai 1) setiap hari pukul 06:00 - 10:00 WIB.';
  }
  if (text.includes('kolam') || text.includes('pool') || text.includes('gym')) {
    return 'Infinity Pool dan Fitness Center berada di Lantai 5, beroperasi pukul 06:00 - 21:00 WIB khusus tamu menginap.';
  }
  if (text.includes('wifi') || text.includes('internet')) {
    return 'Koneksi Wi-Fi gratis berkecepatan tinggi: Sambungkan ke "GrandHorizon_Guest", masukkan nomor kamar dan nama belakang Anda.';
  }
  return 'Halo! Saya Agen Concierge. Anda dapat menanyakan info jam check-in, jadwal sarapan, kolam renang/gym, atau akses Wi-Fi.';
}
