export type ChannelType = 'whatsapp' | 'in_room_tablet' | 'web_widget';

export type AgentType =
  | 'orchestrator'
  | 'reservation'
  | 'concierge'
  | 'housekeeping'
  | 'billing'
  | 'human_escalation';

export interface ChatMessage {
  id: string;
  sender: 'guest' | 'agent' | 'human_staff' | 'system';
  agentSource?: AgentType;
  channel: ChannelType;
  text: string;
  timestamp: string;
  metadata?: {
    intent?: string;
    intentComplexity?: number;
    riskLevel?: number;
    probabilityHuman?: number;
    decision?: 'agent' | 'human_escalation';
    roomNumber?: string;
    guestName?: string;
    ticketId?: string;
    toolUsed?: string;
  };
}

export interface ExtractionFeatures {
  intent: string;
  intentName: string;
  targetAgent: AgentType;
  intentComplexity: number; // x1: 1 (simple) to 5 (complex)
  riskLevel: number; // x2: 0 (low/zero) to 2 (high risk dispute/safety)
  entities: {
    roomNumber?: string;
    guestName?: string;
    date?: string;
    amount?: number;
    item?: string;
    facility?: string;
  };
  explanation: string;
}

export interface LogisticRegressionParams {
  w1: number; // default 0.8
  w2: number; // default 2.0
  b: number;  // default -2.0
  tau: number; // default 0.80
}

export interface LogisticRegressionResult {
  x1: number;
  x2: number;
  w1: number;
  w2: number;
  b: number;
  z: number;
  probability: number;
  threshold: number;
  needsHuman: boolean;
  stepCalculation: string;
}

export interface ActionToolRecord {
  toolName: string;
  system: 'PMS' | 'POS' | 'KnowledgeBase' | 'FacilitySystem' | 'StaffNotification';
  parameters: Record<string, any>;
  resultSummary: string;
  executedAt: string;
}

export interface CognitiveCycle {
  goal: string;
  belief: string;
  perception: string;
  reasoning: string;
  planning: string[];
  intention: string;
  actions: ActionToolRecord[];
  feedbackLearning: string;
}

export interface OrchestrationLog {
  id: string;
  timestamp: string;
  channel: ChannelType;
  guestMessage: string;
  guestName: string;
  roomNumber: string;
  features: ExtractionFeatures;
  mlResult: LogisticRegressionResult;
  selectedAgent: AgentType;
  cognitiveCycle?: CognitiveCycle;
  finalResponse: string;
  status: 'completed' | 'escalated_to_human' | 'in_progress';
}

export interface PMSReservation {
  id: string;
  confirmationCode: string;
  guestName: string;
  roomNumber: string;
  roomType: 'Deluxe King' | 'Executive Suite' | 'Grand Horizon Suite' | 'Family Panoramic';
  checkIn: string;
  checkOut: string;
  nights: number;
  status: 'Checked In' | 'Confirmed' | 'Checked Out';
  ratePerNight: number;
  specialRequests?: string;
}

export interface POSTransaction {
  id: string;
  roomNumber: string;
  guestName: string;
  department: 'The Grand Brasserie' | 'Lobby Lounge & Bar' | 'In-Room Dining' | 'The Horizon Spa';
  items: { name: string; quantity: number; price: number }[];
  subtotal: number;
  taxAndService: number; // 21% standard hospitality tax & service
  total: number;
  timestamp: string;
  status: 'Posted to Room' | 'Settled' | 'Disputed';
}

export interface HousekeepingTicket {
  id: string;
  roomNumber: string;
  guestName: string;
  category: 'Housekeeping Clean' | 'Amenities Refill' | 'Maintenance Repair' | 'Special Request';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  description: string;
  status: 'Open' | 'Dispatched' | 'In Progress' | 'Resolved';
  assignedStaff: string;
  createdAt: string;
  targetMinutes: number;
}

export interface HumanEscalationTicket {
  id: string;
  roomNumber: string;
  guestName: string;
  customerMessage: string;
  probabilityScore: number;
  riskLevel: number;
  intentComplexity: number;
  detectedIntent: string;
  assignedStaff: string;
  status: 'Awaiting Front Office' | 'Staff Attending' | 'Resolved';
  createdAt: string;
  resolutionNotes?: string;
}
