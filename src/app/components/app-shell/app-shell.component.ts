import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { GbToastOutletComponent } from '../gb-toast/gb-toast.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, GbToastOutletComponent],
  template: `
    <div class="app-shell">
      <aside class="sidebar">
        <div class="sidebar-brand">
          <div class="brand-icon">🎯</div>
          <div class="brand-text">
            <span class="brand-name">GigBuddy</span>
            <span class="brand-tag">{{ auth.currentUser()?.role === 'EMPLOYER' ? 'Employer' : 'Student' }}</span>
          </div>
        </div>

        <nav class="sidebar-nav">
          <span class="nav-section">Platform</span>
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" class="nav-item">
            <span class="nav-icon">🏠</span>
            <span>Home</span>
          </a>
          <a routerLink="/browse" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">🃏</span>
            <span>Browse Gigs</span>
          </a>

          <a routerLink="/leaderboard" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">🏆</span>
            <span>Leaderboard</span>
          </a>

          <span class="nav-section">My Account</span>
          <a routerLink="/my-gigs" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">📋</span>
            <span>My Gigs</span>
          </a>
          <a routerLink="/saved-gigs" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">🔖</span>
            <span>Saved Gigs</span>
          </a>
          <a routerLink="/notifications" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">🔔</span>
            <span>Notifications</span>
          </a>
          <a routerLink="/profile" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">👤</span>
            <span>Profile</span>
          </a>

          @if (auth.isEmployer()) {
            <span class="nav-section">Employer</span>
            <a routerLink="/post-gig" routerLinkActive="active" class="nav-item highlight">
              <span class="nav-icon">➕</span>
              <span>Post a Gig</span>
            </a>
          }
        </nav>

        <div class="sidebar-footer">
          @if (auth.isLoggedIn()) {
            <div class="user-card">
              <div class="user-avatar">{{ userInitial }}</div>
              <div class="user-info">
                <span class="user-name">{{ auth.currentUser()?.name }}</span>
                <span class="user-role">{{ auth.currentUser()?.role === 'EMPLOYER' ? '🏪 Employer' : '🎓 Student' }}</span>
              </div>
            </div>
            <button class="logout-btn" (click)="logout()">🚪 Logout</button>
          } @else {
            <a routerLink="/login" class="login-link">🔑 Login / Signup</a>
          }
        </div>
      </aside>

      <div class="main-area">
        <header class="topbar">
          <div class="topbar-left">
            <h1 class="page-title">{{ pageTitle }}</h1>
          </div>
          <div class="topbar-right">
            @if (auth.isLoggedIn()) {
              <a routerLink="/notifications" class="topbar-btn" title="Notifications">🔔</a>
              <a routerLink="/profile" class="topbar-btn avatar-btn" title="Profile">{{ userInitial }}</a>
            } @else {
              <a routerLink="/login" class="topbar-login">Login 🚀</a>
            }
          </div>
        </header>

        <main class="page-content">
          <router-outlet />
        </main>
      </div>
      <gb-toast-outlet />
    </div>
  `,
  styles: [`
    .app-shell {
      display: flex; height: 100dvh;
      background: var(--bg); overflow: hidden;
      font-family: 'Nunito', sans-serif;
    }
    .sidebar {
      width: 250px; flex-shrink: 0;
      display: flex; flex-direction: column;
      background: var(--sidebar-bg);
      border-right: 1px solid var(--border);
      padding: 20px 12px;
    }
    .sidebar-brand {
      display: flex; align-items: center; gap: 10px;
      padding: 4px 12px 20px;
    }
    .brand-icon {
      font-size: 1.6rem; line-height: 1;
    }
    .brand-text { display: flex; flex-direction: column; gap: 1px; }
    .brand-name {
      font-family: 'Fredoka One', cursive;
      font-size: 1.2rem; color: var(--text-primary);
    }
    .brand-tag {
      font-size: 0.68rem; font-weight: 600;
      color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.06em;
    }
    .sidebar-nav {
      flex: 1; display: flex; flex-direction: column; gap: 2px; overflow-y: auto;
    }
    .nav-section {
      font-size: 0.68rem; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.08em;
      color: var(--text-muted); padding: 14px 12px 6px;
    }
    .nav-item {
      display: flex; align-items: center; gap: 10px;
      padding: 9px 12px; border-radius: 10px;
      font-size: 0.875rem; font-weight: 600;
      color: var(--text-secondary); text-decoration: none;
      transition: all 0.15s ease; cursor: pointer;
    }
    .nav-item:hover { background: var(--bg-hover); color: var(--text-primary); }
    .nav-item.active { background: var(--accent-subtle); color: var(--accent); }
    .nav-item.highlight { background: rgba(107,203,119,0.1); color: #6BCB77; }
    .nav-item.highlight:hover { background: rgba(107,203,119,0.2); }
    .nav-icon { font-size: 1rem; }
    .sidebar-footer {
      padding-top: 12px; border-top: 1px solid var(--border);
      display: flex; flex-direction: column; gap: 8px;
    }
    .user-card {
      display: flex; align-items: center; gap: 10px;
      padding: 10px 12px; border-radius: 10px;
      background: var(--bg-secondary);
    }
    .user-avatar {
      width: 32px; height: 32px; border-radius: 8px;
      background: var(--accent); color: white;
      font-size: 0.85rem; font-weight: 700;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .user-info { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
    .user-name {
      font-size: 0.8rem; font-weight: 700;
      color: var(--text-primary); overflow: hidden;
      text-overflow: ellipsis; white-space: nowrap;
    }
    .user-role { font-size: 0.7rem; color: var(--text-muted); }
    .logout-btn {
      width: 100%; padding: 8px; border-radius: 10px;
      background: rgba(255,107,107,0.1); border: 1px solid rgba(255,107,107,0.2);
      color: #FF6B6B; font-family: inherit; font-size: 0.8rem; font-weight: 700;
      cursor: pointer; transition: all 0.15s;
    }
    .logout-btn:hover { background: rgba(255,107,107,0.2); }
    .login-link {
      display: block; text-align: center; padding: 10px;
      background: var(--accent); color: white; border-radius: 10px;
      font-size: 0.85rem; font-weight: 700; text-decoration: none;
    }
    .main-area { flex: 1; display: flex; flex-direction: column; min-width: 0; overflow: hidden; }
    .topbar {
      display: flex; align-items: center; justify-content: space-between;
      padding: 14px 28px; border-bottom: 1px solid var(--border);
      background: var(--bg); flex-shrink: 0; gap: 16px;
    }
    .page-title {
      font-family: 'Fredoka One', cursive;
      font-size: 1.3rem; color: var(--text-primary); margin: 0;
    }
    .topbar-right { display: flex; align-items: center; gap: 8px; }
    .topbar-btn {
      width: 36px; height: 36px; border-radius: 10px;
      border: 1px solid var(--border); background: var(--bg-secondary);
      color: var(--text-secondary); cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      font-size: 1rem; text-decoration: none; transition: all 0.15s;
    }
    .topbar-btn:hover { background: var(--bg-hover); color: var(--text-primary); }
    .avatar-btn {
      font-size: 0.8rem; font-weight: 700;
      background: var(--accent); color: white; border-color: var(--accent);
    }
    .topbar-login {
      padding: 6px 16px; border-radius: 10px;
      background: var(--accent); color: white;
      font-size: 0.85rem; font-weight: 700; text-decoration: none;
    }
    .page-content { flex: 1; overflow-y: auto; padding: 0; }
    @media (max-width: 900px) {
      .sidebar { width: 64px; padding: 14px 6px; }
      .brand-text, .nav-section, .nav-item span:not(.nav-icon),
      .user-info, .logout-btn, .login-link { display: none; }
      .nav-item { justify-content: center; padding: 10px; }
      .sidebar-brand { justify-content: center; padding-bottom: 14px; }
      .user-card { justify-content: center; padding: 8px; }
      .topbar { padding: 12px 16px; }
    }
  `]
})
export class AppShellComponent {
  auth = inject(AuthService);

  get userInitial(): string {
    const name = this.auth.currentUser()?.name || 'U';
    return name.charAt(0).toUpperCase();
  }

  get pageTitle(): string {
    const url = this.router.url;
    if (url.startsWith('/gig/'))         return '🔍 Gig Details';
    if (url.startsWith('/browse'))       return '🃏 Browse Gigs';
    if (url.startsWith('/post-gig'))     return '➕ Post a Gig';
    if (url.startsWith('/my-gigs'))      return '📋 My Gigs';
    if (url.startsWith('/saved-gigs'))   return '🔖 Saved Gigs';
    if (url.startsWith('/notifications'))return '🔔 Notifications';
    if (url.startsWith('/profile'))      return '👤 Profile';
    if (url.startsWith('/leaderboard'))  return '🏆 Leaderboard';
    if (url.startsWith('/onboarding'))   return '🐣 Setup Profile';
    return '🏠 GigBuddy';
  }

  constructor(private router: Router) {}

  logout(): void {
    this.auth.logout();
  }
}
