import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

interface LeaderEntry {
  rank: number;
  userId: number;
  name: string;
  gigsCompleted: number;
  avgRating: number;
  badges: number;
  score: number;
}

const DEMO_LEADERS: LeaderEntry[] = [
  { rank: 1, userId: 1, name: 'Priya Sharma',     gigsCompleted: 18, avgRating: 4.9, badges: 3, score: 195 },
  { rank: 2, userId: 2, name: 'Aarav Mehta',      gigsCompleted: 14, avgRating: 4.7, badges: 2, score: 150 },
  { rank: 3, userId: 3, name: 'Sneha Patil',      gigsCompleted: 12, avgRating: 4.8, badges: 2, score: 130 },
  { rank: 4, userId: 4, name: 'Rohit Kumar',      gigsCompleted: 10, avgRating: 4.5, badges: 1, score: 105 },
  { rank: 5, userId: 5, name: 'Anjali Singh',     gigsCompleted:  8, avgRating: 4.6, badges: 1, score:  85 },
  { rank: 6, userId: 6, name: 'Dev Patel',        gigsCompleted:  7, avgRating: 4.3, badges: 1, score:  75 },
  { rank: 7, userId: 7, name: 'Meera Joshi',      gigsCompleted:  5, avgRating: 4.1, badges: 0, score:  50 },
  { rank: 8, userId: 8, name: 'Karan Verma',      gigsCompleted:  4, avgRating: 4.0, badges: 0, score:  40 },
  { rank: 9, userId: 9, name: 'Ishaan Gupta',     gigsCompleted:  3, avgRating: 3.9, badges: 0, score:  30 },
  { rank:10, userId:10, name: 'Simran Kaur',      gigsCompleted:  2, avgRating: 3.8, badges: 0, score:  20 },
];

const BADGE_DEFS = [
  { emoji: '⭐', name: 'First Gig',   desc: 'Completed first gig'  },
  { emoji: '🚀', name: 'Gig Pro',     desc: 'Completed 5 gigs'     },
  { emoji: '🌟', name: 'Super Star',  desc: 'Completed 10 gigs'    },
  { emoji: '☕', name: 'Coffee Pro',   desc: 'Worked 3+ café gigs'  },
  { emoji: '🎉', name: 'Event Star',  desc: 'Worked 3+ event gigs' },
  { emoji: '📚', name: 'Book Worm',   desc: 'Worked 3+ tuition gigs'},
];

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="leaderboard-page">

      <!-- Header -->
      <div class="lb-header">
        <div class="lb-title">
          <span class="trophy">🏆</span>
          <h1>GigBuddy Leaderboard</h1>
          <p>Top gig heroes this month!</p>
        </div>
      </div>

      <!-- Podium top 3 -->
      <div class="podium" *ngIf="leaders().length >= 3">
        <!-- 2nd -->
        <div class="podium-card silver">
          <div class="avatar">{{ leaders()[1].name[0] }}</div>
          <div class="podium-name">{{ leaders()[1].name }}</div>
          <div class="podium-score">{{ leaders()[1].gigsCompleted }} gigs</div>
          <div class="podium-rank">🥈 2nd</div>
        </div>
        <!-- 1st -->
        <div class="podium-card gold champion">
          <div class="crown">👑</div>
          <div class="avatar large">{{ leaders()[0].name[0] }}</div>
          <div class="podium-name">{{ leaders()[0].name }}</div>
          <div class="podium-score">{{ leaders()[0].gigsCompleted }} gigs</div>
          <div class="podium-rank">🥇 1st</div>
        </div>
        <!-- 3rd -->
        <div class="podium-card bronze">
          <div class="avatar">{{ leaders()[2].name[0] }}</div>
          <div class="podium-name">{{ leaders()[2].name }}</div>
          <div class="podium-score">{{ leaders()[2].gigsCompleted }} gigs</div>
          <div class="podium-rank">🥉 3rd</div>
        </div>
      </div>

      <!-- Full rankings list -->
      <div class="rankings-section">
        <h2>📋 Full Rankings</h2>
        <div class="rankings-list">
          <div
            *ngFor="let entry of leaders(); let i = index"
            class="rank-row"
            [class.top3]="i < 3"
            [class.my-rank]="entry.userId === currentUserId()">

            <div class="rank-num">
              <span *ngIf="i === 0">🥇</span>
              <span *ngIf="i === 1">🥈</span>
              <span *ngIf="i === 2">🥉</span>
              <span *ngIf="i > 2">#{{ i + 1 }}</span>
            </div>

            <div class="rank-avatar">{{ entry.name[0] }}</div>

            <div class="rank-info">
              <div class="rank-name">
                {{ entry.name }}
                <span class="you-tag" *ngIf="entry.userId === currentUserId()">YOU 🎯</span>
              </div>
              <div class="rank-stats">
                <span>✅ {{ entry.gigsCompleted }} gigs</span>
                <span>⭐ {{ entry.avgRating }}</span>
                <span>🏅 {{ entry.badges }} badges</span>
              </div>
            </div>

            <div class="rank-score">{{ entry.score }} pts</div>
          </div>
        </div>
      </div>

      <!-- Badge showcase -->
      <div class="badges-section">
        <h2>🏅 Earn These Badges</h2>
        <div class="badge-grid">
          <div class="badge-card" *ngFor="let b of allBadges">
            <div class="badge-emoji">{{ b.emoji }}</div>
            <div class="badge-name">{{ b.name }}</div>
            <div class="badge-desc">{{ b.desc }}</div>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .leaderboard-page {
      min-height: 100vh;
      background: linear-gradient(135deg, #0a0a1a 0%, #1a1040 50%, #0a1a2a 100%);
      padding: 24px 16px 80px;
      font-family: 'Nunito', sans-serif;
    }

    /* ─── Header ─────────────────────────────────── */
    .lb-header {
      text-align: center;
      margin-bottom: 32px;
    }
    .lb-title .trophy { font-size: 3rem; display: block; margin-bottom: 8px; }
    .lb-title h1 {
      font-family: 'Fredoka One', cursive;
      font-size: 2rem;
      color: #FFD93D;
      margin: 0;
    }
    .lb-title p { color: rgba(255,255,255,0.6); margin: 4px 0 0; }

    /* ─── Podium ─────────────────────────────────── */
    .podium {
      display: flex;
      justify-content: center;
      align-items: flex-end;
      gap: 12px;
      margin-bottom: 40px;
    }
    .podium-card {
      background: rgba(255,255,255,0.07);
      border: 2px solid rgba(255,255,255,0.15);
      border-radius: 20px;
      padding: 16px 20px;
      text-align: center;
      flex: 1;
      max-width: 140px;
      transition: transform 0.3s ease;
    }
    .podium-card:hover { transform: translateY(-4px); }
    .podium-card.gold { border-color: #FFD93D; background: rgba(255,217,61,0.1); }
    .podium-card.silver { border-color: #C0C0C0; background: rgba(192,192,192,0.08); }
    .podium-card.bronze { border-color: #CD7F32; background: rgba(205,127,50,0.08); }
    .champion { transform: translateY(-12px); }
    .crown { font-size: 1.5rem; margin-bottom: 4px; }
    .avatar {
      width: 48px; height: 48px;
      border-radius: 50%;
      background: linear-gradient(135deg, #4D96FF, #9B59B6);
      color: white;
      font-size: 1.3rem;
      font-weight: 700;
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 8px;
    }
    .avatar.large { width: 60px; height: 60px; font-size: 1.6rem; }
    .podium-name { color: white; font-weight: 700; font-size: 0.85rem; }
    .podium-score { color: rgba(255,255,255,0.6); font-size: 0.75rem; margin: 2px 0; }
    .podium-rank { font-size: 0.9rem; font-weight: 700; color: #FFD93D; }

    /* ─── Rankings List ──────────────────────────── */
    .rankings-section {
      max-width: 600px;
      margin: 0 auto 40px;
    }
    .rankings-section h2 {
      font-family: 'Fredoka One', cursive;
      color: white;
      font-size: 1.3rem;
      margin-bottom: 16px;
    }
    .rankings-list { display: flex; flex-direction: column; gap: 10px; }
    .rank-row {
      display: flex;
      align-items: center;
      gap: 12px;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 16px;
      padding: 12px 16px;
      transition: all 0.2s ease;
    }
    .rank-row:hover { background: rgba(255,255,255,0.09); transform: translateX(4px); }
    .rank-row.top3 { border-color: rgba(255,217,61,0.3); }
    .rank-row.my-rank { border-color: #4D96FF; background: rgba(77,150,255,0.1); }
    .rank-num { font-size: 1.1rem; min-width: 36px; text-align: center; }
    .rank-avatar {
      width: 40px; height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, #6BCB77, #4D96FF);
      color: white;
      font-weight: 700;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .rank-info { flex: 1; }
    .rank-name {
      color: white;
      font-weight: 700;
      font-size: 0.95rem;
      display: flex; align-items: center; gap: 6px;
    }
    .you-tag {
      background: #4D96FF;
      color: white;
      font-size: 0.65rem;
      padding: 2px 6px;
      border-radius: 8px;
      font-weight: 700;
    }
    .rank-stats {
      color: rgba(255,255,255,0.5);
      font-size: 0.78rem;
      display: flex; gap: 10px; margin-top: 2px;
    }
    .rank-score {
      font-family: 'Fredoka One', cursive;
      color: #FFD93D;
      font-size: 1.1rem;
    }

    /* ─── Badges showcase ────────────────────────── */
    .badges-section {
      max-width: 600px;
      margin: 0 auto;
    }
    .badges-section h2 {
      font-family: 'Fredoka One', cursive;
      color: white;
      font-size: 1.3rem;
      margin-bottom: 16px;
    }
    .badge-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
    }
    .badge-card {
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 16px;
      padding: 16px 12px;
      text-align: center;
      transition: transform 0.2s ease;
    }
    .badge-card:hover { transform: scale(1.05); border-color: rgba(255,217,61,0.4); }
    .badge-emoji { font-size: 2rem; margin-bottom: 6px; }
    .badge-name { color: white; font-weight: 700; font-size: 0.85rem; margin-bottom: 4px; }
    .badge-desc { color: rgba(255,255,255,0.5); font-size: 0.72rem; }
  `]
})
export class LeaderboardComponent implements OnInit {

  private http = inject(HttpClient);
  private auth = inject(AuthService);

  leaders = signal<LeaderEntry[]>([]);
  allBadges = BADGE_DEFS;
  currentUserId = computed(() => this.auth.currentUser()?.userId ?? -1);

  ngOnInit() {
    this.http.get<LeaderEntry[]>('http://localhost:8080/api/leaderboard?limit=10')
      .subscribe({
        next: data => this.leaders.set(data.map((e, i) => ({ ...e, rank: i + 1 }))),
        error: () => this.leaders.set(DEMO_LEADERS)
      });
  }
}
