import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GigService } from '../../services/gig.service';
import { AuthService } from '../../services/auth.service';

const CATEGORIES = [
  { value: 'CAFE',    label: 'Cafe',    emoji: '☕' },
  { value: 'RETAIL',  label: 'Retail',  emoji: '🛍️' },
  { value: 'BOOKS',   label: 'Books',   emoji: '📚' },
  { value: 'EVENTS',  label: 'Events',  emoji: '🎉' },
  { value: 'TUITION', label: 'Tuition', emoji: '📖' },
  { value: 'OTHER',   label: 'Other',   emoji: '✨' },
];

@Component({
  selector: 'app-post-gig',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="post-gig-page">
      <div class="page-header">
        <h2>Post a New Gig 🚀</h2>
        <p>Fill in the details — students will swipe on your gig!</p>
      </div>

      <form class="gig-form" (ngSubmit)="onSubmit()">
        <!-- Title -->
        <div class="form-section">
          <label class="form-label">📝 Gig Title</label>
          <input class="form-input" type="text" [(ngModel)]="form.title" name="title"
            placeholder="e.g. Coffee counter help chahiye!" required />
        </div>

        <!-- Category -->
        <div class="form-section">
          <label class="form-label">🏷️ Category</label>
          <div class="cat-grid">
            @for (cat of categories; track cat.value) {
              <button type="button" class="cat-btn" [class.active]="form.category === cat.value"
                (click)="form.category = cat.value">
                <span>{{ cat.emoji }}</span>
                <span>{{ cat.label }}</span>
              </button>
            }
          </div>
        </div>

        <!-- Description -->
        <div class="form-section">
          <label class="form-label">💬 Description</label>
          <textarea class="form-input" [(ngModel)]="form.description" name="description"
            placeholder="Gig ke baare mein batao — kya kaam hai, kaisi atmosphere hai, extra perks..." rows="4"></textarea>
        </div>

        <!-- Duration + Slots -->
        <div class="form-row">
          <div class="form-section">
            <label class="form-label">⏱️ Duration (hours)</label>
            <input class="form-input" type="number" [(ngModel)]="form.durationHours" name="durationHours"
              min="1" max="12" placeholder="2" required />
          </div>
          <div class="form-section">
            <label class="form-label">👥 Slots Available</label>
            <input class="form-input" type="number" [(ngModel)]="form.slotsAvailable" name="slotsAvailable"
              min="1" placeholder="1" required />
          </div>
        </div>

        <!-- Pay -->
        <div class="form-row">
          <div class="form-section">
            <label class="form-label">💰 Pay Amount (₹)</label>
            <input class="form-input" type="number" [(ngModel)]="form.payAmount" name="payAmount"
              min="1" placeholder="120" required />
          </div>
          <div class="form-section">
            <label class="form-label">💳 Pay Type</label>
            <select class="form-input" [(ngModel)]="form.payType" name="payType">
              <option value="HOURLY">⏰ Per Hour</option>
              <option value="FIXED">🏷️ Fixed Amount</option>
            </select>
          </div>
        </div>

        <!-- Location -->
        <div class="form-section">
          <label class="form-label">📍 Location</label>
          <input class="form-input" type="text" [(ngModel)]="form.location" name="location"
            placeholder="e.g. Pune, Koregaon Park" required />
        </div>

        <!-- Date + Time -->
        <div class="form-row">
          <div class="form-section">
            <label class="form-label">📅 Date</label>
            <input class="form-input" type="date" [(ngModel)]="form.date" name="date" />
          </div>
          <div class="form-section">
            <label class="form-label">🕐 Start Time</label>
            <input class="form-input" type="time" [(ngModel)]="form.timeSlot" name="timeSlot" />
          </div>
        </div>

        @if (errorMsg()) {
          <div class="error-box">⚠️ {{ errorMsg() }}</div>
        }
        @if (successMsg()) {
          <div class="success-box">🎉 {{ successMsg() }}</div>
        }

        <button type="submit" class="submit-btn" [disabled]="loading()">
          {{ loading() ? '⏳ Posting...' : '🚀 Post Gig!' }}
        </button>
      </form>
    </div>
  `,
  styles: [`
    .post-gig-page {
      max-width: 700px; margin: 0 auto;
      padding: 2rem 1.5rem; font-family: 'Nunito', sans-serif;
    }
    .page-header { margin-bottom: 2rem; }
    .page-header h2 {
      font-family: 'Fredoka One', cursive;
      font-size: 2rem; color: var(--text-primary); margin: 0 0 0.3rem;
    }
    .page-header p { color: var(--text-muted); margin: 0; }
    .gig-form { display: flex; flex-direction: column; gap: 1.5rem; }
    .form-section { display: flex; flex-direction: column; gap: 0.5rem; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .form-label { font-size: 0.85rem; font-weight: 700; color: var(--text-secondary); }
    .form-input {
      background: var(--bg-secondary); border: 2px solid var(--border);
      border-radius: 12px; padding: 0.75rem 1rem;
      color: var(--text-primary); font-size: 0.95rem; font-family: inherit;
      transition: border-color 0.2s; outline: none; width: 100%; box-sizing: border-box;
    }
    .form-input:focus { border-color: var(--accent); }
    textarea.form-input { resize: vertical; }
    .cat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.6rem; }
    .cat-btn {
      display: flex; flex-direction: column; align-items: center; gap: 0.3rem;
      padding: 0.8rem; border-radius: 12px;
      border: 2px solid var(--border); background: var(--bg-secondary);
      color: var(--text-secondary); font-family: inherit; font-size: 0.8rem; font-weight: 700;
      cursor: pointer; transition: all 0.15s;
    }
    .cat-btn span:first-child { font-size: 1.5rem; }
    .cat-btn.active { border-color: var(--accent); background: var(--accent-subtle); color: var(--accent); }
    .cat-btn:hover { border-color: var(--accent); }
    .error-box {
      background: rgba(255,107,107,0.1); border: 2px solid #FF6B6B;
      border-radius: 12px; padding: 0.8rem 1rem; color: #FF6B6B; font-weight: 600;
    }
    .success-box {
      background: rgba(107,203,119,0.1); border: 2px solid #6BCB77;
      border-radius: 12px; padding: 0.8rem 1rem; color: #6BCB77; font-weight: 600;
    }
    .submit-btn {
      background: linear-gradient(135deg, #6BCB77, #4D96FF);
      border: none; border-radius: 14px; padding: 1rem;
      font-family: 'Fredoka One', cursive; font-size: 1.2rem;
      color: #fff; cursor: pointer; transition: transform 0.2s;
    }
    .submit-btn:hover:not(:disabled) { transform: scale(1.02); }
    .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
    @media (max-width: 600px) {
      .form-row { grid-template-columns: 1fr; }
      .cat-grid { grid-template-columns: repeat(3, 1fr); }
    }
  `]
})
export class PostGigComponent {
  gigService = inject(GigService);
  auth       = inject(AuthService);
  router     = inject(Router);

  categories = CATEGORIES;
  loading    = signal(false);
  errorMsg   = signal('');
  successMsg = signal('');

  form = {
    title: '', category: 'CAFE', description: '',
    durationHours: 2, slotsAvailable: 1,
    payAmount: 100, payType: 'HOURLY',
    location: '', date: '', timeSlot: ''
  };

  onSubmit(): void {
    this.errorMsg.set(''); this.successMsg.set('');
    if (!this.form.title || !this.form.location) {
      this.errorMsg.set('Please fill in all required fields.');
      return;
    }
    this.loading.set(true);

    // Map form to API payload
    const payload = {
      title: this.form.title,
      category: this.form.category,
      description: this.form.description,
      durationHours: this.form.durationHours,
      slotsAvailable: this.form.slotsAvailable,
      payAmount: this.form.payAmount,
      payType: this.form.payType,
      location: this.form.location,
      date: this.form.date || null,
      timeSlot: this.form.timeSlot || null,
    };

    this.gigService['http'].post('http://localhost:8080/api/gigs', payload).subscribe({
      next: () => {
        this.successMsg.set('Gig posted successfully! Students will see it now 🎉');
        this.loading.set(false);
        setTimeout(() => this.router.navigate(['/browse']), 2000);
      },
      error: (err: any) => {
        this.errorMsg.set(err.error?.message || 'Failed to post gig. Make sure backend is running.');
        this.loading.set(false);
      }
    });
  }
}
