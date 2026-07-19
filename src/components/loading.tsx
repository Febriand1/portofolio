import React from 'react';

interface LoadingProps {
  loading: boolean;
  loadingText?: string;
  error?: string | null;
  children?: React.ReactNode;
}

const Loading: React.FC<LoadingProps> = ({
  loading,
  loadingText = 'Loading...',
  error,
  children,
}) => {
  if (loading) {
    return (
      <div className="py-24 text-center">
        <p className="font-sans text-neutral-600 dark:text-neutral-300">
          {loadingText}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-24 text-center text-red-500 space-y-4">
        <p className="font-sans">{error}</p>
        {children}
      </div>
    );
  }

  return <>{children}</>;
};

export default Loading;
