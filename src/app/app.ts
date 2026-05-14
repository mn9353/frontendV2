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
  isHidingLoader = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  usingDemoData = signal<boolean>(false);
  isDark = signal<boolean>(true);

  ngOnInit() {
    if (typeof window !== 'undefined') {
      const savedTheme = window.localStorage.getItem('theme');
      this.isDark.set(savedTheme ? savedTheme === 'dark' : true);
    }
    this.portfolioService.mockMode$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((isMock) => this.usingDemoData.set(isMock));

    this.fetchProfile();
  }

  fetchProfile() {
    this.loading.set(true);
    this.isHidingLoader.set(false);
    this.errorMessage.set(null);
    
    // Force a minimum display time for the signature animation to finish drawing
    const minLoadTime = new Promise(resolve => setTimeout(resolve, 2000));
    
    this.portfolioService.getProfile().subscribe({
      next: async (data: Profile) => {
        this.profile.set(data);
        
        await minLoadTime; // Wait for signature animation
        
        this.isHidingLoader.set(true); // Trigger fade out
        setTimeout(() => {
          this.loading.set(false); // Remove from DOM
        }, 1000); // Wait 1s for CSS fade out to finish
      },
      error: async (err: any) => {
        await minLoadTime;
        console.error('Error fetching profile', err);
        this.errorMessage.set(`Connection failed: ${err.message || 'Server unreachable'}`);
        // If error, we still fade out the loader and show error inline
        this.isHidingLoader.set(true);
        setTimeout(() => {
          this.loading.set(false);
        }, 1000);
      }
    });
  }
}
