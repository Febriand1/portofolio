export interface Project {
  id: string;
  title: string;
  subtitle: string;
  overview: string;
  responsibilities: string[];
  features: string[];
  architecture: {
    description: string;
    diagram?: string; // Optional URL/text diagram description
  };
  apiPreview?: {
    language: string;
    code: string;
  };
  gallery: string[];
  challenges: string;
  solutions: string;
  lessonsLearned: string;
  techStack: string[];
  githubUrl: string;
  liveUrl?: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  companyUrl?: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Freelance' | 'Internship';
  startDate: string;
  endDate: string; // "Present" if current
  description: string;
  achievements: string[];
  techStack: string[];
}

export interface SkillItem {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  yearsOfExperience?: number;
}

export interface SkillCategory {
  id: string;
  category: string;
  skills: SkillItem[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  description?: string;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialUrl?: string;
  credentialId?: string;
}

export interface Social {
  platform: string;
  url: string;
  label: string;
  iconName?: string; // To match icons
}

export interface JobApplication {
  id: number;
  company: string;
  position: string;
  status: string;
  updated_at: string;
}
