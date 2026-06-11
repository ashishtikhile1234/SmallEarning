import {
  Component, Input, Output, EventEmitter, ElementRef, ViewChild,
  AfterViewInit, OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Gig } from '../../models/gig.model';

export type SwipeDirection = 'left' | 'right' | 'none';

@Component({
  selector: 'app-swipe-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './swipe-card.component.html',
  styleUrls: ['./swipe-card.component.scss']
})
export class SwipeCardComponent implements AfterViewInit, OnDestroy {
  @Input() gig!: Gig;
  @Input() zIndex: number = 1;
  @Input() isTop: boolean = false;
  @Input() stackOffset: number = 0;

  @Output() swiped = new EventEmitter<SwipeDirection>();

  @ViewChild('card') cardRef!: ElementRef<HTMLDivElement>;

  isDragging = false;
  startX = 0;
  startY = 0;
  currentX = 0;
  currentY = 0;
  rotation = 0;
  swipeIndicator: SwipeDirection = 'none';
  isFlying = false;

  private card!: HTMLDivElement;

  ngAfterViewInit() {
    this.card = this.cardRef.nativeElement;
    this.addPointerListeners();
  }

  ngOnDestroy() {
    this.removePointerListeners();
  }

  getStampOpacity(dir: 'left' | 'right'): number {
    if (this.swipeIndicator !== dir) return 0;
    const progress = Math.min(Math.abs(this.currentX) / 120, 1);
    return progress;
  }

  getOverlayOpacity(dir: 'left' | 'right'): number {
    if (dir === 'right' && this.currentX <= 0) return 0;
    if (dir === 'left' && this.currentX >= 0) return 0;
    return Math.min(Math.abs(this.currentX) / 150, 0.6);
  }

  private onPointerDown = (e: PointerEvent) => {
    if (!this.isTop || this.isFlying) return;
    this.isDragging = true;
    this.startX = e.clientX - this.currentX;
    this.startY = e.clientY - this.currentY;
    this.card.setPointerCapture(e.pointerId);
    this.card.style.transition = 'none';
  };

  private onPointerMove = (e: PointerEvent) => {
    if (!this.isDragging) return;
    this.currentX = e.clientX - this.startX;
    this.currentY = (e.clientY - this.startY) * 0.4;
    this.rotation = this.currentX * 0.06;

    const threshold = 50;
    if (this.currentX > threshold) this.swipeIndicator = 'right';
    else if (this.currentX < -threshold) this.swipeIndicator = 'left';
    else this.swipeIndicator = 'none';

    const scale = 1 + Math.min(Math.abs(this.currentX) / 2000, 0.02);
    this.card.style.transform =
      `translate(${this.currentX}px, ${this.currentY}px) rotate(${this.rotation}deg) scale(${scale})`;
  };

  private onPointerUp = () => {
    if (!this.isDragging) return;
    this.isDragging = false;

    const SWIPE_THRESHOLD = 90;
    if (this.currentX > SWIPE_THRESHOLD) {
      this.flyOut('right');
    } else if (this.currentX < -SWIPE_THRESHOLD) {
      this.flyOut('left');
    } else {
      this.resetCard();
    }
  };

  private flyOut(dir: SwipeDirection) {
    this.isFlying = true;
    const x = dir === 'right' ? window.innerWidth * 1.4 : -window.innerWidth * 1.4;
    const rot = dir === 'right' ? 22 : -22;
    const y = this.currentY - 60;
    this.card.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s ease';
    this.card.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg) scale(0.9)`;
    this.card.style.opacity = '0';
    setTimeout(() => this.swiped.emit(dir), 480);
  }

  private resetCard() {
    this.card.style.transition = 'transform 0.45s cubic-bezier(0.34, 1.4, 0.64, 1)';
    this.card.style.transform = 'translate(0px, 0px) rotate(0deg) scale(1)';
    this.currentX = 0;
    this.currentY = 0;
    this.rotation = 0;
    this.swipeIndicator = 'none';
  }

  swipeLeft() {
    if (!this.isTop || this.isFlying) return;
    this.swipeIndicator = 'left';
    this.currentX = -30;
    setTimeout(() => this.flyOut('left'), 80);
  }

  swipeRight() {
    if (!this.isTop || this.isFlying) return;
    this.swipeIndicator = 'right';
    this.currentX = 30;
    setTimeout(() => this.flyOut('right'), 80);
  }

  private addPointerListeners() {
    this.card.addEventListener('pointerdown', this.onPointerDown);
    this.card.addEventListener('pointermove', this.onPointerMove);
    this.card.addEventListener('pointerup', this.onPointerUp);
    this.card.addEventListener('pointercancel', this.onPointerUp);
  }

  private removePointerListeners() {
    if (this.card) {
      this.card.removeEventListener('pointerdown', this.onPointerDown);
      this.card.removeEventListener('pointermove', this.onPointerMove);
      this.card.removeEventListener('pointerup', this.onPointerUp);
      this.card.removeEventListener('pointercancel', this.onPointerUp);
    }
  }

  getStackStyle() {
    const offset = this.stackOffset;
    const scale = 1 - offset * 0.05;
    const translateY = offset * 14;
    const opacity = 1 - offset * 0.15;
    return {
      'z-index': this.zIndex,
      'transform': `translateY(${translateY}px) scale(${scale})`,
      'opacity': this.isTop ? 1 : opacity,
      'transition': this.isFlying ? 'none' : 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.35s ease',
    };
  }
}
