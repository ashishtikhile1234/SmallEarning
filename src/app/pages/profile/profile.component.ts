import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="profile-page">
      <div class="profile-hero">
        <div class="avatar-ring">
          <div class="avatar">{{ initial }}</div>
        </div>
        <div class="hero-info">
          <h2>{{ user?.name }}</h2>
          <span class="role-chip">{{ user?.role === 'EMPLOYER' ? '🏪 Employer' : '🎓 Student' }}</span>
          <p class="email">{{ user?.email }}</p>
        </div>
      </div>

      <div class="profile-cards">
        <div class="info-card">
          <h3>👤 Account Details</h3>
          <div class="info-row"><span class="label">Name</span><span>{{ user?.name }}</span></div>
          <div class="info-row"><span class="label">Email</span><span>{{ user?.email }}</span></div>
          <div class="info-row"><span class="label">Role</span><span>{{ user?.role }}</span></div>
          <div class="info-row"><span class="label">User ID</span><span>#{{ user?.userId }}</span></div>
        </div>

        <div class="info-card">
          <h3>{{ user?.role === 'EMPLOYER' ? '🏪 Employer Profile' : '🎓 Student Profile' }}</h3>
          @if (user?.role === 'STUDENT') {
            <div class="skills-section">
              <p class="label">Skills (coming soon)</p>
              <div class="skill-tags">
                <span class="skill-tag">JavaScript</span>
                <span class="skill-tag">Photography</span>
                <span class="skill-tag">Customer Service</span>
                <span class="skill-tag">Data Entry</span>
              </div>
            </div>
            <div class="info-row"><span class="label">Gigs Completed</span><span>🏆 0</span></div>
            <div class="info-row"><span class="label">Location</span><span>📍 Not set</span></div>
          }
          @if (user?.role === 'EMPLOYER') {
            <div class="info-row"><span class="label">Business Name</span><span>Not set</span></div>
            <div class="info-row"><span class="label">Business Type</span><span>Not set</span></div>
            <div class="info-row"><span class="label">Rating</span><span>⭐ New</span></div>
          }
          <button class="edit-btn" disabled>✏️ Edit Profile (Coming Soon)</button>
        </div>

        <div class="info-card stats-card">
          <h3>📊 Stats</h3>
          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-num">0</span>
              <span class="stat-label">{{ user?.role === 'EMPLOYER' ? 'Gigs Posted' : 'Applied' }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-num">0</span>
              <span class="stat-label">{{ user?.role === 'EMPLOYER' ? 'Hired' : 'Accepted' }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-num">⭐</span>
              <span class="stat-label">Rating</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-page { max-width: 700px; margin: 0 auto; padding: 2rem 1.5rem; font-family: 'Nunito', sans-serif; }
    .profile-hero { display: flex; align-items: center; gap: 1.5rem; margin-bottom: 2rem; padding: 1.5rem; background: var(--bg-secondary); border-radius: 20px; border: 1px solid var(--border); }
    .avatar-ring { padding: 4px; background: linear-gradient(135deg, #6BCB77, #4D96FF); border-radius: 50%; }
    .avatar { width: 72px; height: 72px; border-radius: 50%; background: var(--accent); color: white; font-family: 'Fredoka One', cursive; font-size: 2rem; display: flex; align-items: center; justify-content: center; }
    .hero-info h2 { font-family: 'Fredoka One', cursive; font-size: 1.8rem; color: var(--text-primary); margin: 0 0 0.4rem; }
    .role-chip { background: var(--accent-subtle); color: var(--accent); padding: 3px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 700; }
    .email { color: var(--text-muted); font-size: 0.85rem; margin: 0.4rem 0 0; }
    .profile-cards { display: flex; flex-direction: column; gap: 1rem; }
    .info-card { background: var(--bg-secondary); border: 1px solid var(--border); border-radius: 16px; padding: 1.4rem; }
    .info-card h3 { font-family: 'Fredoka One', cursive; font-size: 1.1rem; color: var(--text-primary); margin: 0 0 1rem; }
    .info-row { display: flex; justify-content: space-between; align-items: center; padding: 0.6rem 0; border-bottom: 1px solid var(--border); font-size: 0.9rem; }
    .info-row:last-child { border-bottom: none; }
    .label { color: var(--text-muted); font-weight: 600; }
    .skills-section { margin-bottom: 1rem; }
    .skill-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.5rem; }
    .skill-tag { background: var(--accent-subtle); color: var(--accent); padding: 4px 12px; border-radius: 20px; font-size: 0.78rem; font-weight: 700; }
    .edit-btn { width: 100%; margin-top: 1rem; padding: 0.7rem; border-radius: 10px; border: 2px dashed var(--border); background: transparent; color: var(--text-muted); font-family: inherit; font-size: 0.85rem; cursor: not-allowed; }
    .stats-card {}
    .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
    .stat-item { text-align: center; padding: 1rem; background: var(--bg); border-radius: 12px; }
    .stat-num { display: block; font-family: 'Fredoka One', cursive; font-size: 1.8rem; color: var(--text-primary); }
    .stat-label { font-size: 0.75rem; color: var(--text-muted); font-weight: 600; }
  `]
})
export class ProfileComponent {
  auth = inject(AuthService);
  get user() { return this.auth.currentUser(); }
  get initial() { return (this.user?.name || 'U').charAt(0).toUpperCase(); }
}
