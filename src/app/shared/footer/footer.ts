import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Profile } from '../../core/models/portfolio.models';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.html',
  styleUrls: ['./footer.scss']
})
export class FooterComponent {
  @Input() profile: Profile | null = null;
  currentYear = new Date().getFullYear();
}
