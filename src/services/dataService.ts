import type {
  Project,
  Experience,
  SkillCategory,
  Education,
  Certificate,
  Social,
  JobApplication,
  PaginatedJobsResponse,
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

  async getJobApplications(
    page: number,
    limit: number,
    status: string,
    search: string,
    order: string,
    forceRefresh = false,
  ): Promise<PaginatedJobsResponse> {
    const CACHE_KEY = `jobs_cache_p${page}_l${limit}_s${status}_q${search}_o${order}`;
    const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

    if (!forceRefresh) {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        try {
          const { timestamp, response } = JSON.parse(cached);
          const isFresh = Date.now() - timestamp < CACHE_TTL;
          if (isFresh && response && response.success) {
            return response as PaginatedJobsResponse;
          }
        } catch (e) {
          console.error('Failed to parse paginated jobs cache:', e);
        }
      }
    }

    const params = new URLSearchParams();
    params.append('page', String(page));
    params.append('limit', String(limit));
    if (status && status !== 'all') {
      params.append('status', status);
    }
    if (search && search.trim()) {
      params.append('search', search.trim());
    }
    params.append('order', order);

    const url = `${apiUrl}/jobs?${params.toString()}`;
    const result = await fetchJson<PaginatedJobsResponse>(url);

    if (result && result.success) {
      try {
        const cacheObj = {
          timestamp: Date.now(),
          response: result,
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheObj));
      } catch (e) {
        console.error('Failed to set paginated jobs cache:', e);
      }
      return result;
    }
    throw new Error('Invalid response format for paginated job applications');
  },

  async getJobGlobalStats(forceRefresh = false): Promise<JobApplication[]> {
    const STATS_CACHE_KEY = 'portfolio_jobs_global_stats_cache';
    const STATS_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

    if (!forceRefresh) {
      const cached = localStorage.getItem(STATS_CACHE_KEY);
      if (cached) {
        try {
          const { timestamp, data } = JSON.parse(cached);
          const isFresh = Date.now() - timestamp < STATS_CACHE_TTL;
          if (isFresh && Array.isArray(data)) {
            return data as JobApplication[];
          }
        } catch (e) {
          console.error('Failed to parse global stats jobs cache:', e);
        }
      }
    }

    const url = `${apiUrl}/jobs?order=desc`;
    // Fetch the entire dataset to compute stats
    const result = await fetchJson<{
      success: boolean;
      data: JobApplication[];
    }>(url);
    if (result && result.success && Array.isArray(result.data)) {
      const data = result.data;
      try {
        const cacheObj = {
          timestamp: Date.now(),
          data,
        };
        localStorage.setItem(STATS_CACHE_KEY, JSON.stringify(cacheObj));
      } catch (e) {
        console.error('Failed to set global stats jobs cache:', e);
      }
      return data;
    }
    throw new Error('Invalid response format for job applications stats');
  },
};
