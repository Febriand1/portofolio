import React from 'react';
import { Link } from 'react-router-dom';
import Section from '../components/Section';
import { useLanguage } from '../hooks/useLanguage';

const Restricted: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <Section className="border-b-0 py-12 text-center max-w-xl mx-auto">
        {/* Large 403 Display */}
        <div className="mb-4 relative inline-block">
          <span className="text-8xl md:text-9xl font-extrabold font-heading text-amber-500 tracking-tighter opacity-90 select-none">
            403
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold font-heading text-neutral-dark mb-3">
          {t('restricted.title')}
        </h1>

        <p className="text-sm md:text-base text-neutral-500 font-sans leading-relaxed mb-8 max-w-md mx-auto">
          {t('restricted.desc')}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="w-full sm:w-auto px-6 py-3 bg-brand hover:bg-brand-hover text-white text-sm font-semibold rounded-md shadow-sm transition-colors text-center focus:outline-none focus:ring-2 focus:ring-brand"
          >
            &larr; {t('notfound.cta.home')}
          </Link>
        </div>
      </Section>
    </div>
  );
};

export default Restricted;
