import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GbToastService } from './gb-toast.service';

@Component({
  selector: 'gb-toast-outlet',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-outlet">
      @for (toast of toastSvc.toasts(); track toast.id) {
        <div class="toast-item" [class]="'toast-item toast-' + toast.type">
          <span class="toast-icon">{{ iconFor(toast.type) }}</span>
          <span class="toast-msg">{{ toast.message }}</span>
          <button class="toast-close" (click)="toastSvc.dismiss(toast.id)">✕</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-outlet {
      position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
      z-index: 9999; display: flex; flex-direction: column; gap: 10px;
      align-items: center; pointer-events: none; width: min(420px, 90vw);
    }
    .toast-item {
      display: flex; align-items: center; gap: 10px;
      padding: 13px 18px; border-radius: 16px; pointer-events: all;
      backdrop-filter: blur(16px); border: 1px solid transparent;
      font-family: 'Nunito', sans-serif; font-size: 0.9rem; font-weight: 700;
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
      animation: toastIn 0.35s cubic-bezier(0.22,1,0.36,1);
    }
    .toast-success { background: rgba(107,203,119,0.18); border-color: #6BCB77; color: #6BCB77; }
    .toast-error   { background: rgba(255,71,87,0.18);  border-color: #FF4757; color: #FF4757; }
    .toast-info    { background: rgba(77,150,255,0.18); border-color: #4D96FF; color: #4D96FF; }
    .toast-warning { background: rgba(255,217,61,0.18); border-color: #FFD93D; color: #FFD93D; }

    .toast-icon { font-size: 1.1rem; }
    .toast-msg  { flex: 1; }
    .toast-close {
      background: none; border: none; cursor: pointer; opacity: 0.6;
      font-size: 0.8rem; color: inherit; padding: 2px 4px;
      &:hover { opacity: 1; }
    }
    @keyframes toastIn {
      from { transform: translateY(20px); opacity: 0; }
      to   { transform: translateY(0);    opacity: 1; }
    }
  `]
})
export class GbToastOutletComponent {
  toastSvc = inject(GbToastService);

  iconFor(type: string): string {
    return { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' }[type] ?? 'ℹ️';
  }
}
