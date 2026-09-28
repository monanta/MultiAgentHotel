export type SenderType = 'guest' | 'agent' | 'human';

export type AgentRole = 'orchestrator' | 'concierge' | 'reservation' | 'housekeeping' | 'billing' | 'human';

export interface ChatMessage {
  id: string;
  sender: SenderType;
  senderName: string;
  text: string;
  time: string;
  agentRole?: AgentRole;
  isEscalated?: boolean;
}

export interface AgentResult {
  agentRole: AgentRole;
  agentName: string;
  reply: string;
  isEscalated: boolean;
  reason?: string;
}

export interface EscalationTicket {
  id: string;
  guestMessage: string;
  time: string;
  status: 'pending' | 'resolved';
  humanReply?: string;
}
