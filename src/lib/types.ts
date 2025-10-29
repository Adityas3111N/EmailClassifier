export interface Email {
  id: string;
  subject: string;
  from: string;
  date: string;
  body: string;
  snippet: string;
  category?: string;
}

export interface ClassifiedEmail extends Email {
  category: string;
}

export type EmailCategory = 
  | "Important" 
  | "Promotions" 
  | "Social" 
  | "Marketing" 
  | "Spam" 
  | "General";