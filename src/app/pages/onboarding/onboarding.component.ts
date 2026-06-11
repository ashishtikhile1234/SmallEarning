import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

const API = 'http://localhost:8080/api';

const SKILL_OPTIONS = [
  '☕ Barista', '📦 Delivery', '🛍️ Retail', '📖 Teaching',
  '🎨 Design', '💻 Tech Support', '🎉 Events', '📸 Photography',
  '🍕 Food Service', '🚗 Driving', '📞 Customer Service', '💪 Physical Work',
];

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="onboarding-wrap">
      <!-- Progress dots -->
      <div class="progress-dots">
        @for (s of steps; track $index; let i = $index) {
          <div class="dot" [class.active]="i === step()" [class.done]="i < step()">
            @if (i < step()) { <span>✓</span> }
          </div>
        }
      </div>

      <!-- Mascot area -->
      <div class="mascot-area">
        <div class="mascot-emoji animate-float">{{ mascotEmoji() }}</div>
        <div class="mascot-bubble">{{ mascotMessage() }}</div>
      </div>

      <!-- Step 0: Name + Avatar -->
      @if (step() === 0) {
        <div class="step-card animate-slide-up">
          <h2 class="step-title">Hey! What's your name? 👋</h2>
          <p class="step-sub">Let's set up your GigBuddy profile!</p>
          <div class="avatar-picker">
            @for (av of avatars; track av) {
              <button class="avatar-opt" [class.selected]="selectedAvatar() === av" (click)="selectedAvatar.set(av)">
                {{ av }}
              </button>
            }
          </div>
          <input class="gb-input" type="text" placeholder="Your name..." [(ngModel)]="name" />
          <input class="gb-input" type="number" placeholder="Age (e.g. 20)" [(ngModel)]="age" />
          <button class="next-btn" [disabled]="!name.trim()" (click)="nextStep()">
            Next →
          </button>
        </div>
      }

      <!-- Step 1: Skills -->
      @if (step() === 1) {
        <div class="step-card animate-slide-up">
          <h2 class="step-title">What can you do? 🛠️</h2>
          <p class="step-sub">Pick skills — shown as badges on your profile</p>
          <div class="skills-grid">
            @for (skill of skillOptions; track skill) {
              <button
                class="skill-chip"
                [class.selected]="selectedSkills().includes(skill)"
                (click)="toggleSkill(skill)"
              >{{ skill }}</button>
            }
          </div>
          <div class="step-nav">
            <button class="back-btn" (click)="prevStep()">← Back</button>
            <button class="next-btn" (click)="nextStep()">Next →</button>
          </div>
        </div>
      }

      <!-- Step 2: Location + Bio -->
      @if (step() === 2) {
        <div class="step-card animate-slide-up">
          <h2 class="step-title">Almost done! 🎯</h2>
          <p class="step-sub">Tell gig-posters a little about yourself</p>
          <input class="gb-input" type="text" placeholder="Your city (e.g. Pune)" [(ngModel)]="location" />
          <textarea class="gb-input gb-textarea" placeholder="Short bio — what makes you awesome? 😄" [(ngModel)]="bio" rows="3"></textarea>
          <div class="step-nav">
            <button class="back-btn" (click)="prevStep()">← Back</button>
            <button class="next-btn finish-btn" [disabled]="saving()" (click)="finish()">
              @if (saving()) { ⏳ Saving... } @else { 🚀 Let's Go! }
            </button>
          </div>
          @if (error()) {
            <p class="error-msg">{{ error() }}</p>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .onboarding-wrap {
      min-height: 100dvh;
      background: var(--bg);
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 40px 20px 32px;
      gap: 24px;
    }
    .progress-dots {
      display: flex; gap: 12px; align-items: center;
    }
    .dot {
      width: 32px; height: 32px; border-radius: 50%;
      border: 2px solid var(--border); background: var(--bg-elevated);
      display: flex; align-items: center; justify-content: center;
      font-size: 0.75rem; font-weight: 700; color: var(--text-muted);
      transition: all 0.3s ease;
    }
    .dot.active { border-color: var(--brand); background: var(--brand); color: white; transform: scale(1.15); }
    .dot.done { border-color: var(--accept); background: var(--accept); color: white; }
    .mascot-area {
      display: flex; flex-direction: column; align-items: center; gap: 12px;
    }
    .mascot-emoji {
      font-size: 4rem; animation: float 3s ease-in-out infinite;
    }
    .mascot-bubble {
      background: var(--bg-elevated); border: 1px solid var(--border);
      border-radius: 20px; padding: 10px 18px;
      font-size: 0.9rem; font-weight: 600; color: var(--text-secondary);
      max-width: 280px; text-align: center;
    }
    .step-card {
      width: 100%; max-width: 420px;
      background: var(--bg-elevated); border: 1px solid var(--border);
      border-radius: 24px; padding: 28px 24px;
      display: flex; flex-direction: column; gap: 16px;
    }
    .step-title { font-size: 1.5rem; font-weight: 800; color: var(--text); margin: 0; }
    .step-sub { font-size: 0.9rem; color: var(--text-secondary); margin: -8px 0 0; }
    .avatar-picker {
      display: flex; flex-wrap: wrap; gap: 10px;
    }
    .avatar-opt {
      width: 52px; height: 52px; border-radius: 50%; font-size: 1.6rem;
      border: 2px solid var(--border); background: var(--bg); cursor: pointer;
      transition: all 0.2s ease;
      &.selected { border-color: var(--brand); transform: scale(1.15); box-shadow: 0 0 0 3px var(--brand-glow); }
    }
    .gb-input {
      width: 100%; padding: 13px 16px; font-family: inherit; font-size: 0.95rem;
      background: var(--bg); border: 1px solid var(--border); border-radius: 14px;
      color: var(--text); outline: none; box-sizing: border-box;
      &:focus { border-color: var(--brand); }
      &::placeholder { color: var(--text-muted); }
    }
    .gb-textarea { resize: vertical; min-height: 80px; }
    .skills-grid {
      display: flex; flex-wrap: wrap; gap: 8px;
    }
    .skill-chip {
      padding: 8px 14px; border-radius: 24px; font-family: inherit;
      font-size: 0.82rem; font-weight: 600; cursor: pointer;
      border: 1.5px solid var(--border); background: var(--bg);
      color: var(--text-secondary); transition: all 0.2s ease;
      &.selected { border-color: var(--brand); background: rgba(99,102,241,0.15); color: var(--brand); }
    }
    .step-nav { display: flex; gap: 12px; }
    .back-btn {
      flex: 1; padding: 14px; font-family: inherit; font-size: 0.95rem; font-weight: 700;
      border: 1.5px solid var(--border); background: transparent; border-radius: 14px;
      color: var(--text-secondary); cursor: pointer;
      &:hover { border-color: var(--text); color: var(--text); }
    }
    .next-btn {
      flex: 2; padding: 14px; font-family: inherit; font-size: 0.95rem; font-weight: 800;
      border: none; border-radius: 14px; cursor: pointer;
      background: linear-gradient(135deg, var(--brand), var(--brand-dark));
      color: white; box-shadow: 0 6px 24px var(--brand-glow);
      transition: transform 0.2s ease;
      &:hover { transform: scale(1.02); }
      &:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
    }
    .finish-btn { flex: 2; }
    .error-msg { color: var(--reject); font-size: 0.85rem; text-align: center; }
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50%       { transform: translateY(-10px); }
    }
  `]
})
export class OnboardingComponent implements OnInit {
  private router = inject(Router);
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  step = signal(0);
  saving = signal(false);
  error = signal('');
  selectedAvatar = signal('🧑');
  selectedSkills = signal<string[]>([]);

  name = '';
  age: number | null = null;
  location = '';
  bio = '';

  steps = [0, 1, 2];
  avatars = ['🧑', '👩', '🧒', '👦', '🧑‍💻', '👩‍💼', '🧑‍🎓', '👩‍🎓', '🧑‍🍳', '👩‍🎨'];
  skillOptions = SKILL_OPTIONS;

  mascotEmojis = ['🐣', '🐣', '🚀'];
  mascotMessages = [
    "Hi! I'm Giggly 🐣 Let's set up your profile!",
    "Ooh, skills! Pick what you're good at 💪",
    "Last step! Tell us where you're from 🌍",
  ];

  mascotEmoji() { return this.mascotEmojis[this.step()]; }
  mascotMessage() { return this.mascotMessages[this.step()]; }

  ngOnInit() {
    // If already onboarded, skip
    if (localStorage.getItem('gb_onboarded')) {
      this.router.navigate(['/browse']);
    }
    // Pre-fill name from auth
    const user = this.auth.currentUser();
    if (user?.name) this.name = user.name;
  }

  nextStep() {
    if (this.step() < 2) this.step.update(s => s + 1);
  }

  prevStep() {
    if (this.step() > 0) this.step.update(s => s - 1);
  }

  toggleSkill(skill: string) {
    this.selectedSkills.update(skills =>
      skills.includes(skill) ? skills.filter(s => s !== skill) : [...skills, skill]
    );
  }

  finish() {
    this.saving.set(true);
    this.error.set('');

    const token = this.auth.getToken();
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();

    const payload = {
      name: this.name,
      bio: this.bio,
      location: this.location,
      skills: this.selectedSkills(),
      avatarEmoji: this.selectedAvatar(),
    };

    this.http.put(`${API}/profile`, payload, { headers }).subscribe({
      next: () => {
        localStorage.setItem('gb_onboarded', '1');
        this.saving.set(false);
        this.router.navigate(['/browse']);
      },
      error: () => {
        // Even if API fails, mark done and continue
        localStorage.setItem('gb_onboarded', '1');
        this.saving.set(false);
        this.router.navigate(['/browse']);
      }
    });
  }
}
