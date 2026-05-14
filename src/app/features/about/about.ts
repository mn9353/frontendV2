import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Profile } from '../../core/models/portfolio.models';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.html',
  styleUrls: ['./about.scss']
})
export class AboutComponent {
  @Input() profile: Profile | null = null;
}
