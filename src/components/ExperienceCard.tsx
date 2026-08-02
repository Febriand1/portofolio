import React from 'react';
import Badge from './Badge';
import type { Experience } from '../types/portfolio';

interface ExperienceCardProps {
  job: Experience;
  isChild?: boolean;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({
  job,
  isChild = false,
}) => {
  return (
    <div className={isChild ? 'relative pt-8' : ''}>
      {isChild && (
        <div className="text-base font-medium text-neutral-600 dark:text-neutral-300 mb-3">
          {job.role}
        </div>
      )}

      <div className="space-y-4">
        <p className="text-neutral-600 dark:text-neutral-300 font-sans leading-relaxed text-sm">
          {job.description}
        </p>

        {job.achievements.length > 0 && (
          <ul className="list-disc pl-5 space-y-1.5 text-neutral-600 dark:text-neutral-300 text-sm font-sans">
            {job.achievements.map((ach, idx) => (
              <li key={idx} className="leading-relaxed">
                {ach}
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-wrap gap-1.5 pt-2">
          {job.techStack.map((tech) => (
            <Badge key={tech} label={tech} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExperienceCard;
