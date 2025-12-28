export interface User {
  id?: number;
  name: string;
  email: string;
  password?: string;
  contact_info?: string;
  location?: string;
  role: 'Resident' | 'Helper' | 'Admin';
  created_at?: Date;
}

export interface HelpRequest {
  id?: number;
  resident_id: number;
  helper_id?: number;
  title: string;
  description: string;
  category: string;
  status: 'Pending' | 'Accepted' | 'In-progress' | 'Completed';
  attachments?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface Message {
  id?: number;
  request_id: number;
  sender_id: number;
  content: string;
  timestamp?: Date;
  sender_name?: string;
}

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  contact_info?: string;
  location?: string;
  role: 'Resident' | 'Helper' | 'Admin';
}

export interface UpdateRequestStatus {
  status: 'Pending' | 'Accepted' | 'In-progress' | 'Completed';
  helper_id?: number;
}

export interface CreateHelpRequest {
  title: string;
  description: string;
  category: string;
  attachments?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        role: string;
      };
    }
  }
}