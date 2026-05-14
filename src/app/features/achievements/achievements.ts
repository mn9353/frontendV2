import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Achievement } from '../../core/models/portfolio.models';
import { PortfolioService } from '../../core/services/portfolio.service';

@Component({
  selector: 'app-achievements',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './achievements.html',
  styleUrls: ['./achievements.scss']
})
export class AchievementsComponent implements OnInit {
  achievements = signal<Achievement[]>([]);
  portfolioService = inject(PortfolioService);

  ngOnInit() {
    this.portfolioService.getAchievements().subscribe(data => {
      this.achievements.set(data);
    });
  }
}
