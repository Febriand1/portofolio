import type {
  Project,
  Experience,
  SkillCategory,
  Education,
  Certificate,
  Social,
  PaginatedJobsResponse,
  JobStatsResponse,
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

const memoryCache = new Map<string, { data: any; timestamp: number }>();
const MEMORY_CACHE_TTL = 5 * 60 * 1000; // 5 minutes in RAM

async function getCachedOrFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
): Promise<T> {
  const cached = memoryCache.get(key);
  if (cached && Date.now() - cached.timestamp < MEMORY_CACHE_TTL) {
    return cached.data as T;
  }
  const data = await fetcher();
  memoryCache.set(key, { data, timestamp: Date.now() });
  return data;
}

export const dataService = {
  async getProjects(lang: string, ascending = false): Promise<Project[]> {
    return getCachedOrFetch(`projects_${lang}`, async () => {
      if (apiUrl) {
        try {
          return await fetchJson<Project[]>(
            `${apiUrl}/portofolio/projects?lang=${lang}&ascending=${ascending}`,
          );
        } catch (err) {
          console.warn(
            'API fetch failed for projects, falling back to local JSON:',
            err,
          );
        }
      }
      return fetchJson<Project[]>(`/data/${lang}/projects.json`);
    });
  },

  async getProjectById(id: string, lang: string): Promise<Project | null> {
    const projects = await this.getProjects(lang);
    return projects.find((p) => p.id === id) || null;
  },

  async getExperience(lang: string, ascending = false): Promise<Experience[]> {
    return getCachedOrFetch(`experience_${lang}`, async () => {
      if (apiUrl) {
        try {
          return await fetchJson<Experience[]>(
            `${apiUrl}/portofolio/experience?lang=${lang}&ascending=${ascending}`,
          );
        } catch (err) {
          console.warn(
            'API fetch failed for experience, falling back to local JSON:',
            err,
          );
        }
      }
      return fetchJson<Experience[]>(`/data/${lang}/experience.json`);
    });
  },

  async getSkills(lang: string): Promise<SkillCategory[]> {
    return getCachedOrFetch(`skills_${lang}`, async () => {
      if (apiUrl) {
        try {
          return await fetchJson<SkillCategory[]>(
            `${apiUrl}/portofolio/skills?lang=${lang}`,
          );
        } catch (err) {
          console.warn(
            'API fetch failed for skills, falling back to local JSON:',
            err,
          );
        }
      }
      return fetchJson<SkillCategory[]>(`/data/${lang}/skills.json`);
    });
  },

  async getEducation(lang: string): Promise<Education[]> {
    return getCachedOrFetch(`education_${lang}`, async () => {
      if (apiUrl) {
        try {
          return await fetchJson<Education[]>(
            `${apiUrl}/portofolio/education?lang=${lang}`,
          );
        } catch (err) {
          console.warn(
            'API fetch failed for education, falling back to local JSON:',
            err,
          );
        }
      }
      return fetchJson<Education[]>(`/data/${lang}/education.json`);
    });
  },

  async getCertificates(lang: string): Promise<Certificate[]> {
    return getCachedOrFetch(`certificates_${lang}`, async () => {
      if (apiUrl) {
        try {
          return await fetchJson<Certificate[]>(
            `${apiUrl}/portofolio/certificates?lang=${lang}`,
          );
        } catch (err) {
          console.warn(
            'API fetch failed for certificates, falling back to local JSON:',
            err,
          );
        }
      }
      return fetchJson<Certificate[]>(`/data/${lang}/certificates.json`);
    });
  },

  async getSocials(lang: string): Promise<Social[]> {
    return getCachedOrFetch(`socials_${lang}`, async () => {
      if (apiUrl) {
        try {
          return await fetchJson<Social[]>(
            `${apiUrl}/portofolio/socials?lang=${lang}`,
          );
        } catch (err) {
          console.warn(
            'API fetch failed for socials, falling back to local JSON:',
            err,
          );
        }
      }
      return fetchJson<Social[]>(`/data/${lang}/socials.json`);
    });
  },

  async getJobApplications(
    page: number,
    limit: number,
    status: string,
    search: string,
    order: string,
  ): Promise<PaginatedJobsResponse> {
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

    const url = `${apiUrl}/job/jobs?${params.toString()}`;
    const result = await fetchJson<PaginatedJobsResponse>(url);

    if (result && result.success) {
      return result;
    }
    throw new Error('Invalid response format for paginated job applications');
  },

  async getJobGlobalStats(): Promise<JobStatsResponse['data']> {
    const url = `${apiUrl}/job/job-stats`;
    const result = await fetchJson<JobStatsResponse>(url);
    if (result && result.success && result.data) {
      return result.data;
    }
    throw new Error('Invalid response format for job applications stats');
  },
};
