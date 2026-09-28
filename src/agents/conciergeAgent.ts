/**
 * CONCIERGE AGENT (AGEN INFORMASI & REKOMENDASI LOKAL)
 * 
 * Tanggung Jawab:
 * - Terhubung ke Local Knowledge Base & Direktori Fasilitas Hotel.
 * - Menjawab pertanyaan seputar jam operasional (check-in/out, sarapan, sky pool, spa).
 * - Memberikan panduan kuliner lokal, destinasi wisata, dan layanan transportasi.
 */

import { HOTEL_AMENITIES_INFO, LOCAL_TOURISM_GUIDE } from '../data/mockHotelData';

export interface ConciergeAgentResponse {
  agentName: string;
  systemUsed: 'Local Knowledge Base & Direktori Hotel';
  responseText: string;
  actionTaken: string;
}

export function handleConciergeQuery(
  message: string,
  guestInfo: { guestName: string; roomNumber: string }
): ConciergeAgentResponse {
  const lower = message.toLowerCase();

  // Waktu Check-In & Check-Out
  if (lower.includes('check-in') || lower.includes('check in') || lower.includes('checkout') || lower.includes('check-out')) {
    return {
      agentName: 'Agen Concierge',
      systemUsed: 'Local Knowledge Base & Direktori Hotel',
      responseText: `Waktu check-in standar di Grand Horizon adalah pukul ${HOTEL_AMENITIES_INFO.checkInTime}, dan check-out pukul ${HOTEL_AMENITIES_INFO.checkOutTime}. Jika Anda memerlukan early check-in atau complimentary late check-out, staf front desk kami akan dengan senang hati membantu sesuai ketersediaan kamar.`,
      actionTaken: 'Membaca direktori operasional check-in/out dari hotel database.',
    };
  }

  // Sarapan / Restoran
  if (lower.includes('sarapan') || lower.includes('breakfast') || lower.includes('makan')) {
    return {
      agentName: 'Agen Concierge',
      systemUsed: 'Local Knowledge Base & Direktori Hotel',
      responseText: `Sarapan prasmanan istimewa kami disajikan setiap pagi di ${HOTEL_AMENITIES_INFO.breakfast}. Tersedia menu Nusantara, hidangan Western hangat, pastry segar, dan jus buah murni.`,
      actionTaken: 'Mengambil jadwal dan menu outlet The Grand Brasserie.',
    };
  }

  // Fasilitas Pool / Gym / Spa
  if (lower.includes('kolam') || lower.includes('pool') || lower.includes('gym') || lower.includes('spa')) {
    return {
      agentName: 'Agen Concierge',
      systemUsed: 'Local Knowledge Base & Direktori Hotel',
      responseText: `Fasilitas kami mencakup:
• ${HOTEL_AMENITIES_INFO.swimmingPool}
• ${HOTEL_AMENITIES_INFO.gym}
• ${HOTEL_AMENITIES_INFO.spa}
Handuk dan akses langsung dapat dinikmati menggunakan kartu kamar Anda.`,
      actionTaken: 'Menyajikan jadwal fasilitas rekreasi dari master knowledge base.',
    };
  }

  // Rekomendasi Wisata & Kuliner Lokal
  if (lower.includes('wisata') || lower.includes('kuliner') || lower.includes('rekomendasi') || lower.includes('jalan')) {
    const spot1 = LOCAL_TOURISM_GUIDE[0];
    const spot2 = LOCAL_TOURISM_GUIDE[2];
    return {
      agentName: 'Agen Concierge',
      systemUsed: 'Local Knowledge Base & Direktori Hotel',
      responseText: `Tentu Bapak/Ibu ${guestInfo.guestName}, berikut dua rekomendasi terdekat yang sangat diminati:
1. ${spot2.name} (${spot2.category}) - ${spot2.distance}: ${spot2.tips}
2. ${spot1.name} (${spot1.category}) - ${spot1.distance}: ${spot1.tips}

Jika memerlukan pemesanan transportasi hotel atau reservasi meja, kami siap membantu!`,
      actionTaken: 'Menelusuri database kurasi concierge wisata lokal radius 5 km.',
    };
  }

  // Default Concierge
  return {
    agentName: 'Agen Concierge',
    systemUsed: 'Local Knowledge Base & Direktori Hotel',
    responseText: `Halo Bapak/Ibu ${guestInfo.guestName}, saya dari Concierge Grand Horizon. Kami siap memberikan informasi lengkap mengenai fasilitas hotel (Sky Pool Lt. 8, The Horizon Spa Lt. 7) maupun rekomendasi kuliner dan wisata terbaik di sekitar hotel. Ada yang bisa kami bantu jelaskan?`,
    actionTaken: 'Membuka panduan informasi umum layanan tamu.',
  };
}
