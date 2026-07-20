import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Section from '../components/Section';
import { useLanguage } from '../hooks/useLanguage';
import Restricted from './Restricted';

const NotFound: React.FC = () => {
  const { t } = useLanguage();
  const location = useLocation();

  // Dynamic check: if user attempts to access hidden paths like /.git, /.env, /.htaccess, etc.
  const isHiddenPath = location.pathname.startsWith('/.') || location.pathname.includes('/.');

  if (isHiddenPath) {
    return <Restricted />;
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <Section className="border-b-0 py-12 text-center max-w-xl mx-auto">
        {/* Large 404 Display */}
        <div className="mb-6">
          <span className="text-8xl md:text-9xl font-extrabold font-heading text-brand tracking-tighter opacity-90 select-none">
            404
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold font-heading text-neutral-dark mb-3">
          {t('notfound.title')}
        </h1>

        <p className="text-sm md:text-base text-neutral-500 font-sans leading-relaxed mb-8 max-w-md mx-auto">
          {t('notfound.desc')}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="w-full sm:w-auto px-6 py-3 bg-brand hover:bg-brand-hover text-white text-sm font-semibold rounded-md shadow-sm transition-colors text-center focus:outline-none focus:ring-2 focus:ring-brand"
          >
            &larr; {t('notfound.cta.home')}
          </Link>
          <Link
            to="/projects"
            className="w-full sm:w-auto px-6 py-3 border border-border-light hover:bg-neutral-light text-neutral-600 dark:text-neutral-300 text-sm font-semibold rounded-md transition-colors text-center focus:outline-none focus:ring-2 focus:ring-brand"
          >
            {t('notfound.cta.projects')} &rarr;
          </Link>
        </div>
      </Section>
    </div>
  );
};

export default NotFound;
