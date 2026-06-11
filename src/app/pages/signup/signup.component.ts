import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserRole } from '../../models/auth.model';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-bg">
        <span class="float-emoji" style="top:8%;left:6%;animation-delay:0s">🎊</span>
        <span class="float-emoji" style="top:15%;right:8%;animation-delay:0.8s">📚</span>
        <span class="float-emoji" style="bottom:25%;left:10%;animation-delay:1.2s">☕</span>
        <span class="float-emoji" style="bottom:12%;right:6%;animation-delay:2s">🏆</span>
        <span class="float-emoji" style="top:45%;right:5%;animation-delay:0.4s">🚀</span>
      </div>

      <div class="auth-card">
        <div class="auth-logo">
          <span class="logo-emoji">🎉</span>
          <h1>Join GigBuddy!</h1>
          <p>Find gigs or hire students — your choice! 🌟</p>
        </div>

        <!-- Role Selector -->
        <div class="role-selector">
          <button
            class="role-btn"
            [class.active]="role === 'STUDENT'"
            type="button"
            (click)="role = 'STUDENT'"
          >
            🎓 I'm a Student
          </button>
          <button
            class="role-btn"
            [class.active]="role === 'EMPLOYER'"
            type="button"
            (click)="role = 'EMPLOYER'"
          >
            🏪 I'm an Employer
          </button>
        </div>

        <form class="auth-form" (ngSubmit)="onSignup()">
          <div class="form-group">
            <label>👤 Full Name</label>
            <input type="text" [(ngModel)]="name" name="name" placeholder="Your full name" required class="form-input"/>
          </div>
          <div class="form-group">
            <label>📧 Email</label>
            <input type="email" [(ngModel)]="email" name="email" placeholder="your@email.com" required class="form-input"/>
          </div>
          <div class="form-group">
            <label>🔒 Password</label>
            <input type="password" [(ngModel)]="password" name="password" placeholder="Min. 6 characters" required class="form-input"/>
          </div>

          @if (errorMsg()) {
            <div class="error-banner">⚠️ {{ errorMsg() }}</div>
          }

          <button type="submit" class="btn-primary" [disabled]="loading()">
            {{ loading() ? '⏳ Creating account...' : '🎊 Create Account' }}
          </button>
        </form>

        <div class="auth-footer">
          <p>Already have an account? <a routerLink="/login">Log in 🚀</a></p>
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
      border-radius: 28px; padding: 2.5rem 2rem;
      width: 100%; max-width: 420px;
      box-shadow: 0 25px 60px rgba(0,0,0,0.5);
    }
    .auth-logo { text-align: center; margin-bottom: 1.5rem; }
    .logo-emoji { font-size: 3rem; display: block; margin-bottom: 0.5rem; }
    .auth-logo h1 {
      font-family: 'Fredoka One', cursive;
      color: #6BCB77; font-size: 2rem; margin: 0;
    }
    .auth-logo p { color: rgba(255,255,255,0.6); margin: 0.5rem 0 0; font-size: 0.9rem; }
    .role-selector {
      display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; margin-bottom: 1.5rem;
    }
    .role-btn {
      background: rgba(255,255,255,0.06);
      border: 2px solid rgba(255,255,255,0.15);
      border-radius: 14px; padding: 0.8rem 0.5rem;
      color: rgba(255,255,255,0.6); font-family: 'Nunito', sans-serif;
      font-size: 0.9rem; font-weight: 700; cursor: pointer;
      transition: all 0.2s;
    }
    .role-btn.active {
      background: rgba(107,203,119,0.2);
      border-color: #6BCB77; color: #6BCB77;
    }
    .role-btn:hover { border-color: rgba(255,255,255,0.3); }
    .auth-form { display: flex; flex-direction: column; gap: 1rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
    .form-group label { color: rgba(255,255,255,0.8); font-size: 0.85rem; font-weight: 700; }
    .form-input {
      background: rgba(255,255,255,0.08);
      border: 2px solid rgba(255,255,255,0.15);
      border-radius: 14px; padding: 0.8rem 1rem;
      color: #fff; font-size: 1rem; font-family: inherit;
      transition: border-color 0.2s; outline: none;
    }
    .form-input:focus { border-color: #6BCB77; }
    .form-input::placeholder { color: rgba(255,255,255,0.35); }
    .error-banner {
      background: rgba(255,107,107,0.2); border: 2px solid #FF6B6B;
      border-radius: 12px; padding: 0.7rem 1rem;
      color: #FF6B6B; font-size: 0.85rem; font-weight: 600;
    }
    .btn-primary {
      background: linear-gradient(135deg, #6BCB77, #4D96FF);
      border: none; border-radius: 16px; padding: 0.9rem;
      font-family: 'Fredoka One', cursive; font-size: 1.1rem;
      color: #fff; cursor: pointer; font-weight: 700;
      transition: transform 0.2s, opacity 0.2s; margin-top: 0.5rem;
    }
    .btn-primary:hover:not(:disabled) { transform: scale(1.03); }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
    .auth-footer { text-align: center; margin-top: 1.5rem; }
    .auth-footer p { color: rgba(255,255,255,0.5); font-size: 0.9rem; }
    .auth-footer a { color: #FFD93D; font-weight: 700; text-decoration: none; }
    .auth-footer a:hover { text-decoration: underline; }
  `]
})
export class SignupComponent {
  name     = '';
  email    = '';
  password = '';
  role: UserRole = 'STUDENT';
  loading  = signal(false);
  errorMsg = signal('');

  constructor(private auth: AuthService, private router: Router) {}

  onSignup(): void {
    this.errorMsg.set('');
    this.loading.set(true);

    this.auth.register({ name: this.name, email: this.email, password: this.password, role: this.role })
      .subscribe({
        next: () => this.router.navigate(['/onboarding']),
        error: (err) => {
          this.errorMsg.set(err.error?.message || 'Registration failed. Try again.');
          this.loading.set(false);
        }
      });
  }
}
