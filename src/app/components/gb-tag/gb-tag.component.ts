import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GigCategory, CATEGORY_CONFIG } from '../../models/gig.model';

@Component({
  selector: 'gb-tag',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="gb-tag" [style.--tag-color]="color" [style.--tag-bg]="bg">
      {{ emoji }} {{ label }}
    </span>
  `,
  styles: [`
    .gb-tag {
      display: inline-flex; align-items: center; gap: 4px;
      padding: 4px 12px; border-radius: 999px;
      font-family: 'Nunito', sans-serif; font-size: 0.78rem; font-weight: 700;
      background: var(--tag-bg, rgba(99,102,241,0.12));
      color: var(--tag-color, #6366f1);
      border: 1px solid color-mix(in srgb, var(--tag-color, #6366f1) 30%, transparent);
      white-space: nowrap;
    }
  `]
})
export class GbTagComponent {
  @Input() category: GigCategory | string = '';
  @Input() customLabel = '';
  @Input() customEmoji = '';
  @Input() customColor = '';

  get config() {
    return CATEGORY_CONFIG[this.category as GigCategory];
  }
  get emoji() { return this.customEmoji || this.config?.emoji || '🏷️'; }
  get label() { return this.customLabel || this.config?.label || this.category; }
  get color() { return this.customColor || this.config?.color || '#6366f1'; }
  get bg()    { return this.color + '1A'; } // 10% opacity hex append
}
