export type ToolType =
  | 'website'
  | 'presentation'
  | 'spreadsheet'
  | 'document'
  | 'pdf';

export type MessageRole = 'user' | 'assistant';

export interface Message {
  role: MessageRole;
  content: string;
  fileUrl?: string;
}

export interface PreviewState {
  type: 'html' | 'file';
  content?: string;
  fileUrl?: string;
  fileName?: string;
}

export interface Project {
  id: string;
  user_id: string;
  title: string;
  type: ToolType;
  prompt: string;
  file_url?: string;
  html_content?: string;
  messages: Message[];
  created_at: string;
  updated_at: string;
}
