/**
 * Agen Billing & POS
 * Menangani rincian tagihan kamar, struk resto/spa, dan metode pembayaran.
 */
export function handleBilling(msg: string): string {
  const text = msg.toLowerCase();
  if (text.includes('resto') || text.includes('makan') || text.includes('tagihan') || text.includes('bill')) {
    return 'Rincian folio kamar 502: Dining Resto Saffron Rp 350.000 + Room Service Rp 150.000 + Pajak & Service (21%) Rp 105.000. Total berjalan: Rp 605.000.';
  }
  if (text.includes('bayar') || text.includes('metode') || text.includes('kartu')) {
    return 'Pembayaran folio dapat diselesaikan saat check-out menggunakan Kartu Kredit (Visa/Mastercard), Debit, QRIS, atau Tunai di Front Desk.';
  }
  return 'Saya Agen Billing & POS. Saya dapat membantu pengecekan rincian tagihan kamar, struk restoran/spa, dan metode pembayaran.';
}
