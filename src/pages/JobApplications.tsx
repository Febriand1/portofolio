import React, { useEffect, useState, useMemo } from 'react';
import Section from '../components/Section';
import { useLanguage } from '../hooks/useLanguage';
import { dataService } from '../services/dataService';
import type { JobApplication } from '../types/portfolio';

const JobApplications: React.FC = () => {
  const { language, t } = useLanguage();
  const [allApplications, setAllApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<string>('desc');

  // Load from cache or fetch from API
  const loadData = async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      const data = await dataService.getJobApplications(forceRefresh);
      setAllApplications(data);
    } catch (err: any) {
      console.error('Failed to fetch job applications:', err);
      setError(t('jobs.error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Compute statistics from full in-memory list
  const stats = useMemo(() => {
    return {
      total: allApplications.length,
      applied: allApplications.filter(a => a.status.toLowerCase().includes('applied')).length,
      test: allApplications.filter(a => a.status.toLowerCase().includes('test') || a.status.toLowerCase().includes('task')).length,
      interview: allApplications.filter(a => a.status.toLowerCase().includes('interview')).length,
      offering: allApplications.filter(a => a.status.toLowerCase().includes('offering') || a.status.toLowerCase().includes('accept')).length,
      rejected: allApplications.filter(a => a.status.toLowerCase().includes('reject') || a.status.toLowerCase().includes('drop')).length
    };
  }, [allApplications]);

  // Compute unique statuses for filter options
  const availableStatuses = useMemo(() => {
    return Array.from(new Set(allApplications.map(a => a.status))).sort();
  }, [allApplications]);

  // Perform search, filter, and sort dynamic operations in-memory
  const filteredApplications = useMemo(() => {
    let result = [...allApplications];

    // 1. Status Filter
    if (selectedStatus && selectedStatus !== 'all') {
      result = result.filter(
        (app) => app.status.toLowerCase().trim() === selectedStatus.toLowerCase().trim()
      );
    }

    // 2. Search Query
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      result = result.filter(
        (app) => app.company.toLowerCase().includes(q) || app.position.toLowerCase().includes(q)
      );
    }

    // 3. Sorting Order (by date)
    result.sort((a, b) => {
      const timeA = new Date(a.updated_at).getTime();
      const timeB = new Date(b.updated_at).getTime();
      return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    });

    return result;
  }, [allApplications, selectedStatus, searchTerm, sortOrder]);

  // Formatter for localized date
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateStr;
    }
  };

  // Status color mapper helper
  const getStatusStyle = (status: string) => {
    const norm = status.toLowerCase().trim();
    if (norm.includes('applied')) {
      return 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/50';
    }
    if (norm.includes('test') || norm.includes('task')) {
      return 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/50';
    }
    if (norm.includes('interview')) {
      return 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-900/50';
    }
    if (norm.includes('offering') || norm.includes('accept') || norm.includes('accepted')) {
      return 'bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400 border-green-100 dark:border-green-900/50';
    }
    if (norm.includes('reject') || norm.includes('rejected') || norm.includes('drop')) {
      return 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/50';
    }
    return 'bg-neutral-50 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border-border-light';
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand mb-4"></div>
        <p className="text-neutral-500 font-sans">{t('jobs.loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-24 text-center text-red-500 max-w-md mx-auto">
        <svg className="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p className="font-sans font-medium mb-4">{error}</p>
        <button
          onClick={() => loadData(true)}
          className="px-4 py-2 bg-brand hover:bg-brand-hover text-white text-xs font-semibold rounded shadow transition-colors"
        >
          {t('error.retry')}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <Section className="pt-8 pb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold font-heading text-neutral-dark mb-4">
            {t('jobs.title')}
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-300 font-sans max-w-2xl leading-relaxed">
            {t('jobs.desc')}
          </p>
        </div>
        <div>
          <button
            onClick={() => loadData(true)}
            className="px-4 py-2 border border-border-light hover:bg-neutral-light text-neutral-600 dark:text-neutral-300 text-xs font-semibold rounded transition-colors focus:outline-none focus:ring-2 focus:ring-brand"
            title="Muat ulang data dari server (Bypass Cache)"
          >
            Sync Data
          </button>
        </div>
      </Section>

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {/* Total */}
        <div className="bg-card-custom border border-border-light rounded-lg p-4 flex flex-col justify-between shadow-sm">
          <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">{t('jobs.stats.total')}</span>
          <span className="text-3xl font-bold font-heading text-neutral-dark mt-2">{stats.total}</span>
        </div>
        {/* Applied */}
        <div className="bg-card-custom border-l-4 border-l-blue-500 border border-border-light rounded-lg p-4 flex flex-col justify-between shadow-sm">
          <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">{t('jobs.stats.applied')}</span>
          <span className="text-3xl font-bold font-heading text-blue-600 dark:text-blue-400 mt-2">{stats.applied}</span>
        </div>
        {/* Test */}
        <div className="bg-card-custom border-l-4 border-l-amber-500 border border-border-light rounded-lg p-4 flex flex-col justify-between shadow-sm">
          <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">{t('jobs.stats.test')}</span>
          <span className="text-3xl font-bold font-heading text-amber-600 dark:text-amber-400 mt-2">{stats.test}</span>
        </div>
        {/* Interview */}
        <div className="bg-card-custom border-l-4 border-l-purple-500 border border-border-light rounded-lg p-4 flex flex-col justify-between shadow-sm">
          <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">{t('jobs.stats.interview')}</span>
          <span className="text-3xl font-bold font-heading text-purple-600 dark:text-purple-400 mt-2">{stats.interview}</span>
        </div>
        {/* Offering */}
        <div className="bg-card-custom border-l-4 border-l-green-500 border border-border-light rounded-lg p-4 flex flex-col justify-between shadow-sm">
          <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">{t('jobs.stats.offering')}</span>
          <span className="text-3xl font-bold font-heading text-green-600 dark:text-green-400 mt-2">{stats.offering}</span>
        </div>
        {/* Rejected */}
        <div className="bg-card-custom border-l-4 border-l-red-500 border border-border-light rounded-lg p-4 flex flex-col justify-between shadow-sm">
          <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">{t('jobs.stats.rejected')}</span>
          <span className="text-3xl font-bold font-heading text-red-600 dark:text-red-400 mt-2">{stats.rejected}</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 py-4 border-b border-border-light">
        {/* Search */}
        <div className="flex-1">
          <input
            type="text"
            placeholder={t('jobs.search.placeholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-border-light bg-card-custom rounded focus:outline-none focus:ring-2 focus:ring-brand text-sm text-neutral-dark"
          />
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          {/* Filter Dropdown */}
          <div className="flex-1 sm:w-44">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-border-light bg-card-custom rounded focus:outline-none focus:ring-2 focus:ring-brand text-sm text-neutral-dark"
            >
              <option value="all">{t('jobs.filter.all')}</option>
              {availableStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Order Dropdown */}
          <div className="flex-1 sm:w-36">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full px-3 py-2 border border-border-light bg-card-custom rounded focus:outline-none focus:ring-2 focus:ring-brand text-sm text-neutral-dark"
            >
              <option value="desc">{t('jobs.order.newest')}</option>
              <option value="asc">{t('jobs.order.oldest')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Applications List Container */}
      <Section className="border-b-0 pt-4">
        {filteredApplications.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-neutral-600 dark:text-neutral-300 font-sans">{t('jobs.empty')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto border border-border-light rounded-lg bg-card-custom shadow-sm">
            {/* Desktop Table View */}
            <table className="min-w-full divide-y divide-border-light text-left text-sm font-sans hidden sm:table">
              <thead className="bg-neutral-light/50 text-neutral-600 dark:text-neutral-300 text-xs font-semibold uppercase tracking-wider">
                <tr>
                  <th scope="col" className="px-6 py-4">{t('jobs.table.company')}</th>
                  <th scope="col" className="px-6 py-4">{t('jobs.table.position')}</th>
                  <th scope="col" className="px-6 py-4">{t('jobs.table.status')}</th>
                  <th scope="col" className="px-6 py-4">{t('jobs.table.updated')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light/60 bg-transparent">
                {filteredApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-neutral-light/20 transition-colors">
                    <td className="px-6 py-4 font-semibold text-neutral-dark">{app.company}</td>
                    <td className="px-6 py-4 text-neutral-500 dark:text-neutral-400">{app.position}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-1 text-xs font-semibold rounded border ${getStatusStyle(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-neutral-500 dark:text-neutral-400 text-xs">{formatDate(app.updated_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile List Card View */}
            <div className="sm:hidden divide-y divide-border-light/60">
              {filteredApplications.map((app) => (
                <div key={app.id} className="p-5 space-y-3 hover:bg-neutral-light/20 transition-colors">
                  <div className="flex justify-between items-baseline gap-2">
                    <h3 className="font-bold text-neutral-dark text-base">{app.company}</h3>
                    <span className={`inline-block px-2.5 py-1 text-[10px] font-semibold rounded border ${getStatusStyle(app.status)}`}>
                      {app.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">{app.position}</p>
                    <p className="text-[11px] text-neutral-400 mt-2">
                      {t('jobs.table.updated')}: {formatDate(app.updated_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Section>
    </div>
  );
};

export default JobApplications;
