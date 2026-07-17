import React from 'react';

interface BadgeProps {
  label: string;
}

const Badge: React.FC<BadgeProps> = ({ label }) => {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-neutral-light text-neutral-600 border border-border-light">
      {label}
    </span>
  );
};

export default Badge;
