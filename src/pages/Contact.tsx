import React, { useEffect, useState } from 'react';
import { dataService } from '../services/dataService';
import type { Social } from '../types/portfolio';
import Section from '../components/Section';
import { useLanguage } from '../hooks/useLanguage';

const Contact: React.FC = () => {
  const { language, t } = useLanguage();
  const [socials, setSocials] = useState<Social[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSocials() {
      try {
        setLoading(true);
        const data = await dataService.getSocials(language);
        setSocials(data);
      } catch (err) {
        console.error('Failed to load socials:', err);
        setError(t('loading.contact.error') || 'Unable to load contact profiles.');
      } finally {
        setLoading(false);
      }
    }
    loadSocials();
  }, [language]);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <p className="text-neutral-500 font-sans">{t('loading.contact')}</p>
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
          {t('contact.title')}
        </h1>
        <p className="text-lg text-neutral-500 font-sans max-w-2xl">
          {t('contact.desc')}
        </p>
      </Section>

      {/* Social Grids */}
      <Section className="border-b-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {socials.map((social) => (
            <div
              key={social.platform}
              className="border border-border-light rounded-lg p-6 bg-card-custom hover:border-brand/40 transition-colors flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-bold font-heading text-neutral-dark mb-2">
                  {social.platform}
                </h3>
                <p className="text-sm text-neutral-500 font-sans mb-6">
                  {social.label}
                </p>
              </div>
              
              <a
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-center px-4 py-2 bg-neutral-light border border-border-light hover:bg-neutral-200/50 hover:text-brand text-neutral-600 dark:text-neutral-300 hover:dark:text-brand text-xs font-semibold rounded transition-colors focus:outline-none focus:ring-2 focus:ring-brand"
              >
                {t('contact.connect')} &rarr;
              </a>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
};

export default Contact;
