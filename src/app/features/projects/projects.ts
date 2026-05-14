import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../core/models/portfolio.models';
import { PortfolioService } from '../../core/services/portfolio.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.html',
  styleUrls: ['./projects.scss']
})
export class ProjectsComponent implements OnInit {
  projects = signal<Project[]>([]);
  portfolioService = inject(PortfolioService);

  ngOnInit() {
    this.portfolioService.getProjects().subscribe(data => {
      this.projects.set(data);
    });
  }
}
