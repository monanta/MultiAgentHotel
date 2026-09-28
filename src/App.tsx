/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { SimpleAgentView } from './components/SimpleAgentView';
import {
  INITIAL_PMS_RESERVATIONS,
  INITIAL_POS_TRANSACTIONS,
  INITIAL_HOUSEKEEPING_TICKETS,
  INITIAL_ESCALATION_TICKETS,
} from './data/mockHotelData';
import {
  PMSReservation,
  POSTransaction,
  HousekeepingTicket,
  HumanEscalationTicket,
  ChatMessage,
} from './types/hotel';

export default function App() {
  const [reservations] = useState<PMSReservation[]>(INITIAL_PMS_RESERVATIONS);
  const [posTransactions] = useState<POSTransaction[]>(INITIAL_POS_TRANSACTIONS);
  const [housekeepingTickets, setHousekeepingTickets] = useState<HousekeepingTicket[]>(
    INITIAL_HOUSEKEEPING_TICKETS
  );
  const [escalationTickets, setEscalationTickets] = useState<HumanEscalationTicket[]>(
    INITIAL_ESCALATION_TICKETS
  );

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'agent',
      channel: 'whatsapp',
      text: `Halo ${INITIAL_PMS_RESERVATIONS[0].guestName}, selamat datang di Grand Horizon Hotel. Layanan Customer Service kami siap membantu Anda 24 jam.`,
      timestamp: '11:00',
    },
  ]);

  const handleAddHousekeepingTicket = (ticket: HousekeepingTicket) => {
    setHousekeepingTickets((prev) => [ticket, ...prev]);
  };

  const handleAddEscalationTicket = (ticket: HumanEscalationTicket) => {
    setEscalationTickets((prev) => [ticket, ...prev]);
  };

  const handleResolveEscalation = (id: string, notes: string) => {
    setEscalationTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'Resolved', resolutionNotes: notes } : t))
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-4">
        <SimpleAgentView
          reservations={reservations}
          posTransactions={posTransactions}
          housekeepingTickets={housekeepingTickets}
          escalationTickets={escalationTickets}
          onAddHousekeepingTicket={handleAddHousekeepingTicket}
          onAddEscalationTicket={handleAddEscalationTicket}
          onResolveEscalation={handleResolveEscalation}
          messages={messages}
          setMessages={setMessages}
        />
      </main>
    </div>
  );
}
