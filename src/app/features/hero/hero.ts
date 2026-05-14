import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Profile } from '../../core/models/portfolio.models';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.html',
  styleUrls: ['./hero.scss']
})
export class HeroComponent {
  @Input() profile: Profile | null = null;
}
