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

  setLanguage(langCode: string) {
    this.currentLang.set(langCode);
    this.fetchTranslations(langCode);
  }

  private fetchTranslations(langCode: string) {
    this.http.get<Translation[]>(`${this.apiUrl}/${langCode}`).pipe(
      tap(data => {
        const dict: Record<string, string> = {};
        data.forEach(t => dict[t.translationKey] = t.translationValue);
        this.translations.set(dict);
      }),
      catchError(err => {
        console.error('Failed to load translations for ' + langCode, err);
        this.translations.set({});
        return of([]);
      })
    ).subscribe();
  }

  translate(key: string): string {
    const current = this.translations();
    return current[key] || key;
  }
}
