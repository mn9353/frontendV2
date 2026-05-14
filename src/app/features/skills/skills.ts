import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Skill } from '../../core/models/portfolio.models';
import { PortfolioService } from '../../core/services/portfolio.service';
import { RevealOnScrollDirective } from '../../shared/directives/reveal-on-scroll.directive';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, RevealOnScrollDirective],
  templateUrl: './skills.html',
  styleUrls: ['./skills.scss']
})
export class SkillsComponent implements OnInit {
  skills = signal<Skill[]>([]);
  groupedSkills = signal<Record<string, Skill[]>>({});
  categories = signal<string[]>([]);
  portfolioService = inject(PortfolioService);

  private normalizeGroup(skill: Skill): string {
    const raw = (skill.category || '').trim().toLowerCase();

    if (raw.includes('front')) return 'Frontend';
    if (raw.includes('back')) return 'Backend';
    if (raw.includes('full')) return 'Full Stack';
    if (raw.includes('data') || raw.includes('db') || raw.includes('database')) return 'Database';
    if (raw.includes('devops') || raw.includes('cloud')) return 'DevOps & Cloud';
    if (raw.includes('tool')) return 'Tools';
    if (raw.includes('lang')) return 'Languages';

    const name = (skill.skillName || '').trim().toLowerCase();
    if (['angular', 'react', 'next.js', 'nextjs', 'vue', 'svelte', 'tailwind', 'css', 'scss', 'html'].some((x) => name.includes(x)))
      return 'Frontend';
    if (['.net', 'dotnet', 'c#', 'csharp', 'node', 'node.js', 'express', 'nestjs', 'api', 'asp.net'].some((x) => name.includes(x)))
      return 'Backend';
    if (['postgres', 'postgresql', 'mysql', 'mongodb', 'redis', 'sql'].some((x) => name.includes(x)))
      return 'Database';
    if (['docker', 'kubernetes', 'aws', 'azure', 'gcp', 'render', 'vercel', 'nginx', 'linux'].some((x) => name.includes(x)))
      return 'DevOps & Cloud';
    if (['typescript', 'javascript', 'python', 'java', 'go'].some((x) => name.includes(x)))
      return 'Languages';

    return skill.category || 'Other';
  }

  ngOnInit() {
    this.portfolioService.getSkills().subscribe(data => {
      this.skills.set(data);
      const grouped = data.reduce((acc, skill) => {
        const cat = this.normalizeGroup(skill);
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(skill);
        return acc;
      }, {} as Record<string, Skill[]>);
      
      this.groupedSkills.set(grouped);
      const order = ['Frontend', 'Backend', 'Full Stack', 'Database', 'DevOps & Cloud', 'Languages', 'Tools', 'Other'];
      const keys = Object.keys(grouped).sort((a, b) => {
        const ai = order.indexOf(a);
        const bi = order.indexOf(b);
        if (ai === -1 && bi === -1) return a.localeCompare(b);
        if (ai === -1) return 1;
        if (bi === -1) return -1;
        return ai - bi;
      });
      this.categories.set(keys);
    });
  }
}
