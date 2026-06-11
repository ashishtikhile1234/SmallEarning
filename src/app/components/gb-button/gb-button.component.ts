import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type GbButtonVariant = 'primary' | 'secondary' | 'danger' | 'success';
export type GbButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'gb-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      class="gb-btn"
      [class]="'gb-btn gb-btn--' + variant + ' gb-btn--' + size"
      [disabled]="disabled"
      [type]="type"
    >
      @if (emoji) { <span class="btn-emoji">{{ emoji }}</span> }
      <span class="btn-label"><ng-content /></span>
    </button>
  `,
  styles: [`
    .gb-btn {
      display: inline-flex; align-items: center; gap: 8px;
      font-family: 'Nunito', sans-serif; font-weight: 800;
      border: none; border-radius: 14px; cursor: pointer;
      transition: transform 0.18s cubic-bezier(0.22,1,0.36,1), box-shadow 0.18s ease;
      user-select: none;

      &:hover:not(:disabled) { transform: scale(1.04); }
      &:active:not(:disabled) { transform: scale(0.95); animation: wiggle 0.3s ease; }
      &:disabled { opacity: 0.5; cursor: not-allowed; }
    }

    /* Sizes */
    .gb-btn--sm { padding: 8px 16px; font-size: 0.8rem; }
    .gb-btn--md { padding: 12px 24px; font-size: 0.95rem; }
    .gb-btn--lg { padding: 16px 32px; font-size: 1.05rem; border-radius: 18px; }

    /* Variants */
    .gb-btn--primary {
      background: linear-gradient(135deg, #6366f1, #4f46e5);
      color: white; box-shadow: 0 6px 20px rgba(99,102,241,0.35);
    }
    .gb-btn--secondary {
      background: rgba(255,255,255,0.08);
      border: 1.5px solid rgba(255,255,255,0.15);
      color: rgba(255,255,255,0.85);
    }
    .gb-btn--danger {
      background: linear-gradient(135deg, #ff4757, #c0392b);
      color: white; box-shadow: 0 6px 20px rgba(255,71,87,0.3);
    }
    .gb-btn--success {
      background: linear-gradient(135deg, #6BCB77, #00A87D);
      color: white; box-shadow: 0 6px 20px rgba(107,203,119,0.3);
    }

    .btn-emoji { font-size: 1.1em; line-height: 1; }

    @keyframes wiggle {
      0%, 100% { transform: rotate(0deg) scale(0.95); }
      25% { transform: rotate(-3deg) scale(0.95); }
      75% { transform: rotate(3deg) scale(0.95); }
    }
  `]
})
export class GbButtonComponent {
  @Input() variant: GbButtonVariant = 'primary';
  @Input() size: GbButtonSize = 'md';
  @Input() emoji = '';
  @Input() disabled = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
}
