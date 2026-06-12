import { Component, signal, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

const API = 'http://localhost:8080/api';

interface ChatMsg {
  id: number;
  senderId: number;
  senderName: string;
  message: string;
  sentAt: string;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="chat-page">
      <header class="chat-header">
        <a routerLink="/my-gigs" class="back-btn">← Back</a>
        <div class="chat-title">
          <span class="chat-icon">💬</span>
          <div>
            <h2>Application Chat</h2>
            <span class="chat-sub">App #{{ appId }}</span>
          </div>
        </div>
      </header>

      <div class="messages-area" #scrollRef>
        @if (loading()) {
          <div class="loading-state">
            <div class="spinner"></div>
            <span>Loading messages...</span>
          </div>
        }
        @for (msg of messages(); track msg.id) {
          <div class="message-wrap" [class.own]="msg.senderId === currentUserId()">
            <div class="msg-bubble" [class.own-bubble]="msg.senderId === currentUserId()">
              <p class="msg-text">{{ msg.message }}</p>
              <span class="msg-time">{{ formatTime(msg.sentAt) }}</span>
            </div>
            <span class="msg-name">{{ msg.senderId === currentUserId() ? 'You' : msg.senderName }}</span>
          </div>
        }
        @if (messages().length === 0 && !loading()) {
          <div class="empty-chat">
            <div class="empty-icon">💬</div>
            <p class="empty-title">No messages yet</p>
            <p class="empty-sub">Start the conversation — say hi! 👋</p>
          </div>
        }
      </div>

      <div class="chat-input-bar">
        <input
          class="chat-input"
          type="text"
          placeholder="Type a message..."
          [(ngModel)]="newMessage"
          (keyup.enter)="sendMessage()"
        />
        <button class="send-btn" (click)="sendMessage()" [disabled]="!newMessage.trim() || sending()">
          {{ sending() ? '⏳' : '➤' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .chat-page {
      display: flex; flex-direction: column; height: 100dvh;
      background: var(--bg); font-family: 'Nunito', sans-serif;
    }
    .chat-header {
      display: flex; align-items: center; gap: 16px;
      padding: 16px 20px; border-bottom: 1px solid var(--border);
      background: var(--bg-elevated); flex-shrink: 0;
    }
    .back-btn {
      color: var(--brand); font-weight: 700; text-decoration: none; font-size: 0.9rem;
    }
    .chat-title { display: flex; align-items: center; gap: 10px; }
    .chat-icon { font-size: 1.5rem; }
    .chat-title h2 { font-size: 1rem; font-weight: 800; color: var(--text); margin: 0; }
    .chat-sub { font-size: 0.75rem; color: var(--text-muted); }
    .messages-area {
      flex: 1; overflow-y: auto; padding: 20px 16px;
      display: flex; flex-direction: column; gap: 12px;
    }
    .message-wrap {
      display: flex; flex-direction: column; gap: 3px;
      align-items: flex-start;
      &.own { align-items: flex-end; }
    }
    .msg-bubble {
      max-width: 72%; padding: 10px 14px;
      background: var(--bg-elevated); border-radius: 18px 18px 18px 4px;
      border: 1px solid var(--border);
      &.own-bubble {
        background: var(--brand); border-color: var(--brand);
        border-radius: 18px 18px 4px 18px;
      }
    }
    .msg-text { margin: 0; font-size: 0.9rem; color: var(--text); }
    .msg-time { font-size: 0.68rem; color: rgba(255,255,255,0.4); margin-top: 3px; display: block; }
    .msg-name { font-size: 0.7rem; color: var(--text-muted); font-weight: 600; padding: 0 6px; }
    .empty-chat {
      flex: 1; display: flex; flex-direction: column; align-items: center;
      justify-content: center; gap: 10px; color: var(--text-muted);
    }
    .empty-icon { font-size: 3rem; }
    .empty-title { font-size: 1rem; font-weight: 700; color: var(--text); margin: 0; }
    .empty-sub { font-size: 0.85rem; color: var(--text-muted); margin: 0; }
    .loading-state {
      flex: 1; display: flex; flex-direction: column; align-items: center;
      justify-content: center; gap: 14px; color: var(--text-muted); font-size: 0.9rem;
    }
    .spinner {
      width: 36px; height: 36px; border-radius: 50%;
      border: 3px solid var(--border);
      border-top-color: var(--brand);
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .chat-input-bar {
      display: flex; gap: 10px; padding: 14px 16px;
      border-top: 1px solid var(--border); background: var(--bg-elevated); flex-shrink: 0;
    }
    .chat-input {
      flex: 1; padding: 12px 16px; font-family: inherit; font-size: 0.9rem;
      background: var(--bg); border: 1px solid var(--border); border-radius: 999px;
      color: var(--text); outline: none;
      &:focus { border-color: var(--brand); }
      &::placeholder { color: var(--text-muted); }
    }
    .send-btn {
      width: 46px; height: 46px; border-radius: 50%;
      background: var(--brand); border: none; color: white;
      font-size: 1rem; cursor: pointer;
      &:disabled { opacity: 0.5; cursor: not-allowed; }
    }
  `]
})
export class ChatComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  appId = 0;
  messages = signal<ChatMsg[]>([]);
  loading = signal(false);
  sending = signal(false);
  newMessage = '';
  private pollTimer: any;

  currentUserId() {
    return this.auth.currentUser()?.userId ?? 0;
  }

  ngOnInit() {
    this.appId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadMessages();
    // Poll every 5 seconds for new messages
    this.pollTimer = setInterval(() => this.loadMessages(), 5000);
  }

  ngOnDestroy() {
    if (this.pollTimer) clearInterval(this.pollTimer);
  }

  get headers() {
    const token = this.auth.getToken();
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
  }

  loadMessages() {
    this.loading.set(true);
    this.http.get<ChatMsg[]>(`${API}/chat/${this.appId}`, { headers: this.headers }).subscribe({
      next: msgs => { this.messages.set(msgs); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;
    this.sending.set(true);
    const text = this.newMessage;
    this.newMessage = '';
    this.http.post<ChatMsg>(`${API}/chat/${this.appId}`, { message: text }, { headers: this.headers })
      .subscribe({
        next: msg => { this.messages.update(m => [...m, msg]); this.sending.set(false); },
        error: () => { this.newMessage = text; this.sending.set(false); }
      });
  }

  formatTime(iso: string): string {
    return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  }
}
