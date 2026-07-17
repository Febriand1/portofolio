import React from 'react';

interface TimelineItemProps {
  date: string;
  title: React.ReactNode;
  subtitle: React.ReactNode;
  children?: React.ReactNode;
}

export const TimelineItem: React.FC<TimelineItemProps> = ({
  date,
  title,
  subtitle,
  children,
}) => {
  return (
    <div className="relative pl-8 pb-12 last:pb-0 group">
      {/* Connector line */}
      <div className="absolute left-3 top-2 bottom-0 w-0.5 bg-border-light group-last:hidden" />
      
      {/* Node indicator */}
      <div className="absolute left-1.5 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-brand bg-white group-hover:bg-brand transition-colors duration-200" />

      <div className="flex flex-col sm:flex-row sm:justify-between items-start gap-2 mb-3">
        <div>
          <h3 className="text-lg font-bold font-heading text-neutral-dark leading-snug">
            {title}
          </h3>
          <div className="text-sm font-medium text-neutral-500 mt-0.5">
            {subtitle}
          </div>
        </div>
        <div className="text-xs font-semibold text-brand tracking-wider bg-brand/5 border border-brand/20 px-2.5 py-0.5 rounded whitespace-nowrap">
          {date}
        </div>
      </div>

      {children && <div className="text-sm text-neutral-600 font-sans">{children}</div>}
    </div>
  );
};

interface TimelineProps {
  children: React.ReactNode;
}

const Timeline: React.FC<TimelineProps> = ({ children }) => {
  return <div className="relative mt-8">{children}</div>;
};

export default Timeline;
