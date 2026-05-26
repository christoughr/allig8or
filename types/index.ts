export type ToolType =
  | 'presentation'
  | 'spreadsheet'
  | 'document'
  | 'website'
  | 'pdf';

export interface Project {
  id: string;
  user_id: string;
  title: string;
  type: ToolType;
  prompt: string;
  file_url?: string;
  html_content?: string;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  created_at: string;
  updated_at: string;
}
