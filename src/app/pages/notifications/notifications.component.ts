import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GigService } from '../../services/gig.service';

const DEMO_NOTIFS = [
  { id:1, message:'Your application for "Coffee Counter Helper" was accepted! ☕🎉', type:'success', isRead:false, createdAt:'2 min ago' },
  { id:2, message:'New gig posted in Pune matching your profile: "Book Stall Assistant" 📚', type:'info', isRead:false, createdAt:'1 hr ago' },
  { id:3, message:'Your application for "Retail Store Helper" is pending review 🛍️', type:'warning', isRead:true, createdAt:'3 hrs ago' },
  { id:4, message:'GigBuddy: Welcome! Start browsing gigs near you 🚀', type:'info', isRead:true, createdAt:'1 day ago' },
];

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notif-page">
      <div class="page-header">
        <h2>🔔 Notifications</h2>
        <p>{{ unreadCount() }} unread notification{{ unreadCount() !== 1 ? 's' : '' }}</p>
      </div>

      <div class="notif-list">
        @for (n of notifs(); track n.id) {
          <div class="notif-card" [class.unread]="!n.isRead" [class]="'notif-card ' + n.type">
            <div class="notif-icon">{{ typeIcon(n.type) }}</div>
            <div class="notif-body">
              <p>{{ n.message }}</p>
              <span class="notif-time">{{ n.createdAt }}</span>
            </div>
            @if (!n.isRead) {
              <div class="unread-dot"></div>
            }
          </div>
        }
      </div>

      @if (backendDown()) {
        <div class="demo-notice">💡 Backend offline — showing demo notifications</div>
      }
    </div>
  `,
  styles: [`
    .notif-page { max-width: 650px; margin: 0 auto; padding: 2rem 1.5rem; font-family: 'Nunito', sans-serif; }
    .page-header { margin-bottom: 2rem; }
    .page-header h2 { font-family: 'Fredoka One', cursive; font-size: 2rem; color: var(--text-primary); margin: 0 0 0.3rem; }
    .page-header p { color: var(--text-muted); margin: 0; }
    .notif-list { display: flex; flex-direction: column; gap: 0.8rem; }
    .notif-card {
      display: flex; align-items: flex-start; gap: 1rem;
      padding: 1.1rem 1.3rem; border-radius: 16px;
      background: var(--bg-secondary); border: 1px solid var(--border);
      transition: transform 0.15s; position: relative;
    }
    .notif-card:hover { transform: translateY(-2px); }
    .notif-card.unread { border-color: var(--accent); background: var(--accent-subtle); }
    .notif-card.success { border-left: 3px solid #6BCB77; }
    .notif-card.info    { border-left: 3px solid #4D96FF; }
    .notif-card.warning { border-left: 3px solid #FFD93D; }
    .notif-icon { font-size: 1.6rem; flex-shrink: 0; margin-top: 2px; }
    .notif-body { flex: 1; }
    .notif-body p { margin: 0 0 0.3rem; font-size: 0.9rem; color: var(--text-primary); line-height: 1.4; }
    .notif-time { font-size: 0.75rem; color: var(--text-muted); }
    .unread-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--accent); flex-shrink: 0; margin-top: 4px; }
    .demo-notice { margin-top: 1.5rem; padding: 1rem; border-radius: 12px; background: rgba(255,211,77,0.1); border: 1px solid rgba(255,211,77,0.3); color: #FFD93D; font-size: 0.85rem; font-weight: 600; }
  `]
})
export class NotificationsComponent implements OnInit {
  gigService  = inject(GigService);
  notifs      = signal<any[]>([]);
  backendDown = signal(false);
  unreadCount = signal(0);

  typeIcon(type: string): string {
    return { success:'🎉', info:'📢', warning:'⚠️', error:'❌' }[type] || '🔔';
  }

  ngOnInit() {
    this.gigService['http'].get<any[]>('http://localhost:8080/api/notifications').subscribe({
      next: (data) => {
        this.notifs.set(data);
        this.unreadCount.set(data.filter(n => !n.isRead).length);
      },
      error: () => {
        this.notifs.set(DEMO_NOTIFS);
        this.unreadCount.set(DEMO_NOTIFS.filter(n => !n.isRead).length);
        this.backendDown.set(true);
      }
    });
  }
}
