import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'formatText',
  standalone: true
})
export class FormatTextPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string | null | undefined): SafeHtml {
    if (!value) return '';

    // 1. Convert literal '\n' strings to actual newlines
    let formatted = value.replace(/\\n/g, '\n');

    // 2. Make URLs clickable
    const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/g;
    formatted = formatted.replace(urlRegex, (url) => {
      let href = url;
      // Strip any trailing punctuation that might have been caught
      let cleanUrl = url;
      let trailing = '';
      if (/[.,;:]$/.test(url)) {
        trailing = url.charAt(url.length - 1);
        cleanUrl = url.slice(0, -1);
        href = cleanUrl;
      }
      
      if (!href.startsWith('http')) {
        href = 'https://' + href;
      }
      return `<a href="${href}" target="_blank" rel="noopener noreferrer" style="color: var(--text-primary); text-decoration: underline; text-underline-offset: 4px; font-weight: 500; transition: color 0.2s;">${cleanUrl}</a>${trailing}`;
    });

    // 3. Convert newlines to <br> tags
    formatted = formatted.replace(/\n/g, '<br>');

    // 4. Enhance bullet points spacing
    formatted = formatted.replace(/•/g, '<span style="color: var(--text-primary); margin-right: 4px;">&bull;</span>');

    return this.sanitizer.bypassSecurityTrustHtml(formatted);
  }
}
