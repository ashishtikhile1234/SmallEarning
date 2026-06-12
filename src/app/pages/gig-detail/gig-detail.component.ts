import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { GigService } from '../../services/gig.service';
import { Gig } from '../../models/gig.model';
import { ConfettiComponent } from '../../components/confetti/confetti.component';

@Component({
  selector: 'app-gig-detail',
  standalone: true,
  imports: [CommonModule, ConfettiComponent],
  templateUrl: './gig-detail.component.html',
  styleUrls: ['./gig-detail.component.scss']
})
export class GigDetailComponent implements OnInit {
  @ViewChild(ConfettiComponent) confetti!: ConfettiComponent;

  gig: Gig | null = null;
  loading = signal(true);
  hasApplied = signal(false);
  isSavedGig = signal(false);
  showSuccessMsg = signal(false);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private gigService: GigService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    // Try selected gig first (already mapped)
    const selected = this.gigService.selectedGig();
    if (selected && selected.id === id) {
      this.gig = selected;
      this.loading.set(false);
      return;
    }
    // Otherwise fetch from backend, fallback to mock data
    this.gigService.getGigById(id).subscribe({
      next: api => {
        this.gig = this.gigService.mapGig(api);
        this.loading.set(false);
      },
      error: () => {
        // Try mock gig by id, or first mock gig as demo
        this.gig = this.gigService.getMockGigById(id)
          ?? this.gigService.getMockGigs()[0]
          ?? null;
        this.loading.set(false);
      }
    });
  }

  goBack() {
    this.router.navigate(['/browse']);
  }

  apply() {
    if (this.hasApplied()) return;
    this.confetti?.burst();
    this.hasApplied.set(true);
    this.showSuccessMsg.set(true);
    setTimeout(() => this.showSuccessMsg.set(false), 3000);
  }

  toggleSave() {
    this.isSavedGig.set(!this.isSavedGig());
  }

  isSaved() {
    return this.isSavedGig();
  }

  get payBadgeText(): string {
    if (!this.gig) return '';
    return this.gig.payType === 'hourly'
      ? `${this.gig.duration} shift`
      : 'Fixed compensation';
  }
}
