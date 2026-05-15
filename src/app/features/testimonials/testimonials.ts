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
  expandedTestimonials = signal<Record<number, boolean>>({});
  portfolioService = inject(PortfolioService);

  toggleTestimonial(index: number) {
    this.expandedTestimonials.update(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  }

  ngOnInit() {
    this.portfolioService.getTestimonials().subscribe(data => {
      this.testimonials.set(data);
    });
  }
}
