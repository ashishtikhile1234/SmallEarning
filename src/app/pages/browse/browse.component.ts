import {
  Component, OnInit, ViewChild, signal, QueryList, ViewChildren
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GigService } from '../../services/gig.service';
import { Gig, CATEGORY_CONFIG, GigCategory } from '../../models/gig.model';
import { SwipeCardComponent } from '../../components/swipe-card/swipe-card.component';
import { ConfettiComponent } from '../../components/confetti/confetti.component';

@Component({
  selector: 'app-browse',
  standalone: true,
  imports: [CommonModule, FormsModule, SwipeCardComponent, ConfettiComponent],
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss']
})
export class BrowseComponent implements OnInit {
  @ViewChildren(SwipeCardComponent) cardComponents!: QueryList<SwipeCardComponent>;
  @ViewChild(ConfettiComponent) confetti!: ConfettiComponent;

  allGigs: Gig[] = [];
  visibleGigs: Gig[] = [];
  doneGigs: Gig[] = [];
  acceptedCount = signal(0);
  passedCount = signal(0);
  selectedCategory = signal<GigCategory | 'all'>('all');
  showTip = signal(true);
  showAcceptToast = signal(false);
  cityFilter = '';
  sortBy = 'newest';
  loading = signal(false);

  sortOptions = [
    { value: 'newest',   label: '🕒 Newest' },
    { value: 'pay_desc', label: '💰 Pay: High→Low' },
    { value: 'pay_asc',  label: '💸 Pay: Low→High' },
    { value: 'duration', label: '⏱️ Shortest First' },
  ];

  categories = Object.entries(CATEGORY_CONFIG).map(([key, val]) => ({
    key: key as GigCategory,
    ...val
  }));

  constructor(private gigService: GigService, private router: Router) {}

  ngOnInit() {
    this.loadGigs();
    setTimeout(() => this.showTip.set(false), 4000);
  }

  loadGigs() {
    this.loading.set(true);
    const cat = this.selectedCategory() === 'all' ? undefined : this.selectedCategory();
    this.gigService.getGigs(cat, this.cityFilter || undefined, this.sortBy).subscribe({
      next: apiGigs => {
        this.allGigs = apiGigs.length > 0
          ? this.gigService.mapGigs(apiGigs)
          : this.gigService.getMockGigs();
        this.resetStack();
        this.loading.set(false);
      },
      error: () => {
        this.allGigs = this.gigService.getMockGigs();
        this.resetStack();
        this.loading.set(false);
      }
    });
  }

  get totalInCategory(): number {
    if (this.selectedCategory() === 'all') return this.allGigs.length;
    return this.allGigs.filter(g => g.category === this.selectedCategory()).length;
  }

  resetStack() {
    const filtered = this.selectedCategory() === 'all'
      ? this.allGigs
      : this.allGigs.filter(g => g.category === this.selectedCategory());
    this.visibleGigs = [...filtered];
    this.doneGigs = [];
    this.acceptedCount.set(0);
    this.passedCount.set(0);
  }

  get topGig(): Gig | null {
    return this.visibleGigs.length > 0
      ? this.visibleGigs[this.visibleGigs.length - 1]
      : null;
  }

  onSwiped(direction: string, gig: Gig) {
    if (direction === 'right') {
      this.acceptedCount.update(n => n + 1);
      this.confetti?.burst();
      this.gigService.selectGig(gig);
      this.showAcceptToast.set(true);
      setTimeout(() => this.showAcceptToast.set(false), 2500);
      this.removeTopCard(gig);
    } else if (direction === 'left') {
      this.passedCount.update(n => n + 1);
      this.removeTopCard(gig);
    }
  }

  private removeTopCard(gig: Gig) {
    this.doneGigs.push(gig);
    this.visibleGigs = this.visibleGigs.filter(g => g.id !== gig.id);
  }

  triggerSwipeLeft() {
    this.cardComponents?.last?.swipeLeft();
  }

  triggerSwipeRight() {
    this.cardComponents?.last?.swipeRight();
  }

  viewCurrentGig() {
    const gig = this.topGig;
    if (gig) {
      this.gigService.selectGig(gig);
      this.router.navigate(['/gig', gig.id]);
    }
  }

  setCategory(cat: GigCategory | 'all') {
    this.selectedCategory.set(cat);
    this.loadGigs();
    this.showTip.set(true);
    setTimeout(() => this.showTip.set(false), 3000);
  }

  reloadAll() {
    this.loadGigs();
  }

  applyFilters() {
    this.loadGigs();
  }

  goHome() {
    this.router.navigate(['/']);
  }

  get progressPercent(): number {
    const total = this.totalInCategory;
    const done = this.doneGigs.length;
    return total > 0 ? Math.round((done / total) * 100) : 0;
  }
}
