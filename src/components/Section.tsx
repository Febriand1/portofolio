import React from 'react';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  as?: 'section' | 'div' | 'header' | 'footer';
}

const Section: React.FC<SectionProps> = ({
  children,
  className = '',
  id,
  as: Component = 'section',
}) => {
  return (
    <Component
      id={id}
      className={`py-12 md:py-20 border-b border-border-light last:border-b-0 ${className}`}
    >
      {children}
    </Component>
  );
};

export default Section;
