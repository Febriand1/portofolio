import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const navItems = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.projects'), path: '/projects' },
    { name: t('nav.about'), path: '/about' },
    { name: t('nav.experience'), path: '/experience' },
    { name: t('nav.contact'), path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border-light">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <NavLink
          to="/"
          className="text-lg font-bold font-heading text-neutral-dark tracking-tight hover:text-brand transition-colors focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 rounded"
          aria-label="Home"
        >
          Dirga<span className="text-brand">Febrian</span>
        </NavLink>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <nav className="flex space-x-6">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `text-sm font-medium font-sans py-1 transition-colors relative focus:outline-none focus:ring-2 focus:ring-brand rounded ${
                    isActive
                      ? 'text-brand border-b-2 border-brand'
                      : 'text-neutral-500 hover:text-neutral-dark'
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>

          <button
            onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}
            className="px-2.5 py-1 text-xs font-semibold border border-border-light hover:bg-neutral-light text-neutral-600 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-brand"
            aria-label="Switch Language"
          >
            {language === 'id' ? 'EN' : 'ID'}
          </button>
        </div>

        {/* Mobile menu button and language switch */}
        <div className="flex items-center space-x-2 md:hidden">
          <button
            onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}
            className="px-2 py-1 text-xs font-semibold border border-border-light hover:bg-neutral-light text-neutral-600 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-brand"
            aria-label="Switch Language"
          >
            {language === 'id' ? 'EN' : 'ID'}
          </button>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            className="p-2 rounded-md text-neutral-500 hover:text-neutral-dark hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-brand"
            aria-controls="mobile-menu"
            aria-expanded={isOpen}
          >
            <span className="sr-only">Open main menu</span>
            {isOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-b border-border-light bg-white" id="mobile-menu">
          <nav className="px-6 py-4 space-y-3 flex flex-col">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `text-base font-medium font-sans py-2 block ${
                    isActive ? 'text-brand font-semibold' : 'text-neutral-500 hover:text-neutral-dark'
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
