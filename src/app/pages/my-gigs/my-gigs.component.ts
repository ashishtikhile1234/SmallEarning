import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { GigService } from '../../services/gig.service';

@Component({
  selector: 'app-my-gigs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="my-gigs-page">
      <div class="page-header">
        <h2>{{ auth.isEmployer() ? '🏪 My Posted Gigs' : '🎓 My Applications' }}</h2>
        <p>{{ auth.isEmployer() ? 'Gigs you have posted' : 'Track your job applications' }}</p>
      </div>

      @if (loading()) {
        <div class="loading-state"><div class="spin">⏳</div><p>Loading...</p></div>
      }

      @if (!loading() && items().length === 0) {
        <div class="empty-state">
          <div class="empty-icon">🎯</div>
          <h3>Nothing here yet!</h3>
          <p>{{ auth.isEmployer() ? 'Post your first gig!' : 'Browse and apply to gigs!' }}</p>
        </div>
      }

      <div class="timeline">
        @for (item of items(); track item.id) {
          <div class="timeline-card" [style.border-left-color]="item.color">
            <div class="card-header">
              <div class="card-emoji">{{ item.emoji }}</div>
              <div class="card-info">
                <h3>{{ item.title }}</h3>
                <p>{{ item.sub }}</p>
              </div>
              <span class="status-badge" [class]="item.statusClass">{{ item.statusLabel }}</span>
            </div>
            <div class="card-meta">
              <span>📍 {{ item.location }}</span>
              @if (item.pay) { <span>💰 {{ item.pay }}</span> }
              <span>🕐 {{ item.postedAgo }}</span>
            </div>
          </div>
        }
      </div>

      @if (backendDown()) {
        <div class="demo-notice">💡 Backend offline — showing demo data</div>
      }
    </div>
  `,
  styles: [`
    .my-gigs-page { max-width: 700px; margin: 0 auto; padding: 2rem 1.5rem; font-family: 'Nunito', sans-serif; }
    .page-header { margin-bottom: 2rem; }
    .page-header h2 { font-family: 'Fredoka One', cursive; font-size: 2rem; color: var(--text-primary); margin: 0 0 0.3rem; }
    .page-header p { color: var(--text-muted); margin: 0; }
    .loading-state, .empty-state { text-align: center; padding: 3rem; color: var(--text-muted); }
    .spin { font-size: 2rem; animation: spin 1s linear infinite; display: inline-block; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .empty-icon { font-size: 4rem; margin-bottom: 1rem; }
    .empty-state h3 { font-family: 'Fredoka One', cursive; font-size: 1.5rem; color: var(--text-primary); margin: 0 0 0.5rem; }
    .timeline { display: flex; flex-direction: column; gap: 1rem; }
    .timeline-card { background: var(--bg-secondary); border-radius: 16px; border: 1px solid var(--border); border-left: 4px solid #6BCB77; padding: 1.2rem 1.4rem; transition: transform 0.15s; }
    .timeline-card:hover { transform: translateX(4px); }
    .card-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 0.8rem; }
    .card-emoji { font-size: 2rem; }
    .card-info { flex: 1; }
    .card-info h3 { font-size: 1rem; font-weight: 700; color: var(--text-primary); margin: 0 0 0.2rem; }
    .card-info p { font-size: 0.8rem; color: var(--text-muted); margin: 0; }
    .status-badge { padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; }
    .status-badge.pending { background: rgba(255,211,77,0.2); color: #FFD93D; }
    .status-badge.accepted, .status-badge.open { background: rgba(107,203,119,0.2); color: #6BCB77; }
    .status-badge.rejected { background: rgba(255,107,107,0.2); color: #FF6B6B; }
    .status-badge.completed { background: rgba(77,150,255,0.2); color: #4D96FF; }
    .card-meta { display: flex; flex-wrap: wrap; gap: 0.8rem; font-size: 0.8rem; color: var(--text-muted); }
    .demo-notice { margin-top: 1.5rem; padding: 1rem; border-radius: 12px; background: rgba(255,211,77,0.1); border: 1px solid rgba(255,211,77,0.3); color: #FFD93D; font-size: 0.85rem; font-weight: 600; }
  `]
})
export class MyGigsComponent implements OnInit {
  auth = inject(AuthService);
  gigService = inject(GigService);
  loading = signal(true);
  backendDown = signal(false);
  items = signal<any[]>([]);

  private DEMO = [
    { id:1, title:'Coffee Counter Helper', sub:'Brewed Bliss Cafe', emoji:'☕', location:'Pune', pay:'₹120/hr', color:'#FF9F43', statusClass:'pending', statusLabel:'⏳ Pending', postedAgo:'30 min ago' },
    { id:2, title:'Book Stall Assistant', sub:'PageTurner Books', emoji:'📚', location:'Pune', pay:'₹100/hr', color:'#4D96FF', statusClass:'accepted', statusLabel:'✅ Accepted', postedAgo:'2 hrs ago' },
  ];

  ngOnInit() {
    const url = this.auth.isEmployer() ? 'http://localhost:8080/api/gigs/my-posted' : 'http://localhost:8080/api/applications/my';
    this.gigService['http'].get<any[]>(url).subscribe({
      next: (data) => { this.items.set(data.map(d => ({ id:d.id, title:d.title||d.gigTitle, sub:d.employerName||d.gigLocation||'', emoji:'🎯', location:d.location||d.gigLocation||'', pay:d.payAmount?`₹${d.payAmount}`:'', color:'#6BCB77', statusClass:(d.status||'').toLowerCase(), statusLabel:d.status||'', postedAgo:d.createdAt||d.appliedAt||'' }))); this.loading.set(false); },
      error: () => { this.items.set(this.DEMO); this.backendDown.set(true); this.loading.set(false); }
    });
  }
}
