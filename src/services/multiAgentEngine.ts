import {
  AgentType,
  ExtractionFeatures,
  LogisticRegressionParams,
  LogisticRegressionResult,
  CognitiveCycle,
  ActionToolRecord,
  PMSReservation,
  POSTransaction,
  HousekeepingTicket,
  HumanEscalationTicket,
} from '../types/hotel';
import { HOTEL_AMENITIES_INFO, LOCAL_TOURISM_GUIDE } from '../data/mockHotelData';

export const DEFAULT_LR_PARAMS: LogisticRegressionParams = {
  w1: 0.8,
  w2: 2.0,
  b: -2.0,
  tau: 0.80,
};

// NLP & Transformer-based Feature Extraction simulation
export function extractFeatures(
  message: string,
  guestContext?: { roomNumber?: string; guestName?: string }
): ExtractionFeatures {
  const lower = message.toLowerCase().trim();

  // Extract Room Number if mentioned (e.g., "kamar 802", "room 415")
  const roomMatch = lower.match(/(?:kamar|room|no\.?)\s*([0-9]{3,4})/i);
  const detectedRoom = roomMatch ? roomMatch[1] : guestContext?.roomNumber || '802';

  // Extract monetary amounts if mentioned (e.g., "Rp2 juta", "2.000.000", "500 ribu")
  let detectedAmount: number | undefined;
  if (lower.includes('2 juta') || lower.includes('2.000.000') || lower.includes('2jt')) {
    detectedAmount = 2000000;
  } else if (lower.includes('1 juta') || lower.includes('1.000.000')) {
    detectedAmount = 1000000;
  } else if (lower.includes('500 ribu') || lower.includes('500.000')) {
    detectedAmount = 500000;
  }

  // 1. BILLING DISPUTE / COMPLAINT (High risk, high complexity)
  if (
    lower.includes('charge') ||
    lower.includes('tagihan tidak') ||
    lower.includes('tidak kenal') ||
    lower.includes('sengketa') ||
    lower.includes('salah hitung') ||
    lower.includes('kembalikan uang') ||
    lower.includes('overcharge') ||
    (lower.includes('tagihan') && lower.includes('mahal'))
  ) {
    return {
      intent: 'billing_dispute',
      intentName: 'Sengketa Tagihan / Billing Dispute',
      targetAgent: 'billing',
      intentComplexity: 4, // x1 = 4 (as in paper)
      riskLevel: 1,        // x2 = 1 (financial risk / customer satisfaction dispute)
      entities: {
        roomNumber: detectedRoom,
        guestName: guestContext?.guestName || 'Budi Santoso',
        amount: detectedAmount || 2000000,
        item: 'Transaksi Tagihan Tak Dikenal',
      },
      explanation:
        'Pesan mengandung indikasi sengketa transaksi keuangan (dispute charge). Memerlukan verifikasi supervisor dan otorisasi finansial.',
    };
  }

  // 2. HOUSEKEEPING UNRESOLVED COMPLAINT (Delayed service, dirty room)
  if (
    lower.includes('belum dibersihkan') ||
    lower.includes('kotor') ||
    lower.includes('bau') ||
    lower.includes('sejak pagi') ||
    lower.includes('kecewa') ||
    lower.includes('komplain')
  ) {
    return {
      intent: 'housekeeping_complaint',
      intentName: 'Komplain Pelayanan Kebersihan Kamar',
      targetAgent: 'housekeeping',
      intentComplexity: 3, // x1 = 3 (as in paper)
      riskLevel: 1,        // x2 = 1 (service recovery / churn risk)
      entities: {
        roomNumber: detectedRoom,
        guestName: guestContext?.guestName || 'Budi Santoso',
        item: 'Pembersihan Kamar Tertunda',
      },
      explanation:
        'Keluhan atas kamar belum dibersihkan berpotensi menurunkan kepuasan tamu secara drastis sehingga membutuhkan intervensi staf.',
    };
  }

  // 3. MAINTENANCE DEFECT / BREAKAGE (AC leaking, toilet broken, electricity)
  if (
    lower.includes('ac ') ||
    lower.includes('bocor') ||
    lower.includes('rusak') ||
    lower.includes('mati lampu') ||
    lower.includes('air panas') ||
    lower.includes('berisik') ||
    lower.includes('pipa') ||
    lower.includes('kunci')
  ) {
    return {
      intent: 'maintenance_issue',
      intentName: 'Laporan Kerusakan Fasilitas Kamar',
      targetAgent: 'housekeeping',
      intentComplexity: 3,
      riskLevel: 1,
      entities: {
        roomNumber: detectedRoom,
        guestName: guestContext?.guestName || 'Budi Santoso',
        item: lower.includes('ac') ? 'Air Conditioner (AC)' : 'Fasilitas Kamar Rusak',
      },
      explanation:
        'Kerusakan perangkat teknis kamar berdampak langsung pada kenyamanan fisik tamu.',
    };
  }

  // 4. RESERVATION CHANGE / EXTENSION (Requires PMS modification)
  if (
    lower.includes('ubah tanggal') ||
    lower.includes('perpanjang') ||
    lower.includes('reschedule') ||
    lower.includes('cancel') ||
    lower.includes('batal') ||
    lower.includes('ganti kamar') ||
    lower.includes('upgrade')
  ) {
    return {
      intent: 'reservation_change',
      intentName: 'Perubahan Data Reservasi & Jadwal',
      targetAgent: 'reservation',
      intentComplexity: 2, // x1 = 2 (as in paper)
      riskLevel: 0,        // x2 = 0 (low risk routine change)
      entities: {
        roomNumber: detectedRoom,
        guestName: guestContext?.guestName || 'Budi Santoso',
        date: '2026-09-30',
        item: 'Perubahan Jadwal Menginap',
      },
      explanation:
        'Permintaan perubahan reservasi dapat diproses oleh Agen Reservasi melalui integrasi PMS jika ketersediaan kamar mencukupi.',
    };
  }

  // 5. BILLING INQUIRY / FOLIO BREAKDOWN (Routine)
  if (
    lower.includes('rincian') ||
    lower.includes('total tagihan') ||
    lower.includes('cek bill') ||
    lower.includes('biaya') ||
    lower.includes('invoice') ||
    lower.includes('folio')
  ) {
    return {
      intent: 'billing_inquiry',
      intentName: 'Informasi Rincian Tagihan Kamar',
      targetAgent: 'billing',
      intentComplexity: 2,
      riskLevel: 0,
      entities: {
        roomNumber: detectedRoom,
        guestName: guestContext?.guestName || 'Budi Santoso',
      },
      explanation:
        'Pengecekan rincian transaksi normal yang dapat ditarik secara otomatis dari sistem POS dan PMS hotel.',
    };
  }

  // 6. HOUSEKEEPING AMENITY REQUEST (Extra towels, water, pillow)
  if (
    lower.includes('handuk') ||
    lower.includes('air mineral') ||
    lower.includes('bantal') ||
    lower.includes('sandal') ||
    lower.includes('sabun') ||
    lower.includes('sikat gigi') ||
    lower.includes('bersihkan kamar') ||
    lower.includes('makeup room')
  ) {
    return {
      intent: 'amenity_request',
      intentName: 'Permintaan Amenitas / Layanan Kamar',
      targetAgent: 'housekeeping',
      intentComplexity: 1,
      riskLevel: 0,
      entities: {
        roomNumber: detectedRoom,
        guestName: guestContext?.guestName || 'Budi Santoso',
        item: lower.includes('handuk')
          ? 'Handuk Mandi Ekstra'
          : lower.includes('air')
          ? 'Air Mineral Tambahan'
          : 'Amenitas Kamar',
      },
      explanation:
        'Permintaan operasional standar yang dapat langsung dibuatkan tiket tugas otomatis ke staf runner kamar.',
    };
  }

  // 7. CONCIERGE / TOURISM / LOCAL RECOMMENDATION
  if (
    lower.includes('wisata') ||
    lower.includes('restoran') ||
    lower.includes('makan') ||
    lower.includes('kuliner') ||
    lower.includes('rekomendasi') ||
    lower.includes('mall') ||
    lower.includes('taksi') ||
    lower.includes('bandara') ||
    lower.includes('tempat menarik')
  ) {
    return {
      intent: 'concierge_recommendation',
      intentName: 'Rekomendasi Wisata & Kuliner Lokal',
      targetAgent: 'concierge',
      intentComplexity: 2,
      riskLevel: 0,
      entities: {
        roomNumber: detectedRoom,
        guestName: guestContext?.guestName || 'Budi Santoso',
        facility: 'Local Tourism & Dining Guide',
      },
      explanation:
        'Pertanyaan rekomendasi seputar kota dan fasilitas sekitar, diproses oleh Agen Concierge berbasis Local Knowledge Base.',
    };
  }

  // 8. HOTEL POLICY / FAQ (Check-in/out hours, pool, gym, wifi)
  if (
    lower.includes('check-in') ||
    lower.includes('check in') ||
    lower.includes('check-out') ||
    lower.includes('checkout') ||
    lower.includes('kolam') ||
    lower.includes('pool') ||
    lower.includes('sarapan') ||
    lower.includes('breakfast') ||
    lower.includes('gym') ||
    lower.includes('wifi') ||
    lower.includes('spa') ||
    lower.includes('parkir')
  ) {
    return {
      intent: 'hotel_policy_faq',
      intentName: 'Informasi Kebijakan & Fasilitas Hotel',
      targetAgent: 'concierge',
      intentComplexity: 1, // x1 = 1 (as in paper)
      riskLevel: 0,        // x2 = 0
      entities: {
        roomNumber: detectedRoom,
        guestName: guestContext?.guestName || 'Budi Santoso',
        facility: lower.includes('check') ? 'Waktu Check-in/Out' : 'Fasilitas Hotel',
      },
      explanation:
        'Pertanyaan factual standar mengenai jam operasional dan fasilitas hotel. Tingkat kompleksitas rendah dan risiko nol.',
    };
  }

  // DEFAULT / GENERAL ASSISTANT
  return {
    intent: 'general_assistance',
    intentName: 'Bantuan Umum Customer Service',
    targetAgent: 'concierge',
    intentComplexity: 2,
    riskLevel: 0,
    entities: {
      roomNumber: detectedRoom,
      guestName: guestContext?.guestName || 'Budi Santoso',
    },
    explanation:
      'Pertanyaan umum yang ditangani oleh Agen Concierge untuk memberikan panduan layanan hotel.',
  };
}

// Mathematical Model: Logistic Regression with Sigmoid
// z = w1*x1 + w2*x2 + b
// P(Human | x) = 1 / (1 + exp(-z))
export function calculateLogisticRegression(
  x1: number,
  x2: number,
  params: LogisticRegressionParams = DEFAULT_LR_PARAMS
): LogisticRegressionResult {
  const { w1, w2, b, tau } = params;
  const z = w1 * x1 + w2 * x2 + b;
  const probability = 1 / (1 + Math.exp(-z));
  const needsHuman = probability > tau;

  const stepCalculation = `z = (${w1.toFixed(1)})(${x1}) + (${w2.toFixed(1)})(${x2}) + (${b.toFixed(1)}) = ${z.toFixed(3)}
P(Human | x) = 1 / (1 + e^(${-z.toFixed(3)})) = ${probability.toFixed(4)}
Keputusan: ${probability.toFixed(4)} ${needsHuman ? '>' : '<='} ${tau.toFixed(2)} -> ${needsHuman ? 'HUMAN ESCALATION (Staf Front Office)' : 'AGENT AUTONOMOUS REPLY'}`;

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

// Internal Cognitive Cycle & Execution for Specialized Agents (Section 9 of Document)
export function runSpecializedAgentCycle(
  agentType: AgentType,
  message: string,
  features: ExtractionFeatures,
  mlResult: LogisticRegressionResult,
  hotelData: {
    reservations: PMSReservation[];
    posTransactions: POSTransaction[];
    hkTickets: HousekeepingTicket[];
    escalationTickets: HumanEscalationTicket[];
  }
): {
  cycle: CognitiveCycle;
  responseText: string;
  createdTicket?: HousekeepingTicket;
  createdEscalation?: HumanEscalationTicket;
} {
  const roomNumber = features.entities.roomNumber || '802';
  const guestRes = hotelData.reservations.find((r) => r.roomNumber === roomNumber);
  const guestName = guestRes?.guestName || features.entities.guestName || 'Tamu Yang Terhormat';

  // CASE 1: ESCALATED TO HUMAN (P(Human|x) > tau)
  if (mlResult.needsHuman || agentType === 'human_escalation') {
    const escalationTicket: HumanEscalationTicket = {
      id: `ESC-${Date.now().toString().slice(-4)}`,
      roomNumber,
      guestName,
      customerMessage: message,
      probabilityScore: mlResult.probability,
      riskLevel: mlResult.x2,
      intentComplexity: mlResult.x1,
      detectedIntent: features.intent,
      assignedStaff: 'Rian Pratama (Duty Front Office Manager)',
      status: 'Awaiting Front Office',
      createdAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      resolutionNotes: `Otomatis dieskalasi oleh ML Gatekeeper (P=${(mlResult.probability * 100).toFixed(1)}% > ${mlResult.threshold * 100}%). Prioritas respon < 3 menit.`,
    };

    const cycle: CognitiveCycle = {
      goal: 'Melakukan eskalasi pesan berisiko tinggi / kompleks kepada Staf Front Office demi mencegah kesalahan dan menjamin kepuasan tamu.',
      belief: `Pesan customer memiliki tingkat risiko finansial/layanan (x1=${mlResult.x1}, x2=${mlResult.x2}) menghasilkan P(Human|x)=${mlResult.probability.toFixed(3)} di atas ambang batas tau=${mlResult.threshold}.`,
      perception: `Pesan diterima: "${message}". Intent terdeteksi: ${features.intentName}. Entitas teridentifikasi: Kamar ${roomNumber}, Tamu ${guestName}.`,
      reasoning:
        'Sesuai hotel policy & matriks risiko, bot dilarang menangani sengketa tagihan besar atau komplain layanan berat secara mandiri untuk menghindari halusinasi.',
      planning: [
        '1. Hentikan eksekusi otomatis bot.',
        '2. Bentuk tiket eskalasi dengan prioritas URGENT di Front Office Dashboard.',
        '3. Berikan pesan penenang dan notifikasi kepada tamu bahwa Duty Manager sedang mengambil alih percakapan.',
        '4. Hubungkan sesi chat langsung ke meja Front Desk staf.',
      ],
      intention: 'Menerbitkan tiket eskalasi Front Office dan mengalihkan penanganan ke Human Staff.',
      actions: [
        {
          toolName: 'FrontOffice.createEscalationTicket',
          system: 'StaffNotification',
          parameters: {
            ticketId: escalationTicket.id,
            room: roomNumber,
            guest: guestName,
            intent: features.intent,
            confidence: mlResult.probability,
          },
          resultSummary: `Tiket ${escalationTicket.id} berhasil dibuat dan diprioritaskan ke Duty Manager.`,
          executedAt: new Date().toLocaleTimeString('id-ID'),
        },
      ],
      feedbackLearning:
        'Status dialihkan ke Staf Manusia. Log percakapan disimpan untuk evaluasi model dan audit kepatuhan layanan.',
    };

    let responseText = '';
    if (features.intent === 'billing_dispute') {
      responseText = `Selamat siang Bapak/Ibu ${guestName}. Kami sangat memahami kekhawatiran Anda mengenai tagihan tersebut. Demi keamanan finansial dan akurasi data Anda, pesan ini telah langsung diteruskan ke Duty Front Office Manager kami (Bpk. Rian Pratama). Kami sedang membuka rincian transaksi POS/PMS Anda dan akan segera menghubungi Anda dalam 2 menit. Mohon kesediaannya menunggu sejenak.`;
    } else if (features.intent === 'housekeeping_complaint') {
      responseText = `Mohon maaf yang sebesar-besarnya atas ketidaknyamanan Anda di kamar ${roomNumber}, Bapak/Ibu ${guestName}. Keluhan Anda telah kami catat dengan status Prioritas Tertinggi dan diteruskan ke Supervisor Housekeeping kami saat ini juga. Tim kami sedang langsung bergerak ke kamar Anda untuk melakukan penanganan segera.`;
    } else {
      responseText = `Terima kasih telah menghubungi Customer Service Grand Horizon, Bapak/Ibu ${guestName}. Permintaan Anda memerlukan perhatian khusus dari staf kami. Duty Front Office kami telah menerima laporan ini dan akan segera melayani Anda secara langsung.`;
    }

    return { cycle, responseText, createdEscalation: escalationTicket };
  }

  // CASE 2: RESERVATION AGENT
  if (features.targetAgent === 'reservation') {
    const cycle: CognitiveCycle = {
      goal: 'Mengelola ketersediaan kamar, memeriksa data reservasi tamu di PMS, dan memproses perubahan jadwal booking.',
      belief: `Tamu terdaftar: ${guestName}, Kamar ${roomNumber} (${guestRes?.roomType || 'Executive Suite'}). Status: ${guestRes?.status || 'Active'}. Periode: ${guestRes?.checkIn} s/d ${guestRes?.checkOut}.`,
      perception: `Permintaan reservasi: "${message}". Intent: ${features.intentName}. Entitas tanggal: ${features.entities.date || 'Terkonfirmasi'}.`,
      reasoning:
        'Permintaan perubahan booking memiliki kompleksitas x1=2 dan risiko x2=0. Probabilitas P(Human|x) berada di bawah threshold, aman untuk diproses otomatis melalui API PMS.',
      planning: [
        '1. Query PMS dengan nomor kamar atau nama tamu.',
        '2. Verifikasi status reservasi dan kebijakan perubahan tanggal.',
        '3. Cek ketersediaan kamar pada tanggal yang diinginkan.',
        '4. Susun respon konfirmasi detail kepada tamu.',
      ],
      intention: 'Mengakses database PMS dan memberikan konfirmasi perubahan reservasi sesuai kebijakan hotel.',
      actions: [
        {
          toolName: 'PMS.getReservationDetails',
          system: 'PMS',
          parameters: { roomNumber, guestName },
          resultSummary: `Data ditemukan: Booking ${guestRes?.confirmationCode || 'GH-89021'}, Tipe ${guestRes?.roomType}, Checkout ${guestRes?.checkOut}.`,
          executedAt: new Date().toLocaleTimeString('id-ID'),
        },
        {
          toolName: 'PMS.checkRoomAvailability',
          system: 'PMS',
          parameters: { roomType: guestRes?.roomType || 'Executive Suite', targetDates: '2026-09-30 to 2026-10-02' },
          resultSummary: 'Ketersediaan kamar: 3 kamar tersedia, tarif sama tanpa penalti perubahan sebelum 24 jam.',
          executedAt: new Date().toLocaleTimeString('id-ID'),
        },
      ],
      feedbackLearning:
        'Tindakan berhasil diverifikasi dengan sistem PMS. State reservasi siap diperbarui begitu tamu memilih tanggal final.',
    };

    const responseText = `Halo Bapak/Ibu ${guestName}, saya dari Agen Reservasi Grand Horizon. Berdasarkan data PMS kami (Kode Booking: ${guestRes?.confirmationCode || 'GH-89021'}), Anda saat ini menginap di kamar ${roomNumber} (${guestRes?.roomType || 'Executive Suite'}) dengan jadwal check-out pada ${guestRes?.checkOut}. Ketersediaan kamar kami untuk penyesuaian tanggal atau perpanjangan menginap masih sangat tersedia. Apakah Anda ingin memajukan, memundurkan tanggal check-out, atau mengubah tipe kamar?`;

    return { cycle, responseText };
  }

  // CASE 3: HOUSEKEEPING & MAINTENANCE AGENT
  if (features.targetAgent === 'housekeeping') {
    const isMaintenance = features.intent === 'maintenance_issue';
    const isAmenity = features.intent === 'amenity_request';

    const newTicket: HousekeepingTicket = {
      id: `HK-${Date.now().toString().slice(-3)}`,
      roomNumber,
      guestName,
      category: isMaintenance ? 'Maintenance Repair' : isAmenity ? 'Amenities Refill' : 'Housekeeping Clean',
      priority: isMaintenance ? 'High' : 'Normal' as any,
      description: features.entities.item || message,
      status: 'Dispatched',
      assignedStaff: isMaintenance ? 'Agus Widodo (Engineering Duty)' : 'Bambang Irawan (Housekeeping Runner)',
      createdAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      targetMinutes: isMaintenance ? 25 : 15,
    };

    const cycle: CognitiveCycle = {
      goal: 'Menangani kebutuhan kebersihan kamar, amenitas tambahan, atau perbaikan fasilitas melalui Facility Management System.',
      belief: `Kamar ${roomNumber} aktif. Staf runner dan engineering standby. SLA pengantaran amenitas standar adalah 15-20 menit.`,
      perception: `Permintaan tamu: "${message}". Item: ${features.entities.item || 'Amenitas Kamar'}.`,
      reasoning:
        'Permintaan amenitas standar memiliki tingkat risiko x2=0 dan kompleksitas x1=1 (P(Human|x) rendah). Dapat langsung dieksekusi secara otomatis ke antrean kerja staf.',
      planning: [
        '1. Ekstraksi jenis barang/layanan yang diminta dari pesan.',
        '2. Panggil API Facility Management System untuk menerbitkan tiket kerja.',
        '3. Alokasikan staf runner terdekat di lantai terkait.',
        '4. Berikan estimasi waktu pengantaran yang akurat kepada tamu.',
      ],
      intention: `Menerbitkan tiket kerja ${newTicket.id} ke staf lapangan dan mengonfirmasi waktu penyelesaian kepada tamu.`,
      actions: [
        {
          toolName: 'FacilityManagement.dispatchTicket',
          system: 'FacilitySystem',
          parameters: {
            roomNumber,
            category: newTicket.category,
            item: features.entities.item,
            assignedTo: newTicket.assignedStaff,
          },
          resultSummary: `Tiket ${newTicket.id} berhasil dibuat. Petugas: ${newTicket.assignedStaff}. Estimasi tiba: ${newTicket.targetMinutes} menit.`,
          executedAt: new Date().toLocaleTimeString('id-ID'),
        },
      ],
      feedbackLearning:
        'Tiket aktif telah ditambahkan ke antrean operasional lantai. SLA timer diaktifkan untuk monitoring keterlambatan.',
    };

    let responseText = '';
    if (isAmenity) {
      responseText = `Baik Bapak/Ibu ${guestName}, permintaan ${features.entities.item || 'amenitas tambahan'} untuk kamar ${roomNumber} telah berhasil kami proses (No. Tiket: ${newTicket.id}). Petugas Housekeeping kami (${newTicket.assignedStaff}) sedang menyiapkan dan akan mengantarkannya langsung ke pintu kamar Anda dalam waktu sekitar 10-15 menit.`;
    } else {
      responseText = `Laporan Anda mengenai ${features.entities.item || 'layanan kamar'} di kamar ${roomNumber} telah kami teruskan ke tim fasilitas kami (No. Tiket: ${newTicket.id}). Tim teknisi/housekeeping segera menuju ke kamar Anda dalam waktu maksimal 20 menit.`;
    }

    return { cycle, responseText, createdTicket: newTicket };
  }

  // CASE 4: BILLING & POS AGENT
  if (features.targetAgent === 'billing') {
    const guestPos = hotelData.posTransactions.filter((p) => p.roomNumber === roomNumber);
    const subtotal = guestPos.reduce((sum, item) => sum + item.subtotal, 0);
    const tax = guestPos.reduce((sum, item) => sum + item.taxAndService, 0);
    const totalPos = guestPos.reduce((sum, item) => sum + item.total, 0);
    const roomRate = (guestRes?.ratePerNight || 2850000) * (guestRes?.nights || 2);
    const grandTotal = totalPos + roomRate;

    const cycle: CognitiveCycle = {
      goal: 'Mengambil data transaksi secara akurat dari sistem POS dan PMS untuk memberikan rincian tagihan transparan kepada tamu.',
      belief: `Kamar ${roomNumber} memiliki ${guestPos.length} transaksi POS tercatat di restoran, lounge, dan spa. Total tagihan saat ini: Rp ${grandTotal.toLocaleString('id-ID')}.`,
      perception: `Pesan tamu: "${message}". Intent: ${features.intentName}. Entitas kamar: ${roomNumber}.`,
      reasoning:
        'Pengecekan rincian tagihan rutin memiliki kompleksitas x1=2 dan risiko x2=0. Data ditarik langsung dari database POS/PMS tanpa modifikasi.',
      planning: [
        '1. Hubungkan ke Point of Sale (POS) API dengan filter kamar 802.',
        '2. Ambil seluruh transaksi posted ke kamar (Restoran, Lounge, Spa).',
        '3. Hitung subtotal, pajak & servis 21%, serta tarif kamar dari PMS.',
        '4. Format rincian menjadi ringkasan yang jelas dan mudah dipahami tamu.',
      ],
      intention: 'Menyajikan rincian tagihan transparan yang divalidasi langsung oleh sistem POS hotel.',
      actions: [
        {
          toolName: 'POS.getRoomTransactions',
          system: 'POS',
          parameters: { roomNumber },
          resultSummary: `Berhasil menarik ${guestPos.length} tagihan outlet (The Grand Brasserie, Lounge, Spa). Total POS: Rp ${totalPos.toLocaleString('id-ID')}.`,
          executedAt: new Date().toLocaleTimeString('id-ID'),
        },
        {
          toolName: 'PMS.getFolioBalance',
          system: 'PMS',
          parameters: { roomNumber, guestName },
          resultSummary: `Tarif kamar (${guestRes?.nights || 3} malam): Rp ${roomRate.toLocaleString('id-ID')}. Grand Total: Rp ${grandTotal.toLocaleString('id-ID')}.`,
          executedAt: new Date().toLocaleTimeString('id-ID'),
        },
      ],
      feedbackLearning:
        'Data disinkronkan secara real-time dari database POS/PMS. Jika tamu mendapati kejanggalan, alur eskalasi siap diaktifkan.',
    };

    const posSummaryList = guestPos
      .map((p) => `• ${p.department}: Rp ${p.total.toLocaleString('id-ID')} (${p.timestamp})`)
      .join('\n');

    const responseText = `Halo Bapak/Ibu ${guestName}, berikut adalah ringkasan rincian tagihan kamar ${roomNumber} saat ini yang tercatat di sistem POS & PMS kami:

• Biaya Kamar (${guestRes?.roomType || 'Executive Suite'} - ${guestRes?.nights || 3} Malam): Rp ${roomRate.toLocaleString('id-ID')}
${posSummaryList}
----------------------------------------
Total Akumulasi Sementara: Rp ${grandTotal.toLocaleString('id-ID')} (Termasuk Pajak & Servis 21%).

Apakah Anda memerlukan rincian per invoice atau ingin melakukan pembayaran saat check-out nanti?`;

    return { cycle, responseText };
  }

  // CASE 5: CONCIERGE & LOCAL KNOWLEDGE AGENT
  const cycle: CognitiveCycle = {
    goal: 'Mengolah basis pengetahuan lokal dan direktori hotel untuk memberikan rekomendasi wisata, kuliner, dan informasi fasilitas terbaik.',
    belief: `Grand Horizon Hotel memiliki fasilitas lengkap (Sky Pool Lt. 8, Spa Lt. 7, Brasserie Lt. 1). Pengetahuan lokal mencakup destinasi wisata & kuliner radius 5km.`,
    perception: `Pertanyaan tamu: "${message}". Intent: ${features.intentName}. Entitas fasilitas: ${features.entities.facility || 'Informasi Fasilitas/Wisata'}.`,
    reasoning:
      'Pertanyaan seputar jam operasional fasilitas hotel atau rekomendasi wisata merupakan ranah Concierge dengan risiko rendah (x1=1-2, x2=0). Menggunakan Local Knowledge Base.',
    planning: [
      '1. Analisis kata kunci pertanyaan (jam check-in/out, pool, sarapan, wisata).',
      '2. Query Local Knowledge Base & Facilities Database.',
      '3. Rangkum informasi dengan gaya bahasa ramah, hangat, dan informatif khas hospitality bintang lima.',
    ],
    intention: 'Menyajikan informasi fasilitas hotel atau rekomendasi lokal yang akurat dan berkelas.',
    actions: [
      {
        toolName: 'KnowledgeBase.searchFacilityInfo',
        system: 'KnowledgeBase',
        parameters: { query: message, language: 'id' },
        resultSummary: 'Informasi berhasil diambil dari direktori operasional hotel & database concierge.',
        executedAt: new Date().toLocaleTimeString('id-ID'),
      },
    ],
    feedbackLearning:
      'Respons diberikan dengan perceived warmth yang tinggi sesuai prinsip customer satisfaction hotel.',
  };

  let responseText = '';
  const lowerMsg = message.toLowerCase();

  if (lowerMsg.includes('check-in') || lowerMsg.includes('check in') || lowerMsg.includes('checkout') || lowerMsg.includes('check-out')) {
    responseText = `Waktu check-in standar di Grand Horizon adalah pukul ${HOTEL_AMENITIES_INFO.checkInTime}, dan waktu check-out adalah pukul ${HOTEL_AMENITIES_INFO.checkOutTime}. Jika Anda memerlukan early check-in atau late check-out, staf front desk kami akan dengan senang hati membantu menyesuaikan dengan ketersediaan kamar pada hari tersebut.`;
  } else if (lowerMsg.includes('sarapan') || lowerMsg.includes('breakfast')) {
    responseText = `Sarapan prasmanan lezat kami disajikan di ${HOTEL_AMENITIES_INFO.breakfast}. Menyajikan aneka masakan Nusantara, sajian Western hangat, pastry segar, dan counter jus sehat langsung dibuat.`;
  } else if (lowerMsg.includes('kolam') || lowerMsg.includes('pool')) {
    responseText = `Fasilitas ${HOTEL_AMENITIES_INFO.swimmingPool} dengan pemandangan cakrawala kota yang menakjubkan. Handuk kolam dan minuman segar tersedia di poolside bar kami.`;
  } else if (lowerMsg.includes('wisata') || lowerMsg.includes('restoran') || lowerMsg.includes('makan') || lowerMsg.includes('kuliner')) {
    const guide1 = LOCAL_TOURISM_GUIDE[0];
    const guide2 = LOCAL_TOURISM_GUIDE[2];
    responseText = `Dengan senang hati, Bapak/Ibu ${guestName}! Berikut dua rekomendasi istimewa di sekitar hotel:

1. ${guide2.name} (${guide2.category}) - ${guide2.distance}
${guide2.tips}

2. ${guide1.name} (${guide1.category}) - ${guide1.distance}
${guide1.tips}

Jika Anda ingin kami membuatkan reservasi meja di restoran atau memesankan taksi hotel, silakan beri tahu kami!`;
  } else {
    responseText = `Halo Bapak/Ibu ${guestName}, terima kasih telah menghubungi Concierge Grand Horizon. Kami siap membantu Anda seputar fasilitas hotel (Sky Pool Lt. 8, The Horizon Spa Lt. 7, Restoran Brasserie Lt. 1) maupun rekomendasi transportasi dan wisata lokal. Ada yang bisa kami bantu jelaskan lebih lanjut?`;
  }

  return { cycle, responseText };
}
