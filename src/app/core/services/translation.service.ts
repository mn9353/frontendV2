import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Translation } from '../models/portfolio.models';
import { tap, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiBaseUrl + '/api/translations';

  currentLang = signal<string>('EN');
  translations = signal<Record<string, string>>({});
  showTranslationError = signal<boolean>(false);
  private toastTimer: ReturnType<typeof setTimeout> | null = null;

  setLanguage(langCode: string) {
    this.currentLang.set(langCode);
    // English needs no API call — the pipe falls back to the original key
    if (langCode === 'EN') {
      this.translations.set({});
      return;
    }
    this.fetchTranslations(langCode);
  }

  private fetchTranslations(langCode: string) {
    this.http.get<Translation[]>(`${this.apiUrl}/${langCode}`).pipe(
      tap(data => {
        const dict: Record<string, string> = {};
        data.forEach(t => dict[t.translationKey] = t.translationValue);
        this.translations.set(dict);
        // Only persist to localStorage after a confirmed successful fetch
        if (typeof window !== 'undefined') {
          window.localStorage.setItem('lang', langCode);
        }
      }),
      catchError(err => {
        console.error('Failed to load translations for ' + langCode, err);
        // Revert everything back to English
        this.translations.set({});
        this.currentLang.set('EN');
        if (typeof window !== 'undefined') {
          window.localStorage.setItem('lang', 'EN');
        }
        this.triggerTranslationErrorToast();
        return of([]);
      })
    ).subscribe();
  }

  private triggerTranslationErrorToast() {
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.showTranslationError.set(true);
    this.toastTimer = setTimeout(() => {
      this.showTranslationError.set(false);
    }, 3000);
  }

  translate(key: string): string {
    const current = this.translations();
    return current[key] || key;
  }
}
