import {
  Achievement,
  Experience,
  Profile,
  Project,
  ProjectDetail,
  Skill,
  Testimonial,
} from '../models/portfolio.models';

export const mockProfile: Profile = {
  fullName: 'Your Name',
  shortName: 'YN',
  role: 'Full‑Stack Developer',
  headline: 'I build fast, modern web apps end‑to‑end.',
  subheadline:
    'Angular • .NET • PostgreSQL • REST APIs • Cloud deployment • UX polish',
  aboutMe:
    "I’m a full‑stack developer focused on building clean, scalable products with great UX. I enjoy turning complex problems into simple, reliable systems — from database design to pixel‑perfect UI.",
  email: 'you@example.com',
  location: 'India',
  githubUrl: 'https://github.com/your-handle',
  linkedinUrl: 'https://linkedin.com/in/your-handle',
  resumeUrl: '#',
  availabilityStatus: 'Available',
};

export const mockExperiences: Experience[] = [
  {
    companyName: 'Product Company',
    role: 'Full‑Stack Engineer',
    shortDescription: 'Built customer‑facing features and internal tools.',
    descriptionPoints: [
      'Designed REST APIs and shipped production features with Angular + .NET.',
      'Improved performance and reliability using caching and query tuning.',
      'Collaborated with design to deliver a clean, accessible UI system.',
    ],
    technologiesUsed: [
      { technology: 'Angular', color: '#DD0031' },
      { technology: '.NET', color: '#512BD4' },
      { technology: 'PostgreSQL', color: '#336791' },
    ],
    location: 'Remote',
    employmentType: 'Full‑time',
    startDate: '2024-01-01',
    endDate: undefined,
    isCurrent: true,
    highlightMetric: 'Shipped 20+ features',
    displayOrder: 1,
  },
  {
    companyName: 'Agency / Freelance',
    role: 'Full‑Stack Developer',
    shortDescription: 'Delivered websites and dashboards for clients.',
    descriptionPoints: [
      'Built responsive UIs and integrated third‑party APIs.',
      'Owned deployment, monitoring, and maintenance.',
    ],
    technologiesUsed: [
      { technology: 'TypeScript', color: '#3178C6' },
      { technology: 'Node.js', color: '#22C55E' },
    ],
    location: 'Hybrid',
    employmentType: 'Contract',
    startDate: '2022-06-01',
    endDate: '2023-12-01',
    isCurrent: false,
    highlightMetric: '10+ client launches',
    displayOrder: 2,
  },
];

export const mockProjects: Project[] = [
  {
    slug: 'portfolio-v2',
    projectName: 'Portfolio V2',
    shortDescription:
      'A premium portfolio with a .NET API backend and Angular frontend.',
    coverImageUrl: undefined,
    githubUrl: 'https://github.com/your-handle',
    liveUrl: '#',
    projectType: 'Web App',
    status: 'Live',
    featured: true,
    technologiesUsed: [
      { technology: 'Angular', color: '#DD0031' },
      { technology: '.NET', color: '#512BD4' },
      { technology: 'PostgreSQL', color: '#336791' },
    ],
    displayOrder: 1,
  },
  {
    slug: 'gym-management',
    projectName: 'Gym Management System',
    shortDescription:
      'Member management, payments, and dashboards with role‑based access.',
    coverImageUrl: undefined,
    githubUrl: 'https://github.com/your-handle',
    liveUrl: '#',
    projectType: 'SaaS',
    status: 'Active',
    featured: true,
    technologiesUsed: [
      { technology: 'Angular', color: '#DD0031' },
      { technology: 'C#', color: '#A855F7' },
      { technology: 'SQL', color: '#38BDF8' },
    ],
    displayOrder: 2,
  },
  {
    slug: 'api-starter',
    projectName: 'API Starter',
    shortDescription:
      'Clean architecture starter with auth, logging, and Swagger.',
    coverImageUrl: undefined,
    githubUrl: 'https://github.com/your-handle',
    liveUrl: '#',
    projectType: 'Backend',
    status: 'Template',
    featured: false,
    technologiesUsed: [
      { technology: '.NET', color: '#512BD4' },
      { technology: 'Swagger', color: '#22C55E' },
    ],
    displayOrder: 3,
  },
];

export const mockProjectDetails: Record<string, ProjectDetail> = {
  'portfolio-v2': {
    ...mockProjects[0],
    fullDescription:
      'A portfolio built for speed and polish, backed by a clean .NET API and deployed in the cloud.',
    architectureSummary:
      'Angular standalone components + a thin HTTP client, backed by a .NET 8 Web API with Postgres.',
    sections: [
      {
        sectionType: 'overview',
        title: 'Highlights',
        content:
          'Responsive UI, environment-based API config, and a backend-first data model.',
        displayOrder: 1,
      },
    ],
    media: [],
    metrics: {
      performance: 'Fast initial load',
      ux: 'Premium dark theme',
    },
  },
};

export const mockSkills: Skill[] = [
  {
    skillName: 'Angular',
    shortForm: 'NG',
    category: 'Frontend',
    logoUrl: undefined,
    brandColor: '#DD0031',
    displayOrder: 1,
  },
  {
    skillName: '.NET',
    shortForm: 'NET',
    category: 'Backend',
    logoUrl: undefined,
    brandColor: '#512BD4',
    displayOrder: 2,
  },
  {
    skillName: 'PostgreSQL',
    shortForm: 'PG',
    category: 'Database',
    logoUrl: undefined,
    brandColor: '#336791',
    displayOrder: 3,
  },
  {
    skillName: 'TypeScript',
    shortForm: 'TS',
    category: 'Language',
    logoUrl: undefined,
    brandColor: '#3178C6',
    displayOrder: 4,
  },
  {
    skillName: 'Docker',
    shortForm: 'DKR',
    category: 'DevOps',
    logoUrl: undefined,
    brandColor: '#2496ED',
    displayOrder: 5,
  },
];

export const mockAchievements: Achievement[] = [
  {
    metricValue: '20+',
    metricLabel: 'Features shipped',
    description: 'Delivered high-quality features from design to deployment.',
    iconName: 'ri-rocket-line',
    highlightColor: '#A855F7',
    displayOrder: 1,
  },
  {
    metricValue: '99.9%',
    metricLabel: 'Uptime',
    description: 'Production-first mindset with monitoring and fast rollbacks.',
    iconName: 'ri-shield-check-line',
    highlightColor: '#22C55E',
    displayOrder: 2,
  },
  {
    metricValue: 'Fast',
    metricLabel: 'Performance',
    description: 'Optimized APIs and UIs for real-world usage.',
    iconName: 'ri-flashlight-line',
    highlightColor: '#38BDF8',
    displayOrder: 3,
  },
];

export const mockTestimonials: Testimonial[] = [
  {
    clientName: 'Client Name',
    role: 'Founder',
    companyName: 'Startup',
    content:
      'Great communication and excellent execution. The product shipped on time and looks premium.',
    profileImageUrl: undefined,
    displayOrder: 1,
  },
  {
    clientName: 'Teammate Name',
    role: 'Engineering Lead',
    companyName: 'Company',
    content:
      'Reliable, fast, and thoughtful. Strong full-stack ownership and attention to details.',
    profileImageUrl: undefined,
    displayOrder: 2,
  },
];

export const mockLanguages = [
  { languageCode: 'EN', languageName: 'English' },
  { languageCode: 'DE', languageName: 'Deutsch' },
];
