/**
 * Agen Housekeeping
 * Menangani permintaan fasilitas kamar, perlengkapan mandi, dan kebersihan kamar.
 */
export function handleHousekeeping(msg: string): string {
  const text = msg.toLowerCase();
  if (text.includes('handuk') || text.includes('towel')) {
    return 'Tiket HK-102 dibuat: 2 set handuk mandi bersih sedang diantar oleh staf runner ke kamar Anda (estimasi 10 menit).';
  }
  if (text.includes('air') || text.includes('mineral') || text.includes('minum')) {
    return 'Tiket HK-103 dibuat: Tambahan 4 botol air mineral premium sedang dikirim ke kamar Anda.';
  }
  if (text.includes('bersih') || text.includes('make up') || text.includes('sapu')) {
    return 'Permintaan make-up room dicatat: Tim housekeeping lantai telah dijadwalkan untuk membersihkan kamar Anda segera.';
  }
  return 'Saya Agen Housekeeping. Beritahu saya jika Anda memerlukan handuk baru, air mineral tambahan, bantal, atau pembersihan kamar.';
}
