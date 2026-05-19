export type MessageRole = "user" | "assistant";

export interface ChatMessage {
  role: MessageRole;
  content: string;
}

export interface PropertyData {
  propertyType?: string;
  annualElectricityBill?: number;
  occupants?: number;
  heatingSystem?: string;
  interest?: string;
}

export interface ChatApiResponse {
  reply: string;
  complete: boolean;
  data?: PropertyData;
}
