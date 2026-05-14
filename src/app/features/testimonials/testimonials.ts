import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Testimonial } from '../../core/models/portfolio.models';
import { PortfolioService } from '../../core/services/portfolio.service';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonials.html',
  styleUrls: ['./testimonials.scss']
})
export class TestimonialsComponent implements OnInit {
  testimonials = signal<Testimonial[]>([]);
  portfolioService = inject(PortfolioService);

  ngOnInit() {
    this.portfolioService.getTestimonials().subscribe(data => {
      this.testimonials.set(data);
    });
  }
}
