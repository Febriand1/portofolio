import React, { useEffect, useState } from 'react';
import { dataService } from '../services/dataService';
import type { Project } from '../types/portfolio';
import ProjectCard from '../components/ProjectCard';
import Section from '../components/Section';
import { useLanguage } from '../hooks/useLanguage';
import Loading from '../components/loading';

const Projects: React.FC = () => {
  const { language, t } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProjects() {
      try {
        setLoading(true);
        const data = await dataService.getProjects(language);
        setProjects(data);
      } catch (err) {
        console.error('Failed to load projects:', err);
        setError(
          t('loading.projects.error') || 'Failed to retrieve case studies.',
        );
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, [language]);

  const allTechs = Array.from(
    new Set(projects.flatMap((project) => project.techStack)),
  ).sort();

  const filteredProjects = selectedTech
    ? projects.filter((project) => project.techStack.includes(selectedTech))
    : projects;

  <Loading
    loading={loading}
    loadingText={t('loading.projects')}
    error={error}
  />;

  return (
    <div className="space-y-6">
      <Section className="pt-8 pb-12">
        <h1 className="text-3xl font-extrabold font-heading text-neutral-dark mb-4">
          {t('projects.title')}
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-300 font-sans max-w-2xl">
          {t('projects.desc')}
        </p>
      </Section>

      {/* Filter Options */}
      {allTechs.length > 0 && (
        <div className="py-4 border-b border-border-light">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-300 mb-3">
            {t('projects.filter.label')}
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTech(null)}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                selectedTech === null
                  ? 'bg-brand text-white'
                  : 'bg-neutral-light text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200/60 dark:hover:bg-neutral-800'
              }`}
            >
              {t('projects.filter.all')}
            </button>
            {allTechs.map((tech) => (
              <button
                key={tech}
                onClick={() => setSelectedTech(tech)}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                  selectedTech === tech
                    ? 'bg-brand text-white'
                    : 'bg-neutral-light text-neutral-600 dark:text-neutral-300 hover:bg-neutral-300/60 dark:hover:bg-neutral-900/10 border border-border-light cursor-pointer'
                }`}
              >
                {tech}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Projects Grid */}
      <Section className="border-b-0">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-neutral-600 dark:text-neutral-300">
              {t('projects.empty')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </Section>
    </div>
  );
};

export default Projects;
