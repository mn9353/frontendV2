import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

// Shared Components
import { HeaderComponent } from './shared/header/header';
import { FooterComponent } from './shared/footer/footer';

// Features Components
import { HeroComponent } from './features/hero/hero';
import { AboutComponent } from './features/about/about';
import { ExperienceComponent } from './features/experience/experience';
import { ProjectsComponent } from './features/projects/projects';
import { SkillsComponent } from './features/skills/skills';
import { AchievementsComponent } from './features/achievements/achievements';
import { TestimonialsComponent } from './features/testimonials/testimonials';
import { ContactComponent } from './features/contact/contact';
import { RevealOnScrollDirective } from './shared/directives/reveal-on-scroll.directive';

// Service & Models
import { PortfolioService } from './core/services/portfolio.service';
import { Profile } from './core/models/portfolio.models';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RevealOnScrollDirective,
    HeaderComponent,
    HeroComponent,
    AboutComponent,
    ExperienceComponent,
    ProjectsComponent,
    SkillsComponent,
    AchievementsComponent,
    TestimonialsComponent,
    ContactComponent,
    FooterComponent
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App implements OnInit {
  portfolioService = inject(PortfolioService);
  private destroyRef = inject(DestroyRef);
  
  profile = signal<Profile | null>(null);
  loading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);
  usingDemoData = signal<boolean>(false);

  ngOnInit() {
    this.portfolioService.mockMode$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((isMock) => this.usingDemoData.set(isMock));

    this.fetchProfile();
  }

  fetchProfile() {
    this.loading.set(true);
    this.errorMessage.set(null);
    
    this.portfolioService.getProfile().subscribe({
      next: (data: Profile) => {
        this.profile.set(data);
        this.loading.set(false);
      },
      error: (err: any) => {
        console.error('Error fetching profile', err);
        this.errorMessage.set(`Connection failed: ${err.message || 'Server unreachable'}`);
        this.loading.set(false);
      }
    });
  }
}
