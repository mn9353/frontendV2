import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Achievement } from '../../core/models/portfolio.models';
import { PortfolioService } from '../../core/services/portfolio.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-achievements',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './achievements.html',
  styleUrls: ['./achievements.scss']
})
export class AchievementsComponent implements OnInit {
  achievements = signal<Achievement[]>([]);
  hasError = signal<boolean>(false);
  portfolioService = inject(PortfolioService);

  ngOnInit() {
    this.portfolioService.getAchievements().subscribe({
      next: data => { this.achievements.set(data); this.hasError.set(false); },
      error: () => this.hasError.set(true)
    });
  }

  retry() {
    this.hasError.set(false);
    this.ngOnInit();
  }
}
