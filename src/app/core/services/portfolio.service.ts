import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Profile,
  Experience,
  Project,
  ProjectDetail,
  Skill,
  Achievement,
  Testimonial,
  LanguageOption,
} from '../models/portfolio.models';
import {
  mockAchievements,
  mockExperiences,
  mockLanguages,
  mockProfile,
  mockProjectDetails,
  mockProjects,
  mockSkills,
  mockTestimonials,
} from '../mock/portfolio.mock';

@Injectable({
  providedIn: 'root',
})
export class PortfolioService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiBaseUrl + '/api';
  private mockModeSubject = new BehaviorSubject<boolean>(false);
  mockMode$ = this.mockModeSubject.asObservable();

  private enableMockMode() {
    if (!this.mockModeSubject.value) {
      this.mockModeSubject.next(true);
    }
  }

  private disableMockMode() {
    if (this.mockModeSubject.value) {
      this.mockModeSubject.next(false);
    }
  }

  getProfile(): Observable<Profile> {
    return this.http.get<Profile>(`${this.apiUrl}/profile`).pipe(
      tap(() => this.disableMockMode()),
      catchError(() => {
        this.enableMockMode();
        return of(mockProfile);
      }),
    );
  }

  getExperiences(): Observable<Experience[]> {
    return this.http.get<Experience[]>(`${this.apiUrl}/experiences`).pipe(
      tap(() => this.disableMockMode()),
      catchError(() => {
        this.enableMockMode();
        return of(mockExperiences);
      }),
    );
  }

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/projects`).pipe(
      tap(() => this.disableMockMode()),
      catchError(() => {
        this.enableMockMode();
        return of(mockProjects);
      }),
    );
  }

  getProjectBySlug(slug: string): Observable<ProjectDetail> {
    return this.http.get<ProjectDetail>(`${this.apiUrl}/projects/${slug}`).pipe(
      tap(() => this.disableMockMode()),
      catchError(() => {
        this.enableMockMode();
        return of(mockProjectDetails[slug] ?? (mockProjectDetails['portfolio-v2'] as ProjectDetail));
      }),
    );
  }

  getSkills(): Observable<Skill[]> {
    return this.http.get<Skill[]>(`${this.apiUrl}/skills`).pipe(
      tap(() => this.disableMockMode()),
      catchError(() => {
        this.enableMockMode();
        return of(mockSkills);
      }),
    );
  }

  getAchievements(): Observable<Achievement[]> {
    return this.http.get<Achievement[]>(`${this.apiUrl}/achievements`).pipe(
      tap(() => this.disableMockMode()),
      catchError(() => {
        this.enableMockMode();
        return of(mockAchievements);
      }),
    );
  }

  getTestimonials(): Observable<Testimonial[]> {
    return this.http.get<Testimonial[]>(`${this.apiUrl}/testimonials`).pipe(
      tap(() => this.disableMockMode()),
      catchError(() => {
        this.enableMockMode();
        return of(mockTestimonials);
      }),
    );
  }

  getLanguages(): Observable<LanguageOption[]> {
    return this.http.get<LanguageOption[]>(`${this.apiUrl}/translations/languages`).pipe(
      tap(() => this.disableMockMode()),
      catchError(() => {
        this.enableMockMode();
        return of(mockLanguages as LanguageOption[]);
      }),
    );
  }
}
