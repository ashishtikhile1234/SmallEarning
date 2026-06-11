import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-bg">
        <span class="float-emoji" style="top:10%;left:8%;animation-delay:0s">🎉</span>
        <span class="float-emoji" style="top:20%;right:10%;animation-delay:0.5s">☕</span>
        <span class="float-emoji" style="bottom:20%;left:12%;animation-delay:1s">📚</span>
        <span class="float-emoji" style="bottom:15%;right:8%;animation-delay:1.5s">🛍️</span>
        <span class="float-emoji" style="top:50%;left:5%;animation-delay:2s">💰</span>
      </div>

      <div class="auth-card">
        <div class="auth-logo">
          <span class="logo-emoji">🎯</span>
          <h1>GigBuddy</h1>
          <p>Welcome back! Log in to find your next gig 🚀</p>
        </div>

        <form class="auth-form" (ngSubmit)="onLogin()">
          <div class="form-group">
            <label>📧 Email</label>
            <input
              type="email"
              [(ngModel)]="email"
              name="email"
              placeholder="your@email.com"
              required
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label>🔒 Password</label>
            <input
              type="password"
              [(ngModel)]="password"
              name="password"
              placeholder="Enter your password"
              required
              class="form-input"
            />
          </div>

          @if (errorMsg()) {
            <div class="error-banner">⚠️ {{ errorMsg() }}</div>
          }

          <button type="submit" class="btn-primary" [disabled]="loading()">
            {{ loading() ? '⏳ Logging in...' : '🚀 Login' }}
          </button>
        </form>

        <div class="auth-footer">
          <p>New to GigBuddy? <a routerLink="/signup">Create account 🎊</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: 100dvh;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
      display: flex; align-items: center; justify-content: center;
      padding: 1rem; position: relative; overflow: hidden;
      font-family: 'Nunito', sans-serif;
    }
    .auth-bg { position: absolute; inset: 0; pointer-events: none; }
    .float-emoji {
      position: absolute; font-size: 2rem; opacity: 0.15;
      animation: floatBg 4s ease-in-out infinite alternate;
    }
    @keyframes floatBg {
      from { transform: translateY(0) rotate(-5deg); }
      to   { transform: translateY(-20px) rotate(5deg); }
    }
    .auth-card {
      background: rgba(255,255,255,0.05);
      backdrop-filter: blur(20px);
      border: 2px solid rgba(255,255,255,0.1);
      border-radius: 28px;
      padding: 2.5rem 2rem;
      width: 100%; max-width: 420px;
      box-shadow: 0 25px 60px rgba(0,0,0,0.5);
    }
    .auth-logo { text-align: center; margin-bottom: 2rem; }
    .logo-emoji { font-size: 3rem; display: block; margin-bottom: 0.5rem; }
    .auth-logo h1 {
      font-family: 'Fredoka One', cursive;
      color: #FFD93D; font-size: 2rem; margin: 0;
    }
    .auth-logo p { color: rgba(255,255,255,0.6); margin: 0.5rem 0 0; font-size: 0.9rem; }
    .auth-form { display: flex; flex-direction: column; gap: 1.2rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
    .form-group label { color: rgba(255,255,255,0.8); font-size: 0.85rem; font-weight: 700; }
    .form-input {
      background: rgba(255,255,255,0.08);
      border: 2px solid rgba(255,255,255,0.15);
      border-radius: 14px; padding: 0.8rem 1rem;
      color: #fff; font-size: 1rem; font-family: inherit;
      transition: border-color 0.2s;
      outline: none;
    }
    .form-input:focus { border-color: #FFD93D; background: rgba(255,255,255,0.12); }
    .form-input::placeholder { color: rgba(255,255,255,0.35); }
    .error-banner {
      background: rgba(255,107,107,0.2); border: 2px solid #FF6B6B;
      border-radius: 12px; padding: 0.7rem 1rem;
      color: #FF6B6B; font-size: 0.85rem; font-weight: 600;
    }
    .btn-primary {
      background: linear-gradient(135deg, #FFD93D, #FF9F43);
      border: none; border-radius: 16px; padding: 0.9rem;
      font-family: 'Fredoka One', cursive; font-size: 1.1rem;
      color: #1a1a2e; cursor: pointer; font-weight: 700;
      transition: transform 0.2s, opacity 0.2s;
      margin-top: 0.5rem;
    }
    .btn-primary:hover:not(:disabled) { transform: scale(1.03); }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
    .auth-footer { text-align: center; margin-top: 1.5rem; }
    .auth-footer p { color: rgba(255,255,255,0.5); font-size: 0.9rem; }
    .auth-footer a { color: #6BCB77; font-weight: 700; text-decoration: none; }
    .auth-footer a:hover { text-decoration: underline; }
  `]
})
export class LoginComponent {
  email    = '';
  password = '';
  loading  = signal(false);
  errorMsg = signal('');

  constructor(private auth: AuthService, private router: Router) {}

  onLogin(): void {
    this.errorMsg.set('');
    this.loading.set(true);

    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => {
        this.errorMsg.set(err.error?.message || 'Login failed. Check your credentials.');
        this.loading.set(false);
      }
    });
  }
}
