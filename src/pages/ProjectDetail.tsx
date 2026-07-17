import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { dataService } from '../services/dataService';
import type { Project } from '../types/portfolio';
import CodeBlock from '../components/CodeBlock';
import Badge from '../components/Badge';
import Section from '../components/Section';
import { useLanguage } from '../hooks/useLanguage';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { language, t } = useLanguage();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProject() {
      if (!id) return;
      try {
        setLoading(true);
        const data = await dataService.getProjectById(id, language);
        setProject(data);
      } catch (err) {
        console.error('Failed to load project details:', err);
        setError(t('loading.detail.error') || 'Unable to load project details.');
      } finally {
        setLoading(false);
      }
    }
    loadProject();
  }, [id, language]);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <p className="text-neutral-500 font-sans">{t('loading.detail')}</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="py-24 text-center text-red-500 space-y-4">
        <p className="font-sans">{error || 'Project specifications not found.'}</p>
        <Link to="/projects" className="text-brand hover:underline font-semibold text-sm">
          &larr; {t('project.detail.back')}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back to Projects */}
      <div className="pt-4">
        <Link
          to="/projects"
          className="text-sm font-semibold text-brand hover:underline inline-flex items-center"
        >
          &larr; {t('project.detail.back')}
        </Link>
      </div>

      {/* Hero Header */}
      <header className="border-b border-border-light pb-8">
        <p className="text-sm font-semibold text-brand uppercase tracking-wider mb-2">
          {t('project.detail.casestudy')}
        </p>
        <h1 className="text-3xl md:text-4xl font-extrabold font-heading text-neutral-dark mb-4">
          {project.title}
        </h1>
        <p className="text-lg text-neutral-500 font-sans leading-relaxed mb-6">
          {project.subtitle}
        </p>

        {/* Action Links */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-border-light/60">
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <Badge key={tech} label={tech} />
            ))}
          </div>
          
          <div className="flex gap-4">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 border border-border-light hover:bg-neutral-light text-neutral-600 dark:text-neutral-300 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-400"
              >
                {t('project.detail.repo')}
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-brand hover:bg-brand-hover text-white text-sm font-medium rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
              >
                {t('project.detail.demo')}
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Overview */}
      <Section id="overview" className="space-y-4">
        <h2 className="text-xl font-bold font-heading text-neutral-dark border-b border-border-light pb-2">
          {t('project.detail.overview')}
        </h2>
        <p className="text-neutral-600 dark:text-neutral-300 font-sans leading-relaxed">
          {project.overview}
        </p>
      </Section>

      {/* Responsibilities */}
      <Section id="responsibilities" className="space-y-4">
        <h2 className="text-xl font-bold font-heading text-neutral-dark border-b border-border-light pb-2">
          {t('project.detail.resp')}
        </h2>
        <ul className="list-disc pl-5 space-y-2 text-neutral-600 dark:text-neutral-300 font-sans">
          {project.responsibilities.map((resp, i) => (
            <li key={i} className="leading-relaxed">{resp}</li>
          ))}
        </ul>
      </Section>

      {/* Features */}
      <Section id="features" className="space-y-4">
        <h2 className="text-xl font-bold font-heading text-neutral-dark border-b border-border-light pb-2">
          {t('project.detail.features')}
        </h2>
        <ul className="list-disc pl-5 space-y-2 text-neutral-600 dark:text-neutral-300 font-sans">
          {project.features.map((feat, i) => (
            <li key={i} className="leading-relaxed">{feat}</li>
          ))}
        </ul>
      </Section>

      {/* Architecture */}
      <Section id="architecture" className="space-y-4">
        <h2 className="text-xl font-bold font-heading text-neutral-dark border-b border-border-light pb-2">
          {t('project.detail.architecture')}
        </h2>
        <p className="text-neutral-600 dark:text-neutral-300 font-sans leading-relaxed">
          {project.architecture.description}
        </p>
      </Section>

      {/* API Preview */}
      {project.apiPreview && (
        <Section id="api-preview" className="space-y-4">
          <h2 className="text-xl font-bold font-heading text-neutral-dark border-b border-border-light pb-2">
            {t('project.detail.api')}
          </h2>
          <p className="text-sm text-neutral-500 font-sans">
            {t('project.detail.api.desc')}
          </p>
          <CodeBlock code={project.apiPreview.code} language={project.apiPreview.language} />
        </Section>
      )}

      {/* Challenges & Retrospective */}
      <Section id="challenges" className="border-b-0 space-y-6">
        <div>
          <h2 className="text-xl font-bold font-heading text-neutral-dark border-b border-border-light pb-2 mb-4">
            {t('project.detail.challenges.title')}
          </h2>
          <h3 className="text-md font-bold text-neutral-700 dark:text-neutral-200 mb-2">
            {t('project.detail.challenges.sub')}
          </h3>
          <p className="text-neutral-600 dark:text-neutral-300 font-sans leading-relaxed mb-4">
            {project.challenges}
          </p>
        </div>

        <div>
          <h3 className="text-md font-bold text-neutral-700 dark:text-neutral-200 mb-2">
            {t('project.detail.solutions.sub')}
          </h3>
          <p className="text-neutral-600 dark:text-neutral-300 font-sans leading-relaxed mb-4">
            {project.solutions}
          </p>
        </div>

        <div className="p-4 bg-neutral-light rounded-lg border border-border-light">
          <h3 className="text-sm font-bold text-brand uppercase tracking-wider mb-2">
            {t('project.detail.lessons.sub')}
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-300 font-sans leading-relaxed">
            {project.lessonsLearned}
          </p>
        </div>
      </Section>
    </div>
  );
};

export default ProjectDetail;
