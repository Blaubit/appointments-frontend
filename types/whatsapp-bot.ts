export type FlowStatus = "active" | "draft" | "inactive";
export type FlowCategory =
  | "appointment"
  | "information"
  | "support"
  | "cancellation"
  | "general";
export type MessageType =
  | "text"
  | "interactive"
  | "confirmation"
  | "success"
  | "error";
export type MessageCategory =
  | "greeting"
  | "appointment"
  | "information"
  | "support"
  | "farewell";
export type ConversationStatus =
  | "completed"
  | "in_progress"
  | "abandoned"
  | "waiting";

export interface BotFlow {
  id: string;
  name: string;
  description: string;
  trigger: string;
  status: FlowStatus;
  category: FlowCategory;
  steps: number;
  completionRate: number;
  totalUses: number;
  lastUsed: string | null;
  createdAt: string;
  updatedAt: string;
  messages: string[];
  isDefault: boolean;
  priority: number;
}

export interface BotMessage {
  id: string;
  name: string;
  title: string;
  content: string;
  type: MessageType;
  variables: string[];
  category: MessageCategory;
  usedInFlows: string[];
  lastModified: string;
  createdAt: string;
  isActive: boolean;
  language: string;
}

export interface BotConversation {
  id: string;
  contact: {
    name: string;
    phone: string;
    avatar?: string;
  };
  lastMessage: string;
  timestamp: string;
  status: ConversationStatus;
  flow: string;
  appointmentId: string | null;
  messagesCount: number;
  duration: number;
  satisfaction?: number;
}

export interface BotStats {
  totalMessages: number;
  messagesThisMonth: number;
  messagesThisWeek: number;
  messagesToday: number;
  activeChats: number;
  appointmentsBooked: number;
  appointmentsThisMonth: number;
  responseRate: number;
  averageResponseTime: string;
  conversionRate: number;
  totalFlows: number;
  activeFlows: number;
  totalMessageTemplates: number;
  monthlyGrowth: number;
  satisfactionScore: number;
  completedConversations: number;
  abandonedConversations: number;
}

export interface BotConfig {
  id: string;
  name: string;
  phoneNumber: string;
  status: "connected" | "disconnected" | "connecting";
  qrCode: string;
  autoReply: boolean;
  welcomeMessage: string;
  workingHours: {
    enabled: boolean;
    start: string;
    end: string;
    timezone: string;
    days: string[];
  };
  outOfHoursMessage: string;
  maxResponseTime: number;
  language: string;
  createdAt: string;
  updatedAt: string;
}

export interface BotFilters {
  search?: string;
  status?: FlowStatus;
  category?: FlowCategory;
  messageType?: MessageType;
  conversationStatus?: ConversationStatus;
  dateRange?: {
    from: string;
    to: string;
  };
}

export interface BotFormData {
  name: string;
  description: string;
  trigger: string;
  category: FlowCategory;
  messages: string[];
  priority: number;
}

export interface MessageFormData {
  name: string;
  title: string;
  content: string;
  type: MessageType;
  category: MessageCategory;
  variables: string[];
  language: string;
}
