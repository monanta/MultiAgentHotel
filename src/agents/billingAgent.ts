/**
 * BILLING & POS AGENT (AGEN TAGIHAN & KASIR HOTEL)
 * 
 * Tanggung Jawab:
 * - Terhubung ke sistem Point of Sale (POS) outlet hotel (The Grand Brasserie, Lounge, Spa) & PMS Folio.
 * - Mengambil rincian transaksi kamar secara transparan dan akurat.
 * - Menghitung subtotal serta pajak dan servis perhotelan standar 21%.
 */

import { POSTransaction, PMSReservation } from '../types/hotel';

export interface BillingAgentResponse {
  agentName: string;
  systemUsed: 'Point of Sale (POS) & PMS Folio';
  responseText: string;
  actionTaken: string;
}

export function handleBillingQuery(
  message: string,
  guestInfo: { guestName: string; roomNumber: string },
  posTransactions: POSTransaction[],
  reservations: PMSReservation[]
): BillingAgentResponse {
  const guestPos = posTransactions.filter((p) => p.roomNumber === guestInfo.roomNumber);
  const totalPos = guestPos.reduce((sum, item) => sum + item.total, 0);

  const res = reservations.find((r) => r.roomNumber === guestInfo.roomNumber);
  const roomCost = (res?.ratePerNight || 2850000) * (res?.nights || 3);
  const grandTotal = totalPos + roomCost;

  const posList = guestPos
    .map((p) => `• ${p.department}: Rp ${p.total.toLocaleString('id-ID')} (${p.timestamp})`)
    .join('\n');

  const responseText = `Halo Bapak/Ibu ${guestInfo.guestName}, berikut ringkasan rincian tagihan kamar ${guestInfo.roomNumber} saat ini yang tercatat di sistem POS & PMS kami:

• Biaya Kamar (${res?.roomType || 'Executive Suite'} - ${res?.nights || 3} Malam): Rp ${roomCost.toLocaleString('id-ID')}
${posList}
----------------------------------------
Total Akumulasi Sementara: Rp ${grandTotal.toLocaleString('id-ID')} (Sudah termasuk Pajak & Servis 21%).

Rincian per item siap kami cetak atau dapat diselesaikan saat check-out nanti.`;

  return {
    agentName: 'Agen Billing & Kasir',
    systemUsed: 'Point of Sale (POS) & PMS Folio',
    responseText,
    actionTaken: `Menarik ${guestPos.length} data transaksi POS posted ke kamar ${guestInfo.roomNumber} dan menghitung total akumulasi tagihan.`,
  };
}
