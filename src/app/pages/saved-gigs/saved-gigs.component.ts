import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { GigService } from '../../services/gig.service';
import { Gig } from '../../models/gig.model';

@Component({
  selector: 'app-saved-gigs',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="saved-page">

      <!-- Header -->
      <div class="page-header">
        <h1>🔖 Saved Gigs</h1>
        <p>Your bookmarked opportunities</p>
      </div>

      <!-- Loading -->
      <div class="loading" *ngIf="loading()">
        <span class="spin">⏳</span> Loading your saved gigs...
      </div>

      <!-- Empty state -->
      <div class="empty-state" *ngIf="!loading() && savedGigs().length === 0">
        <div class="empty-icon">🔖</div>
        <h2>No saved gigs yet!</h2>
        <p>Bookmark gigs you like while browsing so you can apply later.</p>
        <a routerLink="/browse" class="browse-btn">Browse Gigs 🃏</a>
      </div>

      <!-- Gig cards -->
      <div class="gigs-grid" *ngIf="!loading() && savedGigs().length > 0">
        <div class="gig-card" *ngFor="let gig of savedGigs()">

          <div class="card-header">
            <div class="category-emoji">{{ gig.categoryEmoji }}</div>
            <div class="card-actions">
              <button class="unsave-btn" (click)="unsaveGig(gig)" title="Remove bookmark">🗑️</button>
            </div>
          </div>

          <div class="gig-title">{{ gig.title }}</div>
          <div class="gig-company">🏪 {{ gig.company }}</div>

          <div class="gig-meta">
            <span>📍 {{ gig.location }}</span>
            <span>⏱️ {{ gig.duration }}</span>
          </div>

          <div class="gig-pay">
            💰 ₹{{ gig.payMin }} - ₹{{ gig.payMax }}
            <span class="pay-type">/ {{ gig.payType === 'HOURLY' ? 'hr' : 'fixed' }}</span>
          </div>

          <div class="card-footer">
            <span class="slots">👥 {{ gig.slotsAvailable }} spots left</span>
            <a [routerLink]="['/gig', gig.id]" class="view-btn">View & Apply →</a>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .saved-page {
      min-height: 100vh;
      background: linear-gradient(135deg, #0a0a1a 0%, #1a1040 50%, #0a1a2a 100%);
      padding: 24px 16px 80px;
      font-family: 'Nunito', sans-serif;
    }

    .page-header {
      text-align: center;
      margin-bottom: 32px;
    }
    .page-header h1 {
      font-family: 'Fredoka One', cursive;
      color: #FFD93D;
      font-size: 2rem;
      margin: 0;
    }
    .page-header p { color: rgba(255,255,255,0.6); margin: 4px 0 0; }

    .loading, .empty-state {
      text-align: center;
      color: rgba(255,255,255,0.7);
      padding: 60px 20px;
    }
    .spin { font-size: 2rem; display: inline-block; animation: spin 1s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }

    .empty-icon { font-size: 4rem; margin-bottom: 16px; }
    .empty-state h2 {
      font-family: 'Fredoka One', cursive;
      color: white;
      margin: 0 0 8px;
    }
    .empty-state p { color: rgba(255,255,255,0.5); margin-bottom: 24px; }
    .browse-btn {
      display: inline-block;
      background: linear-gradient(135deg, #FFD93D, #FF6B6B);
      color: #1a1040;
      font-weight: 700;
      padding: 12px 28px;
      border-radius: 20px;
      text-decoration: none;
      font-size: 1rem;
      transition: transform 0.2s ease;
    }
    .browse-btn:hover { transform: scale(1.05); }

    .gigs-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 16px;
      max-width: 900px;
      margin: 0 auto;
    }

    .gig-card {
      background: rgba(255,255,255,0.07);
      border: 2px solid rgba(255,255,255,0.12);
      border-radius: 20px;
      padding: 20px;
      transition: all 0.3s ease;
    }
    .gig-card:hover {
      transform: translateY(-4px);
      border-color: rgba(255,217,61,0.4);
      background: rgba(255,255,255,0.1);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    .category-emoji { font-size: 2rem; }
    .unsave-btn {
      background: rgba(255,107,107,0.15);
      border: 1px solid rgba(255,107,107,0.3);
      color: #FF6B6B;
      border-radius: 10px;
      padding: 4px 10px;
      cursor: pointer;
      font-size: 0.85rem;
      transition: all 0.2s ease;
    }
    .unsave-btn:hover { background: rgba(255,107,107,0.3); }

    .gig-title {
      font-family: 'Fredoka One', cursive;
      color: white;
      font-size: 1.1rem;
      margin-bottom: 4px;
    }
    .gig-company { color: rgba(255,255,255,0.6); font-size: 0.85rem; margin-bottom: 10px; }

    .gig-meta {
      display: flex;
      gap: 12px;
      color: rgba(255,255,255,0.5);
      font-size: 0.8rem;
      margin-bottom: 10px;
    }

    .gig-pay {
      color: #6BCB77;
      font-weight: 700;
      font-size: 1rem;
      margin-bottom: 14px;
    }
    .pay-type { color: rgba(255,255,255,0.5); font-weight: 400; font-size: 0.8rem; }

    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .slots { color: rgba(255,255,255,0.5); font-size: 0.8rem; }
    .view-btn {
      background: linear-gradient(135deg, #4D96FF, #9B59B6);
      color: white;
      font-weight: 700;
      padding: 8px 16px;
      border-radius: 12px;
      text-decoration: none;
      font-size: 0.85rem;
      transition: transform 0.2s ease;
    }
    .view-btn:hover { transform: scale(1.05); }
  `]
})
export class SavedGigsComponent implements OnInit {

  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private gigService = inject(GigService);

  savedGigs = signal<Gig[]>([]);
  loading = signal(true);

  ngOnInit() {
    const token = this.auth.token();
    if (!token) {
      this.loading.set(false);
      return;
    }

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    this.http.get<Gig[]>('http://localhost:8080/api/saved-gigs', { headers }).subscribe({
      next: data => {
        this.savedGigs.set(data);
        this.loading.set(false);
      },
      error: () => {
        // Fallback to local mock bookmarks stored in localStorage
        const raw = localStorage.getItem('gb_saved_gigs');
        const ids: number[] = raw ? JSON.parse(raw) : [];
        this.gigService.getGigs().subscribe(gigs => {
          this.savedGigs.set(gigs.filter(g => ids.includes(+g.id)));
          this.loading.set(false);
        });
      }
    });
  }

  unsaveGig(gig: Gig) {
    const token = this.auth.token();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token ?? ''}` });

    this.http.delete(`http://localhost:8080/api/saved-gigs/${gig.id}`, { headers }).subscribe({
      next: () => this.savedGigs.update(g => g.filter(x => x.id !== gig.id)),
      error: () => {
        // Update local fallback
        const raw = localStorage.getItem('gb_saved_gigs');
        const ids: number[] = raw ? JSON.parse(raw) : [];
        const updated = ids.filter(id => id !== +gig.id);
        localStorage.setItem('gb_saved_gigs', JSON.stringify(updated));
        this.savedGigs.update(g => g.filter(x => x.id !== gig.id));
      }
    });
  }
}
