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
    this.gig = this.gigService.getGigById(id) ?? this.gigService.selectedGig() ?? null;
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
