import { Component, OnInit, inject, signal, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project, ProjectDetail, Skill } from '../../core/models/portfolio.models';
import { PortfolioService } from '../../core/services/portfolio.service';
import { FormatTextPipe } from '../../shared/pipes/format-text.pipe';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, FormatTextPipe, TranslatePipe],
  templateUrl: './projects.html',
  styleUrls: ['./projects.scss']
})
export class ProjectsComponent implements OnInit {
  projects = signal<Project[]>([]);
  selectedProject = signal<Project | null>(null);
  projectDetails = signal<ProjectDetail | null>(null);
  skillsMap = signal<Map<string, Skill>>(new Map());
  portfolioService = inject(PortfolioService);

  @ViewChild('projectModal') projectModal!: ElementRef<HTMLDialogElement>;

  openProject(project: Project) {
    this.selectedProject.set(project);
    if (typeof document !== 'undefined') document.body.style.overflow = 'hidden';
    
    if (this.projectModal) {
      this.projectModal.nativeElement.showModal();
    }

    this.portfolioService.getProjectBySlug(project.slug).subscribe(details => {
      this.projectDetails.set(details);
    });
  }

  closeProject() {
    if (this.projectModal) {
      this.projectModal.nativeElement.close();
    }
    this.selectedProject.set(null);
    this.projectDetails.set(null);
    if (typeof document !== 'undefined') document.body.style.overflow = '';
  }

  onDialogClick(event: MouseEvent) {
    const dialog = this.projectModal.nativeElement;
    const rect = dialog.getBoundingClientRect();
    const isInDialog = (
      rect.top <= event.clientY &&
      event.clientY <= rect.top + rect.height &&
      rect.left <= event.clientX &&
      event.clientX <= rect.left + rect.width
    );
    if (!isInDialog) {
      this.closeProject();
    }
  }

  ngOnInit() {
    this.portfolioService.getProjects().subscribe(data => {
      this.projects.set(data);
    });

    this.portfolioService.getSkills().subscribe(skills => {
      const map = new Map<string, Skill>();
      skills.forEach(skill => map.set(skill.skillName.toLowerCase(), skill));
      this.skillsMap.set(map);
    });
  }

  getTechIcon(techName: string): { logoUrl?: string } {
    const skill = this.skillsMap().get(techName.toLowerCase());
    return skill ? { logoUrl: skill.logoUrl } : {};
  }
}
