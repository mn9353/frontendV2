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

  get whatsAppUrl(): string | null {
    const phone = this.profile?.phoneNumber;
    if (!phone) return null;
    // Strip everything except digits and leading +
    const cleaned = phone.replace(/[\s\-()]/g, '');
    const firstName = this.profile?.fullName?.split(' ')[0] ?? 'there';
    const message = encodeURIComponent(
      `Hey ${firstName}, just explored your portfolio - wanted to connect with you.`
    );
    return `https://wa.me/${cleaned}?text=${message}`;
  }

  formatUrl(url: string | undefined | null): string {
    if (!url) return '#';
    if (url.startsWith('mailto:') || url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `https://${url}`;
  }
}
