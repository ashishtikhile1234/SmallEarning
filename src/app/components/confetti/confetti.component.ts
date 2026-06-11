import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Particle {
  id: number;
  x: number;
  color: string;
  size: number;
  duration: number;
  delay: number;
  shape: 'circle' | 'square' | 'star';
  rotation: number;
}

@Component({
  selector: 'app-confetti',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="confetti-wrapper" *ngIf="active">
      @for (p of particles; track p.id) {
        <div
          class="particle"
          [class]="'shape-' + p.shape"
          [style.left.%]="p.x"
          [style.background]="p.color"
          [style.width.px]="p.size"
          [style.height.px]="p.size"
          [style.animation-duration.s]="p.duration"
          [style.animation-delay.s]="p.delay"
          [style.border-radius]="p.shape === 'circle' ? '50%' : (p.shape === 'square' ? '4px' : '0')"
        >{{ p.shape === 'star' ? '⭐' : '' }}</div>
      }
    </div>
  `,
  styles: [`
    .confetti-wrapper {
      position: fixed;
      top: 0; left: 0;
      width: 100vw; height: 100vh;
      pointer-events: none;
      z-index: 9999;
      overflow: hidden;
    }
    .particle {
      position: absolute;
      top: -30px;
      animation: confetti-fall linear forwards;
    }
    @keyframes confetti-fall {
      0%   { transform: translateY(0) rotate(0deg);   opacity: 1; }
      80%  { opacity: 1; }
      100% { transform: translateY(110vh) rotate(900deg); opacity: 0; }
    }
  `]
})
export class ConfettiComponent implements OnInit, OnDestroy {
  active = false;
  particles: Particle[] = [];
  private timer: any;

  private colors = ['#FFD93D', '#FF6B6B', '#6BCB77', '#4D96FF', '#C77DFF', '#FF9F43', '#FF78C4'];

  burst() {
    this.particles = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: this.colors[Math.floor(Math.random() * this.colors.length)],
      size: 8 + Math.random() * 10,
      duration: 1.5 + Math.random() * 1.5,
      delay: Math.random() * 0.5,
      shape: (['circle', 'square', 'star'] as const)[Math.floor(Math.random() * 3)],
      rotation: Math.random() * 360,
    }));
    this.active = true;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => { this.active = false; this.particles = []; }, 3500);
  }

  ngOnInit() {}

  ngOnDestroy() {
    clearTimeout(this.timer);
  }
}
