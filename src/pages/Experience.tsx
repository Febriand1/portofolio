import React, { useEffect, useState } from 'react';
import { dataService } from '../services/dataService';
import type { Experience as ExperienceType } from '../types/portfolio';
import Timeline, { TimelineItem } from '../components/Timeline';
import Badge from '../components/Badge';
import Section from '../components/Section';
import { useLanguage } from '../hooks/useLanguage';

const Experience: React.FC = () => {
  const { language, t } = useLanguage();
  const [experience, setExperience] = useState<ExperienceType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadExperience() {
      try {
        setLoading(true);
        const data = await dataService.getExperience(language);
        setExperience(data);
      } catch (err) {
        console.error('Failed to load experience:', err);
        setError(t('loading.experience.error') || 'Unable to load career accomplishments.');
      } finally {
        setLoading(false);
      }
    }
    loadExperience();
  }, [language]);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <p className="text-neutral-500 font-sans">{t('loading.experience')}</p>
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
      <Section className="pt-8 pb-12">
        <h1 className="text-3xl font-extrabold font-heading text-neutral-dark mb-4">
          {t('experience.title')}
        </h1>
        <p className="text-lg text-neutral-500 font-sans max-w-2xl">
          {t('experience.desc')}
        </p>
      </Section>

      <Section className="border-b-0 pt-4">
        <Timeline>
          {experience.map((job) => (
            <TimelineItem
              key={job.id}
              date={`${job.startDate} — ${job.endDate}`}
              title={job.role}
              subtitle={
                job.companyUrl ? (
                  <a
                    href={job.companyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline hover:text-brand"
                  >
                    {job.company}
                  </a>
                ) : (
                  job.company
                )
              }
            >
              <div className="space-y-4 mt-2">
                <p className="text-neutral-600 font-sans leading-relaxed text-sm">
                  {job.description}
                </p>
                
                {job.achievements.length > 0 && (
                  <ul className="list-disc pl-5 space-y-1.5 text-neutral-600 text-sm font-sans">
                    {job.achievements.map((ach, idx) => (
                      <li key={idx} className="leading-relaxed">{ach}</li>
                    ))}
                  </ul>
                )}
                
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {job.techStack.map((tech) => (
                    <Badge key={tech} label={tech} />
                  ))}
                </div>
              </div>
            </TimelineItem>
          ))}
        </Timeline>
      </Section>
    </div>
  );
};

export default Experience;
