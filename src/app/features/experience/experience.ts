import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Experience, Skill } from '../../core/models/portfolio.models';
import { PortfolioService } from '../../core/services/portfolio.service';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experience.html',
  styleUrls: ['./experience.scss']
})
export class ExperienceComponent implements OnInit {
  experiences = signal<Experience[]>([]);
  skillsMap = signal<Map<string, Skill>>(new Map());
  expandedExperiences = signal<Record<number, boolean>>({});
  portfolioService = inject(PortfolioService);

  toggleExperience(index: number) {
    this.expandedExperiences.update(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  }

  ngOnInit() {
    this.portfolioService.getSkills().subscribe(skills => {
      const map = new Map<string, Skill>();
      skills.forEach(skill => {
        map.set(skill.skillName.toLowerCase(), skill);
      });
      this.skillsMap.set(map);
    });

    this.portfolioService.getExperiences().subscribe(data => {
      this.experiences.set(data);
    });
  }

  getSkillIcon(techName: string): { logoUrl?: string; brandColor?: string } {
    const skill = this.skillsMap().get(techName.toLowerCase());
    return skill ? { logoUrl: skill.logoUrl, brandColor: skill.brandColor } : {};
  }

  formatDate(dateStr?: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }
}
