import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'gb-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="gb-badge" [style.--badge-color]="color">
      @if (emoji) { <span>{{ emoji }}</span> }
      {{ label }}
    </span>
  `,
  styles: [`
    .gb-badge {
      display: inline-flex; align-items: center; gap: 5px;
      padding: 5px 12px; border-radius: 999px;
      font-family: 'Nunito', sans-serif; font-size: 0.78rem; font-weight: 700;
      background: color-mix(in srgb, var(--badge-color, #6366f1) 18%, transparent);
      color: var(--badge-color, #6366f1);
      border: 1px solid color-mix(in srgb, var(--badge-color, #6366f1) 35%, transparent);
      white-space: nowrap; user-select: none;
      transition: transform 0.2s ease;

      &:hover { transform: scale(1.05); }
    }
  `]
})
export class GbBadgeComponent {
  @Input() label = '';
  @Input() emoji = '';
  @Input() color = '#6366f1';
}
