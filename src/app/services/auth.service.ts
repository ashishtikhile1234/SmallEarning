import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthResponse, AuthUser, LoginRequest, RegisterRequest } from '../models/auth.model';

const API_BASE = 'http://localhost:8080/api';
const TOKEN_KEY = 'gb_token';
const USER_KEY  = 'gb_user';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private _user = signal<AuthUser | null>(this.loadUserFromStorage());

  // Public readable signals
  currentUser = this._user.asReadonly();
  isLoggedIn  = computed(() => this._user() !== null);
  isStudent   = computed(() => this._user()?.role === 'STUDENT');
  isEmployer  = computed(() => this._user()?.role === 'EMPLOYER');

  constructor(private http: HttpClient, private router: Router) {}

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_BASE}/auth/register`, request).pipe(
      tap(res => this.saveSession(res))
    );
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_BASE}/auth/login`, request).pipe(
      tap(res => this.saveSession(res))
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this._user.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  private saveSession(res: AuthResponse): void {
    const user: AuthUser = {
      token:  res.token,
      userId: res.userId,
      name:   res.name,
      email:  res.email,
      role:   res.role,
    };
    localStorage.setItem(TOKEN_KEY, res.token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this._user.set(user);
  }

  private loadUserFromStorage(): AuthUser | null {
    try {
      const stored = localStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }
}
