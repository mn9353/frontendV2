import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Profile } from '../../core/models/portfolio.models';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './contact.html',
  styleUrls: ['./contact.scss']
})
export class ContactComponent {
  @Input() profile: Profile | null = null;

  formatUrl(url: string | undefined | null): string {
    if (!url) return '#';
    // If it's an email link or already has http/https, return as is
    if (url.startsWith('mailto:') || url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    // Otherwise, prepend https:// so it acts as an absolute external link
    return `https://${url}`;
  }
}
