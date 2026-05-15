import { Pipe, PipeTransform, inject, ChangeDetectorRef, effect, EffectRef, OnDestroy } from '@angular/core';
import { TranslationService } from '../../core/services/translation.service';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false
})
export class TranslatePipe implements PipeTransform, OnDestroy {
  private translationService = inject(TranslationService);
  private cdr = inject(ChangeDetectorRef);
  private effectRef: EffectRef;

  constructor() {
    // When the translations signal changes (language switch), mark the
    // host view dirty so Angular re-runs this pipe's transform().
    this.effectRef = effect(() => {
      this.translationService.translations(); // subscribe to signal
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy() {
    this.effectRef.destroy();
  }

  transform(value: string | undefined | null): string {
    if (!value) return '';
    const translations = this.translationService.translations();
    return translations[value] || value;
  }
}
