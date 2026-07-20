import React from 'react';
import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';
import Section from '../components/Section';
import { useLanguage } from '../hooks/useLanguage';

const ErrorPage: React.FC = () => {
  const error = useRouteError();
  const { t } = useLanguage();

  let errorMessage = t('error.desc');
  let statusCode = 'Error';

  if (isRouteErrorResponse(error)) {
    statusCode = `${error.status}`;
    errorMessage = error.statusText || error.data?.message || errorMessage;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  const is403 = statusCode === '403';
  const displayTitle = is403 ? t('restricted.title') : t('error.title');
  const statusColorClass = is403 ? 'text-amber-500' : 'text-red-500';

  return (
    <div className="min-h-screen bg-card-custom text-neutral-dark flex flex-col items-center justify-center p-6">
      <Section className="border-b-0 py-12 text-center max-w-lg mx-auto bg-card-custom border border-border-light rounded-xl shadow-sm p-8">
        <div className="mb-4">
          <span className={`text-6xl font-extrabold font-heading ${statusColorClass} tracking-tight`}>
            {statusCode}
          </span>
        </div>

        <h1 className="text-2xl font-bold font-heading text-neutral-dark mb-2">
          {displayTitle}
        </h1>

        <p className="text-sm text-neutral-500 font-sans leading-relaxed mb-6 font-mono bg-neutral-light/50 p-3 rounded border border-border-light">
          {errorMessage}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => window.location.reload()}
            className="w-full sm:w-auto px-5 py-2.5 bg-brand hover:bg-brand-hover text-white text-xs font-semibold rounded shadow-sm transition-colors"
          >
            {t('error.retry')}
          </button>
          <Link
            to="/"
            className="w-full sm:w-auto px-5 py-2.5 border border-border-light hover:bg-neutral-light text-neutral-600 dark:text-neutral-300 text-xs font-semibold rounded transition-colors text-center"
          >
            {t('notfound.cta.home')}
          </Link>
        </div>
      </Section>
    </div>
  );
};

export default ErrorPage;
