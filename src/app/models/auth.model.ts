// ─── Auth Models ────────────────────────────────────────────────────────────

export type UserRole = 'STUDENT' | 'EMPLOYER';

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  userId: number;
  name: string;
  email: string;
  role: UserRole;
  message: string;
}

export interface AuthUser {
  token: string;
  userId: number;
  name: string;
  email: string;
  role: UserRole;
}
