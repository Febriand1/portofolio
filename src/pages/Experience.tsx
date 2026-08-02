import React, { useEffect, useState } from 'react';
import { dataService } from '../services/dataService';
import type { Experience as ExperienceType } from '../types/portfolio';
import Timeline, { TimelineItem } from '../components/Timeline';
import Section from '../components/Section';
import { useLanguage } from '../hooks/useLanguage';
import { SkeletonExperienceTimeline } from '../components/Skeletons';
import ExperienceCard from '../components/ExperienceCard';

const Experience: React.FC = () => {
  const { language, t } = useLanguage();
  const [experience, setExperience] = useState<ExperienceType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadExperience() {
      try {
        setLoading(true);
        const data = await dataService.getExperience(language, false);
        console.log('Fetched experience data:', data);
        setExperience(data);
      } catch (err) {
        console.error('Failed to load experience:', err);
        setError(
          t('loading.experience.error') ||
            'Unable to load career accomplishments.',
        );
      } finally {
        setLoading(false);
      }
    }
    loadExperience();
  }, [language]);

  const groupedExperience = experience
    .filter((item) => item.parentId === null)
    .map((parent) => ({
      parent,
      children: experience.filter((item) => item.parentId === parent.id),
    }));

  return (
    <div className="space-y-6">
      <Section className="pt-8 pb-12">
        <h1 className="text-3xl font-extrabold font-heading text-neutral-dark mb-4">
          {t('experience.title')}
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-300 font-sans max-w-2xl">
          {t('experience.desc')}
        </p>
      </Section>

      <Section className="border-b-0 pt-4">
        {loading ? (
          <SkeletonExperienceTimeline count={3} />
        ) : error ? (
          <div className="text-center py-12 text-red-500 font-sans">
            {error}
          </div>
        ) : (
          <Timeline>
            {groupedExperience.map(({ parent, children }) => (
              <TimelineItem
                key={parent.id}
                date={`${parent.startDate} — ${parent.endDate}`}
                title={
                  parent.companyUrl ? (
                    <a
                      href={parent.companyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline hover:text-brand"
                    >
                      {parent.company}
                    </a>
                  ) : (
                    parent.company
                  )
                }
                subtitle={parent.role}
              >
                <ExperienceCard job={parent} />
                {children.map((child) => (
                  <ExperienceCard key={child.id} job={child} isChild />
                ))}
              </TimelineItem>
            ))}
          </Timeline>
        )}
      </Section>
    </div>
  );
};

export default Experience;
