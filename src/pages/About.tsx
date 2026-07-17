import React, { useEffect, useState } from 'react';
import { dataService } from '../services/dataService';
import type { Education, Certificate } from '../types/portfolio';
import Section from '../components/Section';
import { useLanguage } from '../hooks/useLanguage';

const About: React.FC = () => {
  const { language, t } = useLanguage();
  const [education, setEducation] = useState<Education[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAboutData() {
      try {
        setLoading(true);
        const [loadedEducation, loadedCertificates] = await Promise.all([
          dataService.getEducation(language),
          dataService.getCertificates(language),
        ]);
        setEducation(loadedEducation);
        setCertificates(loadedCertificates);
      } catch (err) {
        console.error('Failed to load about page data:', err);
        setError(t('loading.about.error') || 'Unable to load professional profile details.');
      } finally {
        setLoading(false);
      }
    }
    loadAboutData();
  }, [language]);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <p className="text-neutral-500 font-sans">{t('loading.about')}</p>
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
          {t('about.title')}
        </h1>
        <p className="text-lg text-neutral-500 font-sans max-w-2xl">
          {t('about.desc')}
        </p>
      </Section>

      {/* Biography */}
      <Section className="space-y-4">
        <h2 className="text-xl font-bold font-heading text-neutral-dark border-b border-border-light pb-2">
          {t('about.bio.title')}
        </h2>
        <p className="text-neutral-600 dark:text-neutral-300 font-sans leading-relaxed">
          {t('about.bio.p1')}
        </p>
        <p className="text-neutral-600 dark:text-neutral-300 font-sans leading-relaxed">
          {t('about.bio.p2')}
        </p>
      </Section>

      {/* Education */}
      {education.length > 0 && (
        <Section className="space-y-6">
          <h2 className="text-xl font-bold font-heading text-neutral-dark border-b border-border-light pb-2">
            {t('about.education.title')}
          </h2>
          <div className="space-y-6">
            {education.map((edu) => (
              <div key={edu.id} className="flex flex-col sm:flex-row sm:justify-between items-start gap-2">
                <div>
                  <h3 className="font-bold text-neutral-dark text-base">{edu.degree} in {edu.fieldOfStudy}</h3>
                  <p className="text-sm text-neutral-500">{edu.institution}</p>
                  {edu.description && (
                    <p className="text-sm text-neutral-600 mt-2 font-sans">{edu.description}</p>
                  )}
                </div>
                <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider whitespace-nowrap bg-neutral-light border border-border-light px-2 py-0.5 rounded">
                  {edu.startDate} &mdash; {edu.endDate}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Certifications */}
      {certificates.length > 0 && (
        <Section className="border-b-0 space-y-6">
          <h2 className="text-xl font-bold font-heading text-neutral-dark border-b border-border-light pb-2">
            {t('about.certs.title')}
          </h2>
          <div className="grid grid-cols-1 gap-6">
            {certificates.map((cert) => (
              <div key={cert.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 border border-border-light/60 p-4 rounded-lg bg-neutral-light/35">
                <div>
                  <h3 className="font-bold text-neutral-dark text-base">{cert.title}</h3>
                  <p className="text-sm text-neutral-500">{cert.issuer}</p>
                  {cert.credentialId && (
                    <p className="text-xs text-neutral-400 mt-1">Credential ID: {cert.credentialId}</p>
                  )}
                </div>
                <div>
                  {cert.credentialUrl ? (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-xs font-semibold text-brand hover:underline"
                    >
                      {t('about.certs.verify')} &rarr;
                    </a>
                  ) : (
                    <span className="text-xs text-neutral-400 font-sans">{cert.issueDate}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
};

export default About;
