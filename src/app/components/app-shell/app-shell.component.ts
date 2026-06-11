import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-shell">
      <aside class="sidebar">
        <div class="sidebar-brand">
          <div class="brand-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div class="brand-text">
            <span class="brand-name">GigBuddy</span>
            <span class="brand-tag">Enterprise</span>
          </div>
        </div>

        <nav class="sidebar-nav">
          <span class="nav-section">Platform</span>
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" class="nav-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
            </svg>
            Dashboard
          </a>
          <a routerLink="/browse" routerLinkActive="active" class="nav-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            Job Listings
          </a>

          <span class="nav-section">Management</span>
          <a class="nav-item disabled">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            Applications
            <span class="nav-badge">Soon</span>
          </a>
          <a class="nav-item disabled">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            Post a Gig
            <span class="nav-badge">Soon</span>
          </a>
          <a class="nav-item disabled">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            Notifications
            <span class="nav-badge">Soon</span>
          </a>
        </nav>

        <div class="sidebar-footer">
          <div class="user-card">
            <div class="user-avatar">S</div>
            <div class="user-info">
              <span class="user-name">Student Account</span>
              <span class="user-role">Job Seeker</span>
            </div>
          </div>
        </div>
      </aside>

      <div class="main-area">
        <header class="topbar">
          <div class="topbar-left">
            @if (pageTitle) {
              <h1 class="page-title">{{ pageTitle }}</h1>
            }
          </div>
          <div class="topbar-right">
            <div class="search-box">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input type="text" placeholder="Search gigs, employers..." />
              <kbd>Ctrl K</kbd>
            </div>
            <button class="topbar-btn" title="Notifications">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            </button>
            <button class="topbar-btn avatar-btn" title="Profile">S</button>
          </div>
        </header>

        <main class="page-content">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: [`
    .app-shell {
      display: flex;
      height: 100dvh;
      background: var(--bg);
      overflow: hidden;
    }

    .sidebar {
      width: 260px;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      background: var(--sidebar-bg);
      border-right: 1px solid var(--border);
      padding: 20px 12px;
    }

    .sidebar-brand {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 4px 12px 24px;
    }

    .brand-icon {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: var(--accent);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .brand-text {
      display: flex;
      flex-direction: column;
      gap: 1px;
    }

    .brand-name {
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--text-primary);
      letter-spacing: -0.02em;
    }

    .brand-tag {
      font-size: 0.7rem;
      font-weight: 500;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

    .sidebar-nav {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .nav-section {
      font-size: 0.68rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--text-muted);
      padding: 16px 12px 8px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 9px 12px;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text-secondary);
      text-decoration: none;
      transition: all 0.15s ease;
      cursor: pointer;

      svg { flex-shrink: 0; opacity: 0.7; }

      &:hover:not(.disabled) {
        background: var(--bg-hover);
        color: var(--text-primary);
      }

      &.active {
        background: var(--accent-subtle);
        color: var(--accent);
        svg { opacity: 1; }
      }

      &.disabled {
        opacity: 0.5;
        cursor: default;
        pointer-events: none;
      }
    }

    .nav-badge {
      margin-left: auto;
      font-size: 0.65rem;
      font-weight: 600;
      padding: 2px 6px;
      border-radius: 4px;
      background: var(--bg-tertiary);
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .sidebar-footer {
      padding-top: 16px;
      border-top: 1px solid var(--border);
    }

    .user-card {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      border-radius: 8px;
      background: var(--bg-secondary);
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: var(--accent);
      color: white;
      font-size: 0.8rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .user-info {
      display: flex;
      flex-direction: column;
      gap: 1px;
    }

    .user-name {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .user-role {
      font-size: 0.7rem;
      color: var(--text-muted);
    }

    .main-area {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
      overflow: hidden;
    }

    .topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 32px;
      border-bottom: 1px solid var(--border);
      background: var(--bg);
      flex-shrink: 0;
      gap: 24px;
    }

    .page-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-primary);
      letter-spacing: -0.02em;
      margin: 0;
    }

    .topbar-right {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .search-box {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      background: var(--bg-secondary);
      border: 1px solid var(--border);
      border-radius: 8px;
      min-width: 280px;

      svg { color: var(--text-muted); flex-shrink: 0; }

      input {
        flex: 1;
        border: none;
        background: transparent;
        font-size: 0.85rem;
        color: var(--text-primary);
        outline: none;
        font-family: inherit;

        &::placeholder { color: var(--text-muted); }
      }

      kbd {
        font-size: 0.65rem;
        font-weight: 500;
        padding: 2px 6px;
        border-radius: 4px;
        background: var(--bg-tertiary);
        border: 1px solid var(--border);
        color: var(--text-muted);
        font-family: inherit;
      }
    }

    .topbar-btn {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      border: 1px solid var(--border);
      background: var(--bg-secondary);
      color: var(--text-secondary);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s ease;

      &:hover {
        background: var(--bg-hover);
        color: var(--text-primary);
      }
    }

    .avatar-btn {
      font-size: 0.8rem;
      font-weight: 600;
      background: var(--accent);
      color: white;
      border-color: var(--accent);
    }

    .page-content {
      flex: 1;
      overflow-y: auto;
      padding: 0;
    }

    @media (max-width: 900px) {
      .sidebar { width: 72px; padding: 16px 8px; }
      .brand-text, .nav-section, .nav-item span:not(.nav-badge), .user-info { display: none; }
      .nav-item { justify-content: center; padding: 10px; }
      .nav-badge { display: none; }
      .sidebar-brand { justify-content: center; padding-bottom: 16px; }
      .user-card { justify-content: center; padding: 8px; }
      .search-box { min-width: 180px; }
      .search-box kbd { display: none; }
    }
  `]
})
export class AppShellComponent {
  pageTitle = '';

  constructor(private router: Router) {
    this.router.events.subscribe(() => this.updateTitle());
    this.updateTitle();
  }

  private updateTitle() {
    const url = this.router.url;
    if (url.startsWith('/gig/')) this.pageTitle = 'Job Details';
    else if (url.startsWith('/browse')) this.pageTitle = 'Job Listings';
    else this.pageTitle = 'Dashboard';
  }
}
