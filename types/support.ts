export type TicketStatus =
  | "open"
  | "in_progress"
  | "waiting_response"
  | "resolved"
  | "closed";

export type TicketPriority = "low" | "medium" | "high" | "urgent";

export type TicketCategory =
  | "technical_issue"
  | "billing"
  | "feature_request"
  | "bug_report"
  | "account_access"
  | "training"
  | "other";

export interface TicketComment {
  id: string;
  ticketId: string;
  authorId: string;
  authorName: string;
  authorRole: "user" | "support_agent" | "admin";
  content: string;
  isInternal: boolean;
  attachments?: TicketAttachment[];
  createdAt: string;
  updatedAt: string;
}

export interface TicketAttachment {
  id: string;
  ticketId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  fileUrl: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  userId: string;
  userName: string;
  userEmail: string;
  assignedToId?: string;
  assignedToName?: string;
  companyId: string;
  companyName: string;
  attachments: TicketAttachment[];
  comments: TicketComment[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  closedAt?: string;
  lastResponseAt?: string;
  responseTime?: number; // in minutes
  resolutionTime?: number; // in minutes
}

export interface CreateTicketData {
  title: string;
  description: string;
  priority: TicketPriority;
  category: TicketCategory;
  attachments?: File[];
}

export interface TicketFilters {
  search: string;
  status: TicketStatus | "all";
  priority: TicketPriority | "all";
  category: TicketCategory | "all";
  sortBy: "created" | "updated" | "priority";
  sortOrder: "asc" | "desc";
}

export interface TicketStats {
  total: number;
  open: number;
  inProgress: number;
  waitingResponse: number;
  resolved: number;
  closed: number;
  averageResponseTime: number;
  averageResolutionTime: number;
  satisfactionScore: number;
}

export const TICKET_STATUS_LABELS: Record<TicketStatus, string> = {
  open: "Abierto",
  in_progress: "En Progreso",
  waiting_response: "Esperando Respuesta",
  resolved: "Resuelto",
  closed: "Cerrado",
};

export const TICKET_PRIORITY_LABELS: Record<TicketPriority, string> = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
  urgent: "Urgente",
};

export const TICKET_CATEGORY_LABELS: Record<TicketCategory, string> = {
  technical_issue: "Problema Técnico",
  billing: "Facturación",
  feature_request: "Solicitud de Función",
  bug_report: "Reporte de Error",
  account_access: "Acceso a Cuenta",
  training: "Capacitación",
  other: "Otro",
};
