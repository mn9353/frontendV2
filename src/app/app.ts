import { Component, OnInit, inject, signal } from '@angular/core';
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
import { TranslationService } from './core/services/translation.service';
import { Profile } from './core/models/portfolio.models';

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
  translationService = inject(TranslationService);
  
  profile = signal<Profile | null>(null);
  loading = signal<boolean>(true);
  isHidingLoader = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  isDark = signal<boolean>(true);

  ngOnInit() {
    if (typeof window !== 'undefined') {
      const savedTheme = window.localStorage.getItem('theme');
      this.isDark.set(savedTheme ? savedTheme === 'dark' : true);
    }
    this.fetchProfile();
  }

  fetchProfile() {
    this.loading.set(true);
    this.isHidingLoader.set(false);
    this.errorMessage.set(null);
    
    // Minimum display time so the signature wipe animation fully plays
    const minLoadTime = new Promise(resolve => setTimeout(resolve, 2000));
    
    this.portfolioService.getProfile().subscribe({
      next: async (data: Profile) => {
        // Set profile IMMEDIATELY — page content is ready behind the loader
        this.profile.set(data);
        
        // Wait for the signature animation to finish before fading out
        await minLoadTime;
        
        this.isHidingLoader.set(true); // Trigger CSS fade out
        setTimeout(() => {
          this.loading.set(false); // Remove loader from DOM after fade
        }, 800);
      },
      error: async (err: any) => {
        await minLoadTime;
        console.error('Error fetching profile', err);
        this.errorMessage.set(`Connection failed: ${err.message || 'Server unreachable'}`);
        this.isHidingLoader.set(true);
        setTimeout(() => {
          this.loading.set(false);
        }, 800);
      }
    });
  }

  /** If the local bundled signature fails to load, fall back to the CDN URL */
  onSignatureError(event: Event) {
    const img = event.target as HTMLImageElement;
    const fallback = img.getAttribute('data-fallback');
    if (fallback && img.src !== fallback) {
      img.src = fallback;
    }
  }
}
