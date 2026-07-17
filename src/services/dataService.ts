import type { Project, Experience, SkillCategory, Education, Certificate, Social } from '../types/portfolio';

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch data from ${url} (status: ${response.status})`);
  }
  return response.json() as Promise<T>;
}

export const dataService = {
  async getProjects(lang: string): Promise<Project[]> {
    return fetchJson<Project[]>(`/data/${lang}/projects.json`);
  },

  async getProjectById(id: string, lang: string): Promise<Project | null> {
    const projects = await this.getProjects(lang);
    return projects.find((p) => p.id === id) || null;
  },

  async getExperience(lang: string): Promise<Experience[]> {
    return fetchJson<Experience[]>(`/data/${lang}/experience.json`);
  },

  async getSkills(lang: string): Promise<SkillCategory[]> {
    return fetchJson<SkillCategory[]>(`/data/${lang}/skills.json`);
  },

  async getEducation(lang: string): Promise<Education[]> {
    return fetchJson<Education[]>(`/data/${lang}/education.json`);
  },

  async getCertificates(lang: string): Promise<Certificate[]> {
    return fetchJson<Certificate[]>(`/data/${lang}/certificates.json`);
  },

  async getSocials(lang: string): Promise<Social[]> {
    return fetchJson<Social[]>(`/data/${lang}/socials.json`);
  },
};
