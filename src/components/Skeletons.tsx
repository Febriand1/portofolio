import React from 'react';

// Base Shimmer Block
export const SkeletonBlock: React.FC<{ className?: string }> = ({
  className = '',
}) => (
  <div
    className={`animate-pulse bg-neutral-200 dark:bg-neutral-800/70 rounded ${className}`}
  />
);

// Projects Grid Skeleton
export const SkeletonProjectsGrid: React.FC<{ count?: number }> = ({
  count = 4,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="border border-border-light rounded-lg p-6 bg-card-custom flex flex-col justify-between space-y-4"
      >
        <div className="space-y-3">
          <SkeletonBlock className="h-6 w-3/4" />
          <SkeletonBlock className="h-4 w-1/2" />
          <div className="space-y-2 pt-2">
            <SkeletonBlock className="h-3.5 w-full" />
            <SkeletonBlock className="h-3.5 w-11/12" />
            <SkeletonBlock className="h-3.5 w-4/5" />
          </div>
          <div className="flex flex-wrap gap-2 pt-3">
            <SkeletonBlock className="h-6 w-16 rounded-full" />
            <SkeletonBlock className="h-6 w-20 rounded-full" />
            <SkeletonBlock className="h-6 w-14 rounded-full" />
          </div>
        </div>
        <div className="pt-3 border-t border-border-light/60 flex justify-between items-center">
          <SkeletonBlock className="h-4 w-24" />
          <SkeletonBlock className="h-4 w-12" />
        </div>
      </div>
    ))}
  </div>
);

// Experience Timeline Skeleton
export const SkeletonExperienceTimeline: React.FC<{ count?: number }> = ({
  count = 3,
}) => (
  <div className="space-y-8 pl-4 border-l-2 border-border-light">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="relative space-y-3">
        <div className="absolute -left-[21px] top-1.5 w-3 h-3 rounded-full bg-neutral-300 dark:bg-neutral-700" />
        <SkeletonBlock className="h-4 w-32" />
        <SkeletonBlock className="h-6 w-64" />
        <SkeletonBlock className="h-4 w-40" />
        <div className="space-y-2 pt-2">
          <SkeletonBlock className="h-3.5 w-full" />
          <SkeletonBlock className="h-3.5 w-11/12" />
          <SkeletonBlock className="h-3.5 w-4/5" />
        </div>
        <div className="flex gap-2 pt-2">
          <SkeletonBlock className="h-5 w-14 rounded" />
          <SkeletonBlock className="h-5 w-16 rounded" />
          <SkeletonBlock className="h-5 w-12 rounded" />
        </div>
      </div>
    ))}
  </div>
);

// Project Detail Page Skeleton
export const SkeletonProjectDetail: React.FC = () => (
  <div className="space-y-8 pt-4">
    <div className="space-y-4">
      <SkeletonBlock className="h-8 w-2/3" />
      <SkeletonBlock className="h-5 w-1/2" />
      <SkeletonBlock className="h-4 w-full" />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-3 p-6 border border-border-light rounded-lg">
        <SkeletonBlock className="h-5 w-40" />
        <SkeletonBlock className="h-3.5 w-full" />
        <SkeletonBlock className="h-3.5 w-5/6" />
      </div>
      <div className="space-y-3 p-6 border border-border-light rounded-lg">
        <SkeletonBlock className="h-5 w-40" />
        <SkeletonBlock className="h-3.5 w-full" />
        <SkeletonBlock className="h-3.5 w-5/6" />
      </div>
    </div>

    <div className="space-y-4">
      <SkeletonBlock className="h-6 w-48" />
      <SkeletonBlock className="h-40 w-full rounded-lg" />
    </div>
  </div>
);

// Contact Page Skeleton (Social Links Grid)
export const SkeletonContact: React.FC<{ count?: number }> = ({
  count = 3,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="border border-border-light rounded-lg p-6 bg-card-custom flex flex-col justify-between space-y-6"
      >
        <div className="space-y-3">
          <SkeletonBlock className="h-6 w-28" />
          <SkeletonBlock className="h-4 w-3/4" />
        </div>
        <SkeletonBlock className="h-9 w-full rounded" />
      </div>
    ))}
  </div>
);

export const SkeletonAbout: React.FC<{ count?: number }> = ({ count = 1 }) => (
  <div className="space-y-4">
    <SkeletonBlock className="h-6 w-40 border-b border-border-light pb-2" />
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-3">
          <SkeletonBlock className="h-16 w-full rounded" />
        </div>
      ))}
      {/* <SkeletonBlock className="h-16 w-full rounded" /> */}
    </div>
  </div>
);
