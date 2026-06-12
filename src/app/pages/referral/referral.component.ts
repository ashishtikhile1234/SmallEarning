import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

const API = 'http://localhost:8080/api';

@Component({
  selector: 'app-referral',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="referral-page">
      <!-- Header -->
      <div class="referral-hero">
        <div class="hero-emoji animate-float">🎁</div>
        <h1>Invite Friends, Earn Coins!</h1>
        <p>Share your code. When they join, you both win.</p>
      </div>

      <!-- Coin balance -->
      <div class="coin-card animate-scale-in">
        <div class="coin-icon">🪙</div>
        <div class="coin-info">
          <span class="coin-num">{{ coins() }}</span>
          <span class="coin-label">GigBuddy Coins</span>
        </div>
      </div>

      <!-- Referral code -->
      <div class="code-card animate-slide-up">
        <h3>Your Referral Code</h3>
        <div class="code-display">
          <span class="code-text">{{ myCode() || 'Loading...' }}</span>
          <button class="copy-btn" (click)="copyCode()">
            {{ copied() ? '✅ Copied!' : '📋 Copy' }}
          </button>
        </div>
        <p class="code-sub">Share this code with friends. You earn <strong>50 coins</strong>, they earn <strong>25 coins</strong>!</p>

        <!-- WhatsApp share -->
        @if (myCode()) {
          <a
            class="share-btn"
            [href]="whatsappUrl()"
            target="_blank"
            rel="noopener"
          >
            📲 Share on WhatsApp
          </a>
        }
      </div>

      <!-- Apply a code -->
      <div class="apply-card animate-slide-up">
        <h3>Have a Friend's Code?</h3>
        <div class="apply-row">
          <input
            class="code-input"
            type="text"
            placeholder="Enter referral code..."
            [(ngModel)]="inputCode"
            [disabled]="applied()"
            style="text-transform: uppercase;"
          />
          <button class="apply-btn" (click)="applyCode()" [disabled]="!inputCode.trim() || applying() || applied()">
            {{ applying() ? '⏳' : applied() ? '✅ Applied!' : 'Apply' }}
          </button>
        </div>
        @if (applyMessage()) {
          <p class="apply-msg" [class.error]="applyError()">{{ applyMessage() }}</p>
        }
      </div>

      <!-- How it works -->
      <div class="how-card">
        <h3>How It Works</h3>
        <div class="steps">
          <div class="step">
            <div class="step-num">1</div>
            <p>Share your unique code with a friend</p>
          </div>
          <div class="step">
            <div class="step-num">2</div>
            <p>They sign up on GigBuddy and apply your code</p>
          </div>
          <div class="step">
            <div class="step-num">3</div>
            <p>You get <strong>50 coins</strong>, they get <strong>25 coins</strong> 🎉</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .referral-page {
      padding: 24px 20px 40px;
      display: flex; flex-direction: column; gap: 20px;
      max-width: 520px; margin: 0 auto;
      font-family: 'Nunito', sans-serif;
    }
    .referral-hero {
      text-align: center; padding: 16px 0;
    }
    .hero-emoji { font-size: 3.5rem; display: block; margin-bottom: 12px; }
    .referral-hero h1 { font-size: 1.5rem; font-weight: 800; color: var(--text); margin: 0 0 8px; }
    .referral-hero p { font-size: 0.9rem; color: var(--text-secondary); margin: 0; }

    .coin-card {
      display: flex; align-items: center; gap: 16px;
      background: linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,165,0,0.1));
      border: 1px solid rgba(255,215,0,0.3); border-radius: 20px; padding: 20px 24px;
    }
    .coin-icon { font-size: 2.5rem; }
    .coin-num { display: block; font-size: 2.2rem; font-weight: 800; color: #FFD700; line-height: 1; }
    .coin-label { font-size: 0.8rem; color: var(--text-secondary); font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; }

    .code-card, .apply-card, .how-card {
      background: var(--bg-elevated); border: 1px solid var(--border);
      border-radius: 20px; padding: 22px 20px;
    }
    h3 { font-size: 1rem; font-weight: 800; color: var(--text); margin: 0 0 14px; }

    .code-display {
      display: flex; align-items: center; gap: 10px;
      background: var(--bg); border: 1.5px dashed var(--brand);
      border-radius: 14px; padding: 14px 16px; margin-bottom: 12px;
    }
    .code-text {
      flex: 1; font-family: 'Fredoka One', cursive; font-size: 1.4rem;
      color: var(--brand); letter-spacing: 0.08em;
    }
    .copy-btn {
      padding: 8px 14px; border-radius: 10px; font-family: inherit;
      font-size: 0.8rem; font-weight: 700; cursor: pointer;
      background: rgba(255,77,109,0.12); border: 1px solid var(--brand);
      color: var(--brand); transition: all 0.2s ease;
      &:hover { background: var(--brand); color: white; }
    }
    .code-sub { font-size: 0.85rem; color: var(--text-secondary); margin: 0 0 14px; }
    .share-btn {
      display: block; text-align: center; padding: 13px;
      background: linear-gradient(135deg, #25D366, #1ebe5e);
      color: white; border-radius: 14px; font-weight: 800; font-size: 0.95rem;
      text-decoration: none; transition: transform 0.2s ease;
      &:hover { transform: scale(1.02); }
    }

    .apply-row { display: flex; gap: 10px; margin-bottom: 10px; }
    .code-input {
      flex: 1; padding: 12px 16px; font-family: inherit; font-size: 0.95rem; font-weight: 700;
      background: var(--bg); border: 1px solid var(--border); border-radius: 12px;
      color: var(--text); outline: none; letter-spacing: 0.06em;
      &:focus { border-color: var(--brand); }
      &::placeholder { color: var(--text-muted); font-weight: 400; letter-spacing: 0; }
    }
    .apply-btn {
      padding: 12px 20px; font-family: inherit; font-size: 0.9rem; font-weight: 800;
      border: none; border-radius: 12px; cursor: pointer;
      background: var(--brand); color: white;
      &:disabled { opacity: 0.5; cursor: not-allowed; }
    }
    .apply-msg { font-size: 0.85rem; font-weight: 600; margin: 0; color: var(--accept); }
    .apply-msg.error { color: var(--reject); }

    .steps { display: flex; flex-direction: column; gap: 12px; }
    .step { display: flex; align-items: flex-start; gap: 12px; }
    .step-num {
      width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0;
      background: var(--brand); color: white; font-weight: 800; font-size: 0.85rem;
      display: flex; align-items: center; justify-content: center;
    }
    .step p { margin: 0; font-size: 0.88rem; color: var(--text-secondary); padding-top: 4px; }

    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50%       { transform: translateY(-10px); }
    }
  `]
})
export class ReferralComponent implements OnInit {
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  myCode = signal('');
  coins = signal(0);
  copied = signal(false);
  inputCode = '';
  applying = signal(false);
  applied = signal(false);
  applyMessage = signal('');
  applyError = signal(false);

  get headers() {
    const token = this.auth.getToken();
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
  }

  ngOnInit() {
    this.http.get<any>(`${API}/referral/my-code`, { headers: this.headers }).subscribe({
      next: data => { this.myCode.set(data.referralCode); this.coins.set(data.coins); },
      error: () => {}
    });
  }

  whatsappUrl() {
    const text = `Hey! Join GigBuddy — find part-time gigs easily! Use my referral code *${this.myCode()}* to earn 25 coins on signup 🎉\nhttps://gigbuddy.app/signup?ref=${this.myCode()}`;
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  }

  copyCode() {
    navigator.clipboard.writeText(this.myCode());
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2000);
  }

  applyCode() {
    this.applying.set(true);
    this.applyMessage.set('');
    this.http.post<any>(`${API}/referral/apply`, { code: this.inputCode.trim() }, { headers: this.headers }).subscribe({
      next: data => {
        this.applying.set(false);
        this.applied.set(true);
        this.coins.set(data.yourCoins);
        this.applyMessage.set(data.message);
        this.applyError.set(false);
      },
      error: err => {
        this.applying.set(false);
        this.applyMessage.set(err.error?.message || 'Failed to apply code. Try again.');
        this.applyError.set(true);
      }
    });
  }
}
