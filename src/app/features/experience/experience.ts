import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Experience } from '../../core/models/portfolio.models';
import { PortfolioService } from '../../core/services/portfolio.service';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experience.html',
  styleUrls: ['./experience.scss']
})
export class ExperienceComponent implements OnInit {
  experiences = signal<Experience[]>([]);
  portfolioService = inject(PortfolioService);

  ngOnInit() {
    this.portfolioService.getExperiences().subscribe(data => {
      this.experiences.set(data);
    });
  }

  formatDate(dateStr?: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }
}
