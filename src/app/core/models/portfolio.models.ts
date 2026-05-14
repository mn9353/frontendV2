export interface Profile {
  fullName: string;
  shortName?: string;
  role?: string;
  headline?: string;
  subheadline?: string;
  aboutMe?: string;
  email?: string;
  phoneNumber?: string;
  location?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  leetcodeUrl?: string;
  twitterUrl?: string;
  resumeUrl?: string;
  profileImageUrl?: string;
  availabilityStatus?: string;
}

export interface Technology {
  color: string;
  technology: string;
}

export interface Experience {
  companyName: string;
  role: string;
  shortDescription?: string;
  descriptionPoints?: string[];
  technologiesUsed?: Technology[];
  companyLogoUrl?: string;
  location?: string;
  employmentType?: string;
  startDate?: string;
  endDate?: string;
  isCurrent: boolean;
  highlightMetric?: string;
  displayOrder: number;
}

export interface Project {
  slug: string;
  projectName: string;
  shortDescription?: string;
  coverImageUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  projectType?: string;
  status?: string;
  featured?: boolean;
  technologiesUsed?: Technology[];
  displayOrder: number;
}

export interface ProjectSection {
  sectionType?: string;
  title?: string;
  content?: string;
  displayOrder: number;
}

export interface ProjectMedia {
  mediaType?: string;
  mediaUrl?: string;
  caption?: string;
  displayOrder: number;
}

export interface ProjectDetail extends Project {
  fullDescription?: string;
  metrics?: any;
  architectureSummary?: string;
  sections: ProjectSection[];
  media: ProjectMedia[];
}

export interface Skill {
  skillName: string;
  shortForm?: string;
  category?: string;
  logoUrl?: string;
  brandColor?: string;
  displayOrder: number;
}

export interface Achievement {
  metricValue?: string;
  metricLabel?: string;
  description?: string;
  iconName?: string;
  highlightColor?: string;
  displayOrder: number;
}

export interface Testimonial {
  clientName?: string;
  role?: string;
  companyName?: string;
  content?: string;
  profileImageUrl?: string;
  displayOrder: number;
}

export interface Translation {
  translationKey: string;
  translationValue: string;
  languageCode: string;
}

export interface LanguageOption {
  languageCode: string;
  languageName: string;
}
