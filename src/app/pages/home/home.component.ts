import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GigService } from '../../services/gig.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  totalGigs = 0;

  constructor(private router: Router, private gigService: GigService) {}

  ngOnInit() {
    this.gigService.getGigs().subscribe({
      next: gigs => this.totalGigs = gigs.length || this.gigService.getMockGigs().length,
      error: () => this.totalGigs = this.gigService.getMockGigs().length
    });
  }

  startBrowsing() {
    this.router.navigate(['/browse']);
  }
}
