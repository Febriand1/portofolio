import type {
  Project,
  Experience,
  SkillCategory,
  Education,
  Certificate,
  Social,
  JobApplication,
} from '../types/portfolio';

const apiUrl = import.meta.env.VITE_API_URL;

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch data from ${url} (status: ${response.status})`,
    );
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

  async getJobApplications(forceRefresh = false): Promise<JobApplication[]> {
    const JOBS_CACHE_KEY = 'portfolio_jobs_cache';
    const JOBS_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

    if (!forceRefresh) {
      const cached = localStorage.getItem(JOBS_CACHE_KEY);
      if (cached) {
        try {
          const { timestamp, data } = JSON.parse(cached);
          const isFresh = Date.now() - timestamp < JOBS_CACHE_TTL;
          if (isFresh && Array.isArray(data)) {
            return data as JobApplication[];
          }
        } catch (e) {
          console.error('Failed to parse job applications cache:', e);
        }
      }
    }

    const result = await fetchJson<{
      success: boolean;
      data: JobApplication[];
    }>(`${apiUrl}/jobs`);
    if (result && result.success && Array.isArray(result.data)) {
      const data = result.data;
      try {
        const cacheObj = {
          timestamp: Date.now(),
          data,
        };
        localStorage.setItem(JOBS_CACHE_KEY, JSON.stringify(cacheObj));
      } catch (e) {
        console.error('Failed to set job applications cache:', e);
      }
      return data;
    }
    throw new Error('Invalid response format for job applications');
  },
};
