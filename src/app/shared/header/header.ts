import { Component, DestroyRef, Input, OnInit, inject } from '@angular/core';
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
  
  isMenuOpen = false;
  isDark = true;
  currentLang = 'EN';
  languages: LanguageOption[] = [
    { languageCode: 'EN', languageName: 'English' },
    { languageCode: 'DE', languageName: 'Deutsch' },
  ];
  isLangMenuOpen = false;

  atTop = true;
  isHidden = false;
  isHovering = false;
  private lastScrollY = 0;
  private readonly topThresholdPx = 10;
  private readonly hideAfterPx = 80;
  private readonly revealOnUpThresholdPx = 6;

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
        const goingDown = delta > 1;
        const goingUp = delta < -1;

        this.atTop = y <= this.topThresholdPx;

        if (this.atTop) {
          this.isHidden = false;
          return;
        }

        // Scrolling down past the fold should always hide (even if hovering).
        if (goingDown && y > this.hideAfterPx) {
          this.isHidden = true;
          this.isMenuOpen = false;
          this.isLangMenuOpen = false;
          return;
        }

        // Scrolling up should reveal (ignore tiny jitter).
        if (goingUp && Math.abs(delta) >= this.revealOnUpThresholdPx) {
          this.isHidden = false;
        }
      });

    // When scrolling stops, auto-hide unless at top or hovering.
    scrollY$
      .pipe(debounceTime(160))
      .subscribe(() => {
        if (!this.atTop && !this.isHovering) {
          this.isHidden = true;
          this.isMenuOpen = false;
          this.isLangMenuOpen = false;
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
    this.isHidden = false;
  }

  onHeaderLeave() {
    this.isHovering = false;
    // If you're mid-page, let it auto-hide quickly when you stop interacting.
    if (!this.atTop) this.isHidden = true;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
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
