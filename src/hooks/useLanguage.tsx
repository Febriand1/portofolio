import React, { createContext, useContext, useState } from 'react';

export type Language = 'id' | 'en';

interface TranslationDictionary {
  [key: string]: {
    id: string;
    en: string;
  };
}

const translations: TranslationDictionary = {
  'nav.home': { id: 'Home', en: 'Home' },
  'nav.projects': { id: 'Proyek', en: 'Projects' },
  'nav.about': { id: 'Tentang', en: 'About' },
  'nav.experience': { id: 'Pengalaman', en: 'Experience' },
  'nav.contact': { id: 'Kontak', en: 'Contact' },
  'nav.jobs': { id: 'Lamaran', en: 'Applications' },
  'hero.badge': {
    id: 'Fullstack Developer',
    en: 'Fullstack Developer',
  },
  'hero.title': {
    id: 'Halo, saya Dirga. Saya membangun aplikasi web & mobile modern.',
    en: "Hi, I'm Dirga. I build modern web & mobile applications.",
  },
  'hero.desc': {
    id: 'Membangun aplikasi web & mobile modern dengan arsitektur backend yang tangguh berbasis React, Laravel, Flutter, dan Go.',
    en: 'Building modern web & mobile applications with robust backend architectures powered by React, Laravel, Flutter, and Go.',
  },
  'hero.cta.projects': {
    id: 'Telusuri Studi Kasus',
    en: 'Explore Case Studies',
  },
  'hero.cta.contact': { id: 'Hubungi Saya', en: 'Contact Me' },
  'projects.featured.title': {
    id: 'Studi Kasus Pilihan',
    en: 'Featured Case Studies',
  },
  'projects.featured.desc': {
    id: 'Bedah mendalam tentang arsitektur sistem nyata dan tantangan integrasi.',
    en: 'In-depth breakdowns of real system architectures and integration challenges.',
  },
  'projects.featured.all': { id: 'Semua Proyek', en: 'All Projects' },
  'skills.core.title': {
    id: 'Kemampuan Teknis Utama',
    en: 'Core Technical Capabilities',
  },
  'projects.title': { id: 'Proyek', en: 'Projects' },
  'projects.desc': {
    id: 'Katalog desain sistem, basis kode, dan integrasi yang telah saya bangun, berfokus pada keputusan teknik dan arsitektur.',
    en: 'A catalog of system designs, codebases, and integrations I have built, focused on engineering decisions and architectures.',
  },
  'projects.filter.label': {
    id: 'Filter berdasarkan Teknologi:',
    en: 'Filter by Technology Stack:',
  },
  'projects.filter.all': { id: 'Semua Teknologi', en: 'All Techs' },
  'projects.empty': {
    id: 'Tidak ada proyek yang cocok dengan filter.',
    en: 'No projects found matching the filter.',
  },
  'projects.card.view': { id: 'Lihat Studi Kasus', en: 'View Case Study' },
  'project.detail.back': {
    id: 'Kembali ke Direktori Proyek',
    en: 'Back to Projects Directory',
  },
  'project.detail.casestudy': { id: 'Studi Kasus', en: 'Case Study' },
  'project.detail.repo': { id: 'Repositori GitHub', en: 'GitHub Repository' },
  'project.detail.demo': { id: 'Demo Langsung', en: 'Live Demo' },
  'project.detail.overview': { id: 'Ikhtisar Proyek', en: 'Project Overview' },
  'project.detail.resp': {
    id: 'Tanggung Jawab & Kontribusi Utama',
    en: 'Key Responsibilities & Contributions',
  },
  'project.detail.features': { id: 'Fitur Sistem', en: 'System Features' },
  'project.detail.architecture': {
    id: 'Arsitektur Sistem',
    en: 'System Architecture',
  },
  'project.detail.api': {
    id: 'Pratinjau API & Implementasi Kode',
    en: 'API & Code Implementation Preview',
  },
  'project.detail.api.desc': {
    id: 'Cuplikan kode ilustratif yang menunjukkan skema eksekusi inti atau kontrak handler:',
    en: 'An illustrative snippet demonstrating core execution schemas or handler contracts:',
  },
  'project.detail.challenges.title': {
    id: 'Tantangan Teknis & Resolusi',
    en: 'Technical Challenges & Resolutions',
  },
  'project.detail.challenges.sub': { id: 'Tantangan', en: 'The Challenge' },
  'project.detail.solutions.sub': { id: 'Solusi', en: 'The Solution' },
  'project.detail.lessons.sub': {
    id: 'Pelajaran yang Diambil',
    en: 'Lessons Learned',
  },
  'about.title': { id: 'Tentang Saya', en: 'About Me' },
  'about.desc': {
    id: 'Saya adalah seorang Fullstack Developer yang berfokus pada pembangunan aplikasi web & mobile tangguh, desain arsitektur modular, dan integrasi API skala enterprise.',
    en: 'I am a Fullstack Developer focused on building robust web & mobile applications, modular architecture design, and enterprise-scale API integrations.',
  },
  'about.bio.title': {
    id: 'Latar Belakang Profesional',
    en: 'Professional Background',
  },
  'about.bio.p1': {
    id: 'Dengan pengalaman di berbagai proyek teknologi, saya berspesialisasi dalam membangun sistem end-to-end dari nol (from scratch). Keahlian saya mencakup arsitektur serverless (Google Cloud Functions, Go), pengembangan sistem manajemen informasi rumah sakit (SIMRS) berbasis React dan Laravel, hingga integrasi layanan Omnichannel menggunakan Go, Django, dan MySQL/PostgreSQL.',
    en: 'With experience across diverse technology projects, I specialize in building end-to-end systems from scratch. My expertise spans serverless architectures (Google Cloud Functions, Go), hospital management information systems (SIMRS) powered by React and Laravel, to Omnichannel service integrations using Go, Django, and MySQL/PostgreSQL.',
  },
  'about.bio.p2': {
    id: 'Saya juga berpengalaman mengembangkan modul frontend responsif menggunakan Next.js dan Vue.js, serta aplikasi mobile dengan Flutter. Saya berfokus pada penulisan kode yang bersih, performa database yang efisien, dan stabilitas performa sistem.',
    en: 'I am also experienced in developing responsive frontend modules using Next.js and Vue.js, as well as mobile applications using Flutter. My focus lies on writing clean code, efficient database performance, and system stability.',
  },
  'about.education.title': { id: 'Pendidikan', en: 'Education' },
  'about.certs.title': {
    id: 'Sertifikasi Profesional',
    en: 'Professional Certifications',
  },
  'about.certs.verify': {
    id: 'Verifikasi Kredensial',
    en: 'Verify Credential',
  },
  'experience.title': { id: 'Pengalaman Kerja', en: 'Work Experience' },
  'experience.desc': {
    id: 'Ikhtisar kronologis karier software engineering, fokus area, dan kontribusi teknis saya.',
    en: 'Chronological overview of my software engineering career, focus areas, and technical contributions.',
  },
  'contact.title': { id: 'Hubungi Saya', en: 'Contact Me' },
  'contact.desc': {
    id: 'Jangan ragu untuk menghubungi saya untuk mendiskusikan sistem terdistribusi, desain API, atau peluang potensial.',
    en: 'Feel free to reach out to discuss distributed systems, api designs, or potential opportunities.',
  },
  'contact.connect': { id: 'Hubungkan', en: 'Connect' },
  'footer.handcrafted': {
    id: 'Dibuat dengan React & Tailwind CSS.',
    en: 'Handcrafted with React & Tailwind CSS.',
  },
  'notfound.title': {
    id: 'Halaman Tidak Ditemukan',
    en: 'Page Not Found',
  },
  'notfound.desc': {
    id: 'Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.',
    en: 'Sorry, the page you are looking for does not exist or has been moved.',
  },
  'notfound.cta.home': {
    id: 'Kembali ke Beranda',
    en: 'Back to Home',
  },
  'notfound.cta.projects': {
    id: 'Lihat Proyek',
    en: 'Explore Projects',
  },
  'error.title': {
    id: 'Terjadi Kesalahan',
    en: 'An Error Occurred',
  },
  'error.desc': {
    id: 'Aplikasi mengalami kesalahan yang tidak terduga.',
    en: 'The application encountered an unexpected error.',
  },
  'error.retry': {
    id: 'Muat Ulang Halaman',
    en: 'Reload Page',
  },
  'restricted.title': {
    id: 'Akses Dibatasi',
    en: 'Access Restricted',
  },
  'restricted.desc': {
    id: 'Anda tidak memiliki izin untuk mengakses area ini.',
    en: 'You do not have permission to access this area.',
  },
  'loading.profile': {
    id: 'Memuat profil...',
    en: 'Loading profile...',
  },
  'loading.projects': {
    id: 'Memuat proyek...',
    en: 'Loading engineering projects...',
  },
  'loading.detail': {
    id: 'Memuat spesifikasi proyek...',
    en: 'Loading project specifications...',
  },
  'loading.about': {
    id: 'Memuat detail profil...',
    en: 'Loading education and profile details...',
  },
  'loading.experience': {
    id: 'Memuat riwayat karir...',
    en: 'Loading career history...',
  },
  'loading.contact': {
    id: 'Memuat saluran komunikasi...',
    en: 'Loading contact channels...',
  },
  'jobs.title': {
    id: 'Pelacak Lamaran Kerja',
    en: 'Job Applications Tracker',
  },
  'jobs.desc': {
    id: 'Daftar perusahaan dan posisi yang telah saya lamar beserta status perkembangannya secara real-time.',
    en: 'Real-time list of companies and positions I have applied to, along with their current status.',
  },
  'jobs.search.placeholder': {
    id: 'Cari perusahaan atau posisi...',
    en: 'Search company or position...',
  },
  'jobs.filter.all': {
    id: 'Semua Status',
    en: 'All Statuses',
  },
  'jobs.table.company': {
    id: 'Perusahaan',
    en: 'Company',
  },
  'jobs.table.position': {
    id: 'Posisi',
    en: 'Position',
  },
  'jobs.table.status': {
    id: 'Status',
    en: 'Status',
  },
  'jobs.table.updated': {
    id: 'Pembaruan Terakhir',
    en: 'Last Updated',
  },
  'jobs.stats.total': {
    id: 'Total Lamaran',
    en: 'Total Applications',
  },
  'jobs.stats.applied': {
    id: 'Terkirim (Applied)',
    en: 'Applied',
  },
  'jobs.stats.test': {
    id: 'Tes Teknis',
    en: 'Technical Test',
  },
  'jobs.stats.interview': {
    id: 'Wawancara',
    en: 'Interview',
  },
  'jobs.stats.offering': {
    id: 'Diterima (Offering)',
    en: 'Offering',
  },
  'jobs.stats.rejected': {
    id: 'Ditolak',
    en: 'Rejected',
  },
  'jobs.loading': {
    id: 'Memuat data lamaran kerja...',
    en: 'Loading job applications data...',
  },
  'jobs.error': {
    id: 'Gagal memuat data lamaran kerja. Silakan coba lagi nanti.',
    en: 'Failed to load job applications. Please try again later.',
  },
  'jobs.empty': {
    id: 'Tidak ada data lamaran kerja yang cocok.',
    en: 'No matching job applications found.',
  },
  'jobs.order.newest': {
    id: 'Terbaru',
    en: 'Newest',
  },
  'jobs.order.oldest': {
    id: 'Terlama',
    en: 'Oldest',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('portfolio_lang');
    return (saved === 'id' || saved === 'en' ? saved : 'id') as Language;
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('portfolio_lang', lang);
  };

  const t = (key: string): string => {
    const item = translations[key];
    if (!item) return key;
    return item[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
