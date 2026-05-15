import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Testimonial } from '../../core/models/portfolio.models';
import { PortfolioService } from '../../core/services/portfolio.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './testimonials.html',
  styleUrls: ['./testimonials.scss']
})
export class TestimonialsComponent implements OnInit {
  testimonials = signal<Testimonial[]>([]);
  allExpanded = signal<boolean>(false);
  hasError = signal<boolean>(false);
  portfolioService = inject(PortfolioService);

  toggleAll() {
    this.allExpanded.update(v => !v);
  }

  ngOnInit() {
    this.portfolioService.getTestimonials().subscribe({
      next: data => { this.testimonials.set(data); this.hasError.set(false); },
      error: () => this.hasError.set(true)
    });
  }

  retry() {
    this.hasError.set(false);
    this.ngOnInit();
  }
}
