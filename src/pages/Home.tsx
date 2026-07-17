import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dataService } from '../services/dataService';
import type { Project, SkillCategory } from '../types/portfolio';
import ProjectCard from '../components/ProjectCard';
import Section from '../components/Section';
import { useLanguage } from '../hooks/useLanguage';

const Home: React.FC = () => {
  const { language, t } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [loadedProjects, loadedSkills] = await Promise.all([
          dataService.getProjects(language),
          dataService.getSkills(language),
        ]);
        setProjects(loadedProjects.slice(0, 2));
        setSkills(loadedSkills);
      } catch (err) {
        console.error('Failed to load home page data:', err);
        setError(t('loading.profile.error') || 'Unable to load portfolio details.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [language]);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <p className="text-neutral-500 font-sans">{t('loading.profile')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-24 text-center text-red-500">
        <p className="font-sans">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <Section className="text-left pt-12 pb-20">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-brand tracking-wider uppercase mb-3">
            {t('hero.badge')}
          </p>
          <h1 className="text-4xl md:text-6xl font-extrabold font-heading text-neutral-dark leading-tight tracking-tight mb-6">
            {t('hero.title')}
          </h1>
          <p className="text-lg md:text-xl text-neutral-500 font-sans leading-relaxed mb-10 max-w-2xl">
            {t('hero.desc')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/projects"
              className="px-6 py-3 bg-brand hover:bg-brand-hover text-white text-sm font-semibold rounded-md shadow-sm transition-colors text-center focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
            >
              {t('hero.cta.projects')}
            </Link>
            <Link
              to="/contact"
              className="px-6 py-3 border border-border-light hover:bg-neutral-light text-neutral-700 text-sm font-semibold rounded-md transition-colors text-center focus:outline-none focus:ring-2 focus:ring-neutral-400"
            >
              {t('hero.cta.contact')} &rarr;
            </Link>
          </div>
        </div>
      </Section>

      {/* Featured Projects Section */}
      <Section>
        <div className="flex justify-between items-baseline mb-8">
          <div>
            <h2 className="text-2xl font-bold font-heading text-neutral-dark">
              {t('projects.featured.title')}
            </h2>
            {/* <p className="text-sm text-neutral-500 mt-1">
              {t('projects.featured.desc')}
            </p> */}
          </div>
          <Link
            to="/projects"
            className="text-sm font-semibold text-brand hover:underline"
          >
            {t('projects.featured.all')} &rarr;
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </Section>

      {/* Technical Focus Section */}
      <Section className="border-b-0">
        <h2 className="text-2xl font-bold font-heading text-neutral-dark mb-8">
          {t('skills.core.title')}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {skills.map((category) => (
            <div key={category.id} className="border border-border-light/60 rounded-lg p-6 bg-neutral-light/50">
              <h3 className="font-bold text-neutral-dark font-heading mb-4 border-b border-border-light pb-2">
                {category.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <span
                    key={skill.name}
                    className="px-2.5 py-1 text-xs font-sans font-medium text-neutral-700 bg-white border border-border-light rounded"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
};

export default Home;
