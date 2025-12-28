import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'Resident' | 'Helper' | 'Admin';
  contact_info?: string; // Optional per requirements
  location?: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.loadUserFromStorage();
  }

  // Load user from local storage on app start
  private loadUserFromStorage() {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    // Only verify logged in if BOTH token and user data exist
    if (user && token) {
      try {
        this.currentUserSubject.next(JSON.parse(user));
      } catch (e) {
        // Handle corrupted JSON
        this.logout();
      }
    } else {
      // Clear inconsistent state silently
      this.logout(false);
    }
  }

  register(userData: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData).pipe(
      tap(response => this.handleAuthSuccess(response))
    );
  }

  login(credentials: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => this.handleAuthSuccess(response))
    );
  }

  switchRole(newRole: string): Observable<AuthResponse> {
    return this.http.put<AuthResponse>(`${this.apiUrl}/role`, { role: newRole }).pipe(
      tap(response => this.handleAuthSuccess(response)) 
    );
  }

  updateUser(userId: number, data: any): Observable<any> {
    const userUrl = 'http://localhost:3000/api/users';
    return this.http.put<any>(`${userUrl}/${userId}`, data).pipe(
      tap(response => {
        if (response.user) {
          // Update local storage and behavior subject
          localStorage.setItem('user', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
        }
      })
    );
  }

  logout(redirectToLogin: boolean = true) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    if (redirectToLogin) {
      this.router.navigate(['/login']);
    }
  }

  private handleAuthSuccess(response: AuthResponse) {
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    this.currentUserSubject.next(response.user);
  }

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  get isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  hasRole(role: string): boolean {
    const user = this.currentUserValue;
    return user ? user.role === role : false;
  }
}
