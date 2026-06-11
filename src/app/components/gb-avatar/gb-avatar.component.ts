import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

const PASTEL_COLORS = [
  '#FF9F43','#6BCB77','#4D96FF','#C77DFF',
  '#FF78C4','#FFD93D','#FF6B6B','#00C9A7',
];

function colorFromName(name: string): string {
  const code = [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return PASTEL_COLORS[code % PASTEL_COLORS.length];
}

@Component({
  selector: 'gb-avatar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="gb-avatar"
      [class]="'gb-avatar gb-avatar--' + size"
      [style.background]="imageUrl ? 'none' : color"
      [style.backgroundImage]="imageUrl ? 'url(' + imageUrl + ')' : 'none'"
      [style.backgroundSize]="'cover'"
      [style.backgroundPosition]="'center'"
      [title]="name"
    >
      @if (!imageUrl) {
        <span class="avatar-initials">{{ initials }}</span>
      }
    </div>
  `,
  styles: [`
    .gb-avatar {
      border-radius: 50%;
      border: 3px solid rgba(255,255,255,0.2);
      display: flex; align-items: center; justify-content: center;
      font-family: 'Fredoka One', cursive; font-weight: 700;
      color: rgba(0,0,0,0.7); flex-shrink: 0;
      box-shadow: 0 4px 14px rgba(0,0,0,0.2);
    }
    .gb-avatar--sm  { width: 36px;  height: 36px;  font-size: 0.9rem; }
    .gb-avatar--md  { width: 52px;  height: 52px;  font-size: 1.2rem; }
    .gb-avatar--lg  { width: 72px;  height: 72px;  font-size: 1.6rem; }
    .gb-avatar--xl  { width: 96px;  height: 96px;  font-size: 2.1rem; }

    .avatar-initials { line-height: 1; }
  `]
})
export class GbAvatarComponent {
  @Input() name = '';
  @Input() imageUrl = '';
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';

  get initials(): string {
    return this.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?';
  }
  get color(): string {
    return colorFromName(this.name || 'GB');
  }
}
