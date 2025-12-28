import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ChatMessage {
  id?: number;
  request_id: number;
  sender_id: number;
  content: string;
  timestamp?: Date;
  sender_name?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'http://localhost:3000/api/chat';

  constructor(private http: HttpClient) { }

  getMessages(requestId: number): Observable<{ messages: ChatMessage[] }> {
    return this.http.get<{ messages: ChatMessage[] }>(`${this.apiUrl}/${requestId}`);
  }

  sendMessage(requestId: number, content: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${requestId}`, { content });
  }
}
