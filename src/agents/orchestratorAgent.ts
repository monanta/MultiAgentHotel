/**
 * ORCHESTRATOR AGENT (PENGATUR ALUR UTAMA)
 * 
 * Peran:
 * 1. Menerima pesan masuk dari tamu hotel (Omnichannel: WhatsApp / Tablet / Web).
 * 2. Mengekstraksi fitur (NLP): intent, intentComplexity (x1), dan riskLevel (x2).
 * 3. Menghitung model Machine Learning: Regresi Logistik + Sigmoid Gatekeeper.
 *    Formula: z = w1*x1 + w2*x2 + b
 *             P(Human | x) = 1 / (1 + e^-z)
 * 4. Mengambil keputusan kebijakan:
 *    - Jika P(Human | x) > threshold (0.80): Eskalasi ke Staf Manusia (Front Office).
 *    - Jika P(Human | x) <= threshold: Meneruskan ke Agen Spesialis (Reservasi, Concierge, Housekeeping, Billing).
 */

import { ExtractionFeatures, LogisticRegressionParams, LogisticRegressionResult, AgentType } from '../types/hotel';

export const DEFAULT_LR_PARAMS: LogisticRegressionParams = {
  w1: 0.8,   // Bobot Intent Complexity
  w2: 2.0,   // Bobot Risk Level
  b: -2.0,   // Bias / Intercept
  tau: 0.80, // Ambang batas eskalasi ke staf manusia
};

/**
 * Ekstraksi Fitur dari Pesan Tamu (NLP / NLU Rule-based Extraction)
 */
export function extractFeatures(
  message: string,
  guestContext?: { roomNumber?: string; guestName?: string }
): ExtractionFeatures {
  const lower = message.toLowerCase().trim();

  // Ekstraksi nomor kamar jika ada (contoh: "kamar 802", "room 415")
  const roomMatch = lower.match(/(?:kamar|room|no\.?)\s*([0-9]{3,4})/i);
  const detectedRoom = roomMatch ? roomMatch[1] : guestContext?.roomNumber || '802';

  // 1. Sengketa Tagihan / Billing Dispute (Risiko Tinggi, Kerumitan Tinggi)
  if (
    lower.includes('charge') ||
    lower.includes('tagihan tidak') ||
    lower.includes('tidak kenal') ||
    lower.includes('sengketa') ||
    lower.includes('salah hitung') ||
    lower.includes('overcharge') ||
    (lower.includes('tagihan') && lower.includes('mahal'))
  ) {
    return {
      intent: 'billing_dispute',
      intentName: 'Sengketa Tagihan / Dispute',
      targetAgent: 'billing',
      intentComplexity: 4, // x1 = 4
      riskLevel: 1,        // x2 = 1 (Risiko finansial tinggi)
      entities: {
        roomNumber: detectedRoom,
        guestName: guestContext?.guestName || 'Budi Santoso',
      },
      explanation: 'Pesan mengandung klaim sengketa keuangan atau tuduhan biaya yang tidak dikenal.',
    };
  }

  // 2. Komplain Housekeeping Berat (Kamar kotor/belum dibersihkan)
  if (
    lower.includes('belum dibersihkan') ||
    lower.includes('kotor') ||
    lower.includes('sejak pagi') ||
    lower.includes('kecewa') ||
    lower.includes('bau')
  ) {
    return {
      intent: 'housekeeping_complaint',
      intentName: 'Komplain Kebersihan Kamar',
      targetAgent: 'housekeeping',
      intentComplexity: 3, // x1 = 3
      riskLevel: 1,        // x2 = 1 (Risiko kepuasan tamu kritis)
      entities: {
        roomNumber: detectedRoom,
        guestName: guestContext?.guestName || 'Budi Santoso',
        item: 'Pembersihan Kamar',
      },
      explanation: 'Keluhan kamar belum dibersihkan sejak pagi berisiko tinggi terhadap reputasi hotel.',
    };
  }

  // 3. Laporan Kerusakan Teknis (Maintenance)
  if (
    lower.includes('ac ') ||
    lower.includes('bocor') ||
    lower.includes('rusak') ||
    lower.includes('mati lampu') ||
    lower.includes('air panas')
  ) {
    return {
      intent: 'maintenance_issue',
      intentName: 'Laporan Kerusakan Kamar',
      targetAgent: 'housekeeping',
      intentComplexity: 3,
      riskLevel: 1,
      entities: {
        roomNumber: detectedRoom,
        guestName: guestContext?.guestName || 'Budi Santoso',
      },
      explanation: 'Kerusakan fasilitas fisik kamar membutuhkan perhatian cepat staf teknisi.',
    };
  }

  // 4. Perubahan Jadwal Booking (Agen Reservasi - PMS)
  if (
    lower.includes('ubah tanggal') ||
    lower.includes('perpanjang') ||
    lower.includes('reschedule') ||
    lower.includes('batal') ||
    lower.includes('ganti kamar')
  ) {
    return {
      intent: 'reservation_change',
      intentName: 'Perubahan Tanggal / Kamar',
      targetAgent: 'reservation',
      intentComplexity: 2, // x1 = 2
      riskLevel: 0,        // x2 = 0 (Aman ditangani bot via PMS)
      entities: {
        roomNumber: detectedRoom,
        guestName: guestContext?.guestName || 'Budi Santoso',
      },
      explanation: 'Permintaan perubahan reservasi rutin yang dapat diproses otomatis lewat sistem PMS.',
    };
  }

  // 5. Informasi Rincian Tagihan Rutin (Agen Billing - POS)
  if (
    lower.includes('rincian') ||
    lower.includes('total tagihan') ||
    lower.includes('cek bill') ||
    lower.includes('folio')
  ) {
    return {
      intent: 'billing_inquiry',
      intentName: 'Pengecekan Tagihan Kamar',
      targetAgent: 'billing',
      intentComplexity: 2,
      riskLevel: 0,
      entities: {
        roomNumber: detectedRoom,
        guestName: guestContext?.guestName || 'Budi Santoso',
      },
      explanation: 'Pertanyaan status tagihan normal yang ditarik langsung dari POS/PMS.',
    };
  }

  // 6. Permintaan Amenitas Standar (Agen Housekeeping)
  if (
    lower.includes('handuk') ||
    lower.includes('air mineral') ||
    lower.includes('bantal') ||
    lower.includes('sandal') ||
    lower.includes('sabun')
  ) {
    return {
      intent: 'amenity_request',
      intentName: 'Permintaan Amenitas Kamar',
      targetAgent: 'housekeeping',
      intentComplexity: 1,
      riskLevel: 0,
      entities: {
        roomNumber: detectedRoom,
        guestName: guestContext?.guestName || 'Budi Santoso',
        item: lower.includes('handuk') ? 'Handuk Tambahan' : 'Air Mineral Tambahan',
      },
      explanation: 'Permintaan barang fasilitas kamar standar, langsung dibuatkan tiket runner.',
    };
  }

  // 7. Informasi Fasilitas / Kebijakan Hotel (Agen Concierge)
  return {
    intent: 'concierge_info',
    intentName: 'Informasi Hotel & Wisata',
    targetAgent: 'concierge',
    intentComplexity: 1, // x1 = 1
    riskLevel: 0,        // x2 = 0
    entities: {
      roomNumber: detectedRoom,
      guestName: guestContext?.guestName || 'Budi Santoso',
    },
    explanation: 'Pertanyaan seputar jam check-in/out, sarapan, kolam renang, atau rekomendasi.',
  };
}

/**
 * Kalkulasi Model Machine Learning: Regresi Logistik + Sigmoid
 * z = w1*x1 + w2*x2 + b
 * P(Human | x) = 1 / (1 + e^-z)
 */
export function evaluateEscalationML(
  x1: number,
  x2: number,
  params: LogisticRegressionParams = DEFAULT_LR_PARAMS
): LogisticRegressionResult {
  const { w1, w2, b, tau } = params;
  const z = w1 * x1 + w2 * x2 + b;
  const probability = 1 / (1 + Math.exp(-z));
  const needsHuman = probability > tau;

  const stepCalculation = `z = (${w1})(${x1}) + (${w2})(${x2}) + (${b}) = ${z.toFixed(2)} | P = ${(probability * 100).toFixed(1)}%`;

  return {
    x1,
    x2,
    w1,
    w2,
    b,
    z,
    probability,
    threshold: tau,
    needsHuman,
    stepCalculation,
  };
}
