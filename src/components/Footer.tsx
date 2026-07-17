import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border-light bg-neutral-light py-8 text-center text-sm text-neutral-500">
      <div className="max-w-6xl mx-auto px-6">
        <p className="font-sans">
          &copy; {new Date().getFullYear()} Dirga Febrian. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
