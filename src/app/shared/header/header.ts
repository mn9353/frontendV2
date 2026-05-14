import { Component, DestroyRef, Input, OnInit, inject, ChangeDetectorRef, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Profile } from '../../core/models/portfolio.models';
import { LanguageOption } from '../../core/models/portfolio.models';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';
import { auditTime, debounceTime, map, pairwise, startWith } from 'rxjs/operators';
import { PortfolioService } from '../../core/services/portfolio.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class HeaderComponent implements OnInit {
  @Input() profile: Profile | null = null;
  private destroyRef = inject(DestroyRef);
  private portfolioService = inject(PortfolioService);
  private cdr = inject(ChangeDetectorRef);
  private el = inject(ElementRef);
  
  isMenuOpen = false;
  isDark = true;
  currentLang = 'EN';
  languages: LanguageOption[] = [
    { languageCode: 'EN', languageName: 'English' },
    { languageCode: 'DE', languageName: 'Deutsch' },
  ];
  isLangMenuOpen = false;

  atTop = true;
  inHero = true;
  isHidden = false;
  isHovering = false;
  private lastScrollY = 0;
  private readonly topThresholdPx = 10;
  
  private get heroThresholdPx(): number {
    return typeof window !== 'undefined' ? window.innerHeight * 0.9 : 600;
  }

  private getScrollY(): number {
    return (
      window.scrollY ||
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0
    );
  }

  constructor() {
    // Persisted theme + language
    const savedTheme = window.localStorage.getItem('theme');
    this.isDark = savedTheme ? savedTheme === 'dark' : true;
    document.documentElement.classList.toggle('light-theme', !this.isDark);

    const savedLang = window.localStorage.getItem('lang');
    if (savedLang) this.currentLang = savedLang.toUpperCase();

    this.lastScrollY = this.getScrollY();
    this.atTop = this.lastScrollY <= this.topThresholdPx;
    this.inHero = this.lastScrollY <= this.heroThresholdPx;

    const scrollY$ = fromEvent(window, 'scroll').pipe(
      auditTime(30),
      map(() => this.getScrollY()),
      startWith(this.getScrollY()),
      takeUntilDestroyed(this.destroyRef),
    );

    // Direction-aware visibility.
    scrollY$
      .pipe(pairwise())
      .subscribe(([prevY, nextY]) => {
        const y = nextY;
        const delta = y - prevY;

        this.atTop = y <= this.topThresholdPx;
        this.inHero = y <= this.heroThresholdPx;

        if (this.inHero) {
          if (this.isHidden) {
            this.isHidden = false;
            this.cdr.detectChanges();
          }
          return;
        }

        if (delta > 5) {
          // Scrolling down -> hide
          if (!this.isHidden) {
            this.isHidden = true;
            this.isMenuOpen = false;
            this.isLangMenuOpen = false;
            this.cdr.detectChanges();
          }
        } else if (delta < -5) {
          // Scrolling up -> show
          if (this.isHidden) {
            this.isHidden = false;
            this.cdr.detectChanges();
          }
        }
      });

    // When scrolling stops for 2 seconds, disappear (unless in hero section or hovering)
    scrollY$
      .pipe(debounceTime(2000))
      .subscribe((y) => {
        const currentInHero = y <= this.heroThresholdPx;
        if (!currentInHero && !this.isHovering) {
          if (!this.isHidden) {
            this.isHidden = true;
            this.isMenuOpen = false;
            this.isLangMenuOpen = false;
            this.cdr.detectChanges();
          }
        }
      });
  }

  ngOnInit(): void {
    this.portfolioService
      .getLanguages()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((langs) => {
        const normalized = (langs || [])
          .map((l) => ({
            languageCode: (l?.languageCode || '').trim().toUpperCase(),
            languageName: (l?.languageName || '').trim(),
          }))
          .filter((l) => !!l.languageCode && !!l.languageName);

        this.languages = normalized.length ? normalized : this.languages;

        if (!this.languages.some((l) => l.languageCode === this.currentLang)) {
          this.currentLang = this.languages[0]?.languageCode || 'EN';
          window.localStorage.setItem('lang', this.currentLang);
        }
      });
  }

  onHeaderEnter() {
    this.isHovering = true;
    this.isHidden = false; // keep it visible while hovering
  }

  onHeaderLeave() {
    this.isHovering = false;
    // We do NOT immediately hide here. Let the user's scroll activity handle it.
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    if (!this.isMenuOpen) {
      this.isLangMenuOpen = false; // also close dropdown if menu is closed
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    // If either menu is open and the click was outside the header entirely
    if (this.isMenuOpen || this.isLangMenuOpen) {
      if (!this.el.nativeElement.contains(event.target as Node)) {
        this.isMenuOpen = false;
        this.isLangMenuOpen = false;
      }
    }
  }

  toggleTheme() {
    this.isDark = !this.isDark;
    document.documentElement.classList.toggle('light-theme', !this.isDark);
    window.localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
  }

  toggleLangMenu() {
    this.isLangMenuOpen = !this.isLangMenuOpen;
  }

  setLang(lang: string) {
    this.currentLang = lang.toUpperCase();
    this.isLangMenuOpen = false;
    // Here you would typically call a translation service
    window.localStorage.setItem('lang', this.currentLang);
    console.log(`Language changed to ${this.currentLang}`);
  }

  scrollTo(section: string) {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      this.isMenuOpen = false;
    }
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.isMenuOpen = false;
  }
}
