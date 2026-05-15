import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Skill } from '../../core/models/portfolio.models';
import { PortfolioService } from '../../core/services/portfolio.service';
import { RevealOnScrollDirective } from '../../shared/directives/reveal-on-scroll.directive';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, RevealOnScrollDirective, TranslatePipe],
  templateUrl: './skills.html',
  styleUrls: ['./skills.scss']
})
export class SkillsComponent implements OnInit, AfterViewInit, OnDestroy {
  skills = signal<Skill[]>([]);
  groupedSkills = signal<Record<string, Skill[]>>({});
  categories = signal<string[]>([]);
  hasError = signal<boolean>(false);
  portfolioService = inject(PortfolioService);

  private elRef = inject(ElementRef);
  private observer: IntersectionObserver | null = null;

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
    this.portfolioService.getSkills().subscribe({
      next: data => {
        this.hasError.set(false);
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

        // Re-observe newly rendered cards once Angular renders the list
        setTimeout(() => this.observeSkillItems(), 150);
      },
      error: () => this.hasError.set(true)
    });
  }

  retry() {
    this.hasError.set(false);
    this.ngOnInit();
  }

  ngAfterViewInit() {
    this.observeSkillItems();
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }

  /**
   * Wires up scroll-based "hover" effect for touch/mobile devices only.
   * Only the group card panels (.skill-group-card) get the lift effect —
   * individual skill chips are intentionally left static inside the panel.
   */
  private observeSkillItems(): void {
    // Guard: only run on touch/coarse-pointer devices (phones, tablets).
    if (!window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;

    this.observer?.disconnect();

    this.observer = new IntersectionObserver(
      (entries) => {
        // Find entries that are intersecting (visible within the root bounds)
        const visible = entries.filter(e => e.isIntersecting);

        if (visible.length === 0) {
          // If nothing visible, remove class from all observed cards
          const all = this.elRef.nativeElement.querySelectorAll('.skill-group-card');
          all.forEach((n: Element) => n.classList.remove('in-view'));
          return;
        }

        // Compute which visible entry is closest to the viewport vertical center
        const viewportCenter = window.innerHeight / 2;
        let best: {entry: IntersectionObserverEntry; distance: number} | null = null;

        visible.forEach(e => {
          const rect = (e.target as Element).getBoundingClientRect();
          const centerY = (rect.top + rect.bottom) / 2;
          const distance = Math.abs(centerY - viewportCenter);
          if (!best || distance < best.distance) best = { entry: e, distance };
        });

        // Apply 'in-view' only to the best candidate, remove from others
        const groupCards = this.elRef.nativeElement.querySelectorAll('.skill-group-card');
        groupCards.forEach((card: Element) => {
          if (best && card === best.entry.target) card.classList.add('in-view');
          else card.classList.remove('in-view');
        });
      },
      { root: null, rootMargin: '-40% 0px -40% 0px', threshold: 0 }
    );

    const groupCards = this.elRef.nativeElement.querySelectorAll('.skill-group-card');
    groupCards.forEach((card: Element) => this.observer!.observe(card));
  }
}
