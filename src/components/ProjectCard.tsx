import React from 'react';
import { Link } from 'react-router-dom';
import type { Project } from '../types/portfolio';
import Badge from './Badge';
import { useLanguage } from '../hooks/useLanguage';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const { t } = useLanguage();

  return (
    <article className="border border-border-light rounded-lg p-6 bg-white hover:border-brand/40 hover:shadow-sm transition-all duration-200 flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-bold font-heading text-neutral-dark mb-2">
          {project.title}
        </h3>
        <p className="text-sm font-medium text-brand mb-3">
          {project.subtitle}
        </p>
        <p className="text-sm text-neutral-500 mb-4 line-clamp-3">
          {project.overview}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {project.techStack.map((tech) => (
            <Badge key={tech} label={tech} />
          ))}
        </div>
      </div>

      <div className="pt-2 border-t border-border-light/60 flex items-center justify-between">
        <Link
          to={`/projects/${project.id}`}
          className="text-xs font-semibold text-brand hover:text-brand-hover hover:underline transition-colors focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 rounded"
        >
          {t('projects.card.view')} &rarr;
        </Link>
        
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-neutral-400 hover:text-neutral-700 transition-colors"
          >
            GitHub
          </a>
        )}
      </div>
    </article>
  );
};

export default ProjectCard;
