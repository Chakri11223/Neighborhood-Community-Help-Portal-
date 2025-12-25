import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface HelpRequest {
  id: number;
  resident_id: number;
  helper_id?: number;
  title: string;
  description: string;
  category: string;
  status: 'Pending' | 'Accepted' | 'In-progress' | 'Completed';
  attachments?: string;
  created_at: string;
  updated_at?: string;
  resident_name?: string;
  helper_name?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  private apiUrl = 'http://localhost:3000/api/requests';

  constructor(private http: HttpClient) { }

  createRequest(requestData: any): Observable<{ message: string, request: HelpRequest }> {
    return this.http.post<{ message: string, request: HelpRequest }>(this.apiUrl, requestData);
  }

  getAllRequests(filters?: any): Observable<{ requests: HelpRequest[] }> {
    let params = new HttpParams();
    if (filters) {
      if (filters.status) params = params.set('status', filters.status);
      if (filters.category) params = params.set('category', filters.category);
    }
    return this.http.get<{ requests: HelpRequest[] }>(this.apiUrl, { params });
  }

  getMyRequests(): Observable<{ requests: HelpRequest[] }> {
    return this.http.get<{ requests: HelpRequest[] }>(`${this.apiUrl}/my-requests`);
  }

  getRequestById(id: number): Observable<{ request: HelpRequest }> {
    return this.http.get<{ request: HelpRequest }>(`${this.apiUrl}/${id}`);
  }

  updateRequestStatus(id: number, status: string): Observable<{ message: string, request: HelpRequest }> {
    return this.http.patch<{ message: string, request: HelpRequest }>(`${this.apiUrl}/${id}/status`, { status });
  }

  deleteRequest(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
