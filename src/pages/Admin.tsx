import React, { useState, useEffect } from 'react';
import Section from '../components/Section';
import * as OTPAuth from 'otpauth';

const totpSecret = import.meta.env.VITE_TOTP_SECRET || 'DIRGAFEBRIANPORTFOLIOSECRETKEY32';

const totp = new OTPAuth.TOTP({
  issuer: 'Dirga Febrian Portfolio',
  label: 'Admin',
  algorithm: 'SHA1',
  digits: 6,
  period: 30,
  secret: totpSecret
});

interface GitHubConfig {
  token: string;
  owner: string;
  repo: string;
  branch: string;
}

const fileTypes = [
  { value: 'projects', label: 'Projects (projects.json)' },
  { value: 'experience', label: 'Experience (experience.json)' },
  { value: 'skills', label: 'Skills (skills.json)' },
  { value: 'education', label: 'Education (education.json)' },
  { value: 'certificates', label: 'Certificates (certificates.json)' },
  { value: 'socials', label: 'Socials (socials.json)' },
];

const Admin: React.FC = () => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('portfolio_admin_auth') === 'true';
  });
  const [otpInput, setOtpInput] = useState<string>('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showSetup, setShowSetup] = useState<boolean>(false);

  // GitHub configuration
  const [config, setConfig] = useState<GitHubConfig>(() => {
    const saved = localStorage.getItem('portfolio_gh_config');
    return saved
      ? JSON.parse(saved)
      : { token: '', owner: '', repo: '', branch: 'main' };
  });

  const [selectedLang, setSelectedLang] = useState<'id' | 'en'>('id');
  const [selectedFile, setSelectedFile] = useState<string>('projects');
  
  // Data states
  const [dataList, setDataList] = useState<any[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>(null);
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);

  const [status, setStatus] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<'info' | 'success' | 'error' | null>(null);

  // Save config changes to localStorage
  useEffect(() => {
    localStorage.setItem('portfolio_gh_config', JSON.stringify(config));
  }, [config]);

  // Load current file content from public folder
  const fetchCurrentContent = async () => {
    if (!isAuthenticated) return;
    setStatus('Memuat data terbaru dari server...');
    setStatusType('info');
    try {
      const response = await fetch(`/data/${selectedLang}/${selectedFile}.json`);
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          setDataList(data);
        } else {
          setDataList([data]);
        }
        setStatus('Data berhasil dimuat.');
        setStatusType('success');
        // Reset edit states
        setEditingIndex(null);
        setEditForm(null);
        setIsAddingNew(false);
      } else {
        throw new Error('File tidak ditemukan di server lokal.');
      }
    } catch (err: any) {
      console.error(err);
      setDataList([]);
      setStatus('Gagal memuat data dari server. Menampilkan list kosong.');
      setStatusType('error');
    }
  };

  useEffect(() => {
    fetchCurrentContent();
  }, [selectedLang, selectedFile, isAuthenticated]);

  // Handle OTP Verification
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const delta = totp.validate({
      token: otpInput.trim(),
      window: 1
    });

    if (delta !== null) {
      sessionStorage.setItem('portfolio_admin_auth', 'true');
      setIsAuthenticated(true);
    } else {
      setLoginError('Kode OTP salah atau telah kedaluwarsa. Silakan coba lagi.');
    }
  };

  // Setup form states when editing
  const startEdit = (index: number) => {
    setEditingIndex(index);
    setEditForm(JSON.parse(JSON.stringify(dataList[index])));
    setIsAddingNew(false);
  };

  const startAdd = () => {
    setEditingIndex(null);
    setIsAddingNew(true);
    // Create blank stub based on selected file type
    const newStub: any = {};
    if (selectedFile === 'projects') {
      newStub.id = 'new-project';
      newStub.title = '';
      newStub.subtitle = '';
      newStub.overview = '';
      newStub.responsibilities = [''];
      newStub.features = [''];
      newStub.architecture = { description: '' };
      newStub.apiPreview = { language: 'typescript', code: '' };
      newStub.gallery = [];
      newStub.challenges = '';
      newStub.solutions = '';
      newStub.lessonsLearned = '';
      newStub.techStack = [''];
      newStub.githubUrl = '';
      newStub.liveUrl = '';
    } else if (selectedFile === 'experience') {
      newStub.id = 'new-experience';
      newStub.role = '';
      newStub.company = '';
      newStub.companyUrl = '';
      newStub.location = '';
      newStub.type = 'Full-time';
      newStub.startDate = '';
      newStub.endDate = 'Present';
      newStub.description = '';
      newStub.achievements = [''];
      newStub.techStack = [''];
    } else if (selectedFile === 'skills') {
      newStub.id = 'new-category';
      newStub.category = '';
      newStub.skills = [{ name: '', level: 'Intermediate', yearsOfExperience: 1 }];
    } else if (selectedFile === 'education') {
      newStub.id = 'new-education';
      newStub.institution = '';
      newStub.degree = '';
      newStub.fieldOfStudy = '';
      newStub.startDate = '';
      newStub.endDate = '';
      newStub.description = '';
    } else if (selectedFile === 'certificates') {
      newStub.id = 'new-cert';
      newStub.title = '';
      newStub.issuer = '';
      newStub.issueDate = '';
      newStub.credentialId = '';
      newStub.credentialUrl = '';
    } else if (selectedFile === 'socials') {
      newStub.platform = '';
      newStub.url = '';
      newStub.label = '';
      newStub.iconName = '';
    }
    setEditForm(newStub);
  };

  const handleSaveForm = () => {
    if (!editForm) return;
    const updatedList = [...dataList];
    if (isAddingNew) {
      updatedList.push(editForm);
    } else if (editingIndex !== null) {
      updatedList[editingIndex] = editForm;
    }
    setDataList(updatedList);
    setEditingIndex(null);
    setEditForm(null);
    setIsAddingNew(false);
    setStatus('Perubahan disimpan sementara di memori browser. Klik "Simpan & Push ke GitHub" untuk menerapkan secara permanen.');
    setStatusType('info');
  };

  const handleDeleteItem = (index: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus item ini?')) {
      const updatedList = dataList.filter((_, i) => i !== index);
      setDataList(updatedList);
      setStatus('Item berhasil dihapus sementara dari memori. Klik "Simpan & Push ke GitHub" untuk menerapkan.');
      setStatusType('info');
    }
  };

  const handlePushToGitHub = async () => {
    if (!config.token || !config.owner || !config.repo) {
      setStatus('Error: Konfigurasi GitHub belum lengkap (Token, Owner, dan Repo wajib diisi).');
      setStatusType('error');
      return;
    }

    setStatus('Menghubungkan ke GitHub API...');
    setStatusType('info');

    const path = `public/data/${selectedLang}/${selectedFile}.json`;
    const url = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${path}`;
    const headers = {
      Authorization: `token ${config.token}`,
      Accept: 'application/vnd.github.v3+json',
    };

    try {
      let sha: string | null = null;
      try {
        const getFileResponse = await fetch(`${url}?ref=${config.branch}`, { headers });
        if (getFileResponse.ok) {
          const fileData = await getFileResponse.json();
          sha = fileData.sha;
        }
      } catch (e) {
        console.log('File baru akan dibuat (belum ada SHA).');
      }

      setStatus('Mengunggah berkas baru ke repositori...');
      const jsonString = JSON.stringify(dataList, null, 2);
      const encodedContent = btoa(unescape(encodeURIComponent(jsonString)));
      
      const body = {
        message: `update: data ${selectedFile}.json (${selectedLang}) via Web CMS Panel`,
        content: encodedContent,
        branch: config.branch,
        ...(sha ? { sha } : {}),
      };

      const putResponse = await fetch(url, {
        method: 'PUT',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (putResponse.ok) {
        setStatus('Sukses! Data berhasil di-push ke GitHub. Proses deploy otomatis berjalan.');
        setStatusType('success');
      } else {
        const errorData = await putResponse.json();
        throw new Error(errorData.message || 'Gagal mengirim commit.');
      }
    } catch (err: any) {
      console.error(err);
      setStatus(`Gagal menyimpan data ke GitHub: ${err.message}`);
      setStatusType('error');
    }
  };

  // Helper arrays update functions
  const updateArrayField = (field: string, index: number, value: string) => {
    const updated = { ...editForm };
    updated[field][index] = value;
    setEditForm(updated);
  };

  const addArrayFieldRow = (field: string) => {
    const updated = { ...editForm };
    updated[field].push('');
    setEditForm(updated);
  };

  const removeArrayFieldRow = (field: string, index: number) => {
    const updated = { ...editForm };
    updated[field] = updated[field].filter((_: any, i: number) => i !== index);
    setEditForm(updated);
  };

  // If not authenticated, show premium TOTP Login page
  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-card-custom border border-border-light rounded-xl p-8 shadow-sm">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold font-heading text-neutral-dark mb-2">
              Panel Keamanan Admin
            </h1>
            <p className="text-sm text-neutral-500 font-sans">
              Masukkan kode 6-digit Authenticator Anda untuk mengakses panel pengelolaan data portofolio.
            </p>
          </div>

          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                Kode Verifikasi 6-Digit
              </label>
              <input
                type="text"
                maxLength={6}
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                placeholder="000 000"
                className="w-full text-center px-4 py-3 border border-border-light rounded-md focus:outline-none focus:ring-2 focus:ring-brand font-mono text-xl tracking-widest"
                autoFocus
              />
            </div>

            {loginError && (
              <p className="text-xs text-red-500 font-medium text-center">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-brand hover:bg-brand-hover text-white text-sm font-semibold rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand"
            >
              Verifikasi & Masuk
            </button>
          </form>

          <div className="mt-8 border-t border-border-light pt-4 text-center">
            <button
              onClick={() => setShowSetup(!showSetup)}
              className="text-xs font-semibold text-neutral-400 hover:text-brand transition-colors"
            >
              {showSetup ? 'Sembunyikan Petunjuk Setup' : 'Tampilkan Petunjuk Setup (2FA)'}
            </button>
            
            {showSetup && (
              <div className="mt-4 p-4 bg-neutral-light rounded-lg border border-border-light text-left text-xs space-y-2">
                <p className="font-semibold text-neutral-dark">Petunjuk Google Authenticator:</p>
                <p className="text-neutral-500 leading-relaxed">
                  Buka Google Authenticator, tambahkan akun baru secara manual (**setup key**), masukkan kunci rahasia ini:
                </p>
                <div className="font-mono bg-card-custom border border-border-light px-2 py-1.5 rounded text-center font-bold text-neutral-700 select-all">
                  {totpSecret}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Section className="pt-8 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold font-heading text-neutral-dark mb-2">
            Panel Visual CMS Portofolio
          </h1>
          <p className="text-sm text-neutral-500 font-sans">
            Gunakan formulir visual di bawah untuk mengelola proyek, karir, dan detail data portofolio.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              sessionStorage.removeItem('portfolio_admin_auth');
              setIsAuthenticated(false);
            }}
            className="px-4 py-2 border border-border-light hover:bg-neutral-light text-neutral-600 text-xs font-semibold rounded"
          >
            Keluar (Logout)
          </button>
        </div>
      </Section>

      {/* Configuration & selector cards */}
      <div className="space-y-6">
        {/* GitHub settings */}
        <div className="border border-border-light rounded-lg p-5 bg-card-custom space-y-4">
          <h3 className="font-bold text-neutral-dark font-heading text-base border-b border-border-light pb-2">
            Konfigurasi Repositori
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">GitHub PAT Token</label>
              <input
                type="password"
                placeholder="ghp_xxxx"
                value={config.token}
                onChange={(e) => setConfig({ ...config, token: e.target.value })}
                className="w-full px-3 py-1.5 border border-border-light rounded text-xs focus:outline-none focus:ring-2 focus:ring-brand font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">GitHub Owner</label>
              <input
                type="text"
                placeholder="Owner"
                value={config.owner}
                onChange={(e) => setConfig({ ...config, owner: e.target.value })}
                className="w-full px-3 py-1.5 border border-border-light rounded text-xs focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Repo Name</label>
              <input
                type="text"
                placeholder="Repo"
                value={config.repo}
                onChange={(e) => setConfig({ ...config, repo: e.target.value })}
                className="w-full px-3 py-1.5 border border-border-light rounded text-xs focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Branch</label>
              <input
                type="text"
                placeholder="main"
                value={config.branch}
                onChange={(e) => setConfig({ ...config, branch: e.target.value })}
                className="w-full px-3 py-1.5 border border-border-light rounded text-xs focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>
          </div>
        </div>

        {/* CMS main manager */}
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="border border-border-light rounded-lg p-5 bg-card-custom space-y-4">
            <h3 className="font-bold text-neutral-dark font-heading text-base border-b border-border-light pb-2">
              Pengaturan Konten
            </h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Pilih Bahasa</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedLang('id')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded border transition-colors ${
                      selectedLang === 'id'
                        ? 'bg-brand text-white border-brand'
                        : 'bg-card-custom text-neutral-600 border-border-light hover:bg-neutral-light'
                    }`}
                  >
                    Bahasa Indonesia (ID)
                  </button>
                  <button
                    onClick={() => setSelectedLang('en')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded border transition-colors ${
                      selectedLang === 'en'
                        ? 'bg-brand text-white border-brand'
                        : 'bg-card-custom text-neutral-600 border-border-light hover:bg-neutral-light'
                    }`}
                  >
                    Bahasa Inggris (EN)
                  </button>
                </div>
              </div>

              <div className="flex-1">
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Pilih File Data</label>
                <select
                  value={selectedFile}
                  onChange={(e) => setSelectedFile(e.target.value)}
                  className="w-full px-3 py-1.5 border border-border-light bg-card-custom rounded focus:outline-none focus:ring-2 focus:ring-brand text-xs"
                >
                  {fileTypes.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Form Editor or List Mode */}
          {editForm ? (
            /* ==================== FORM MODE ==================== */
            <div className="border border-border-light rounded-lg p-6 bg-card-custom space-y-6">
              <div className="flex justify-between items-baseline border-b border-border-light pb-3">
                <h3 className="font-bold text-neutral-dark font-heading text-lg">
                  {isAddingNew ? 'Tambah Item Baru' : 'Edit Item'}
                </h3>
                <span className="text-xs text-neutral-400 font-semibold uppercase tracking-wider font-mono">
                  {selectedFile}
                </span>
              </div>

              {/* Dynamic form inputs depending on selectedFile */}
              <div className="space-y-4">
                {selectedFile === 'projects' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-500 mb-1">ID Proyek (Kunci Unik)</label>
                        <input
                          type="text"
                          value={editForm.id || ''}
                          onChange={(e) => setEditForm({ ...editForm, id: e.target.value })}
                          className="w-full px-3 py-2 border border-border-light rounded text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-500 mb-1">Judul Proyek</label>
                        <input
                          type="text"
                          value={editForm.title || ''}
                          onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                          className="w-full px-3 py-2 border border-border-light rounded text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-500 mb-1">Sub-judul / Deskripsi Pendek</label>
                      <input
                        type="text"
                        value={editForm.subtitle || ''}
                        onChange={(e) => setEditForm({ ...editForm, subtitle: e.target.value })}
                        className="w-full px-3 py-2 border border-border-light rounded text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-500 mb-1">Ikhtisar Proyek (Overview)</label>
                      <textarea
                        rows={4}
                        value={editForm.overview || ''}
                        onChange={(e) => setEditForm({ ...editForm, overview: e.target.value })}
                        className="w-full px-3 py-2 border border-border-light rounded text-sm focus:outline-none focus:ring-2 focus:ring-brand font-sans"
                      />
                    </div>

                    {/* Tech Stack List */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-xs font-semibold text-neutral-500">Tech Stack (Daftar Teknologi)</label>
                        <button
                          type="button"
                          onClick={() => addArrayFieldRow('techStack')}
                          className="text-xs font-semibold text-brand hover:underline"
                        >
                          + Tambah Tech
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {editForm.techStack?.map((tech: string, i: number) => (
                          <div key={i} className="flex items-center gap-1 border border-border-light rounded px-2 py-1 bg-neutral-light">
                            <input
                              type="text"
                              value={tech}
                              onChange={(e) => updateArrayField('techStack', i, e.target.value)}
                              className="bg-transparent border-0 p-0 text-xs w-20 focus:ring-0 focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => removeArrayFieldRow('techStack', i)}
                              className="text-neutral-400 hover:text-red-500 text-xs font-bold px-1"
                            >
                              &times;
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Responsibilities list */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-xs font-semibold text-neutral-500">Tanggung Jawab Utama</label>
                        <button
                          type="button"
                          onClick={() => addArrayFieldRow('responsibilities')}
                          className="text-xs font-semibold text-brand hover:underline"
                        >
                          + Tambah Baris
                        </button>
                      </div>
                      <div className="space-y-2">
                        {editForm.responsibilities?.map((resp: string, i: number) => (
                          <div key={i} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={resp}
                              onChange={(e) => updateArrayField('responsibilities', i, e.target.value)}
                              className="w-full px-3 py-1.5 border border-border-light rounded text-xs focus:outline-none focus:ring-2 focus:ring-brand"
                            />
                            <button
                              type="button"
                              onClick={() => removeArrayFieldRow('responsibilities', i)}
                              className="text-red-500 hover:text-red-700 text-sm font-bold px-2"
                            >
                              &times;
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Features list */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-xs font-semibold text-neutral-500">Fitur Utama</label>
                        <button
                          type="button"
                          onClick={() => addArrayFieldRow('features')}
                          className="text-xs font-semibold text-brand hover:underline"
                        >
                          + Tambah Fitur
                        </button>
                      </div>
                      <div className="space-y-2">
                        {editForm.features?.map((feat: string, i: number) => (
                          <div key={i} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={feat}
                              onChange={(e) => updateArrayField('features', i, e.target.value)}
                              className="w-full px-3 py-1.5 border border-border-light rounded text-xs focus:outline-none focus:ring-2 focus:ring-brand"
                            />
                            <button
                              type="button"
                              onClick={() => removeArrayFieldRow('features', i)}
                              className="text-red-500 hover:text-red-700 text-sm font-bold px-2"
                            >
                              &times;
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-500 mb-1">Deskripsi Arsitektur</label>
                      <textarea
                        rows={3}
                        value={editForm.architecture?.description || ''}
                        onChange={(e) => setEditForm({
                          ...editForm,
                          architecture: { ...editForm.architecture, description: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-border-light rounded text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-500 mb-1">GitHub URL</label>
                        <input
                          type="text"
                          value={editForm.githubUrl || ''}
                          onChange={(e) => setEditForm({ ...editForm, githubUrl: e.target.value })}
                          className="w-full px-3 py-2 border border-border-light rounded text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-500 mb-1">Live Demo URL</label>
                        <input
                          type="text"
                          value={editForm.liveUrl || ''}
                          onChange={(e) => setEditForm({ ...editForm, liveUrl: e.target.value })}
                          className="w-full px-3 py-2 border border-border-light rounded text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 border-t border-border-light pt-4">
                      <div className="col-span-1">
                        <label className="block text-xs font-semibold text-neutral-500 mb-1">Bahasa Cuplikan API</label>
                        <input
                          type="text"
                          value={editForm.apiPreview?.language || ''}
                          onChange={(e) => setEditForm({
                            ...editForm,
                            apiPreview: { ...editForm.apiPreview, language: e.target.value }
                          })}
                          className="w-full px-3 py-2 border border-border-light rounded text-sm focus:outline-none focus:ring-2 focus:ring-brand font-mono"
                          placeholder="typescript / dart / go"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-semibold text-neutral-500 mb-1">Kode Cuplikan API</label>
                        <textarea
                          rows={6}
                          value={editForm.apiPreview?.code || ''}
                          onChange={(e) => setEditForm({
                            ...editForm,
                            apiPreview: { ...editForm.apiPreview, code: e.target.value }
                          })}
                          className="w-full p-2 border border-border-light rounded font-mono text-xs focus:outline-none focus:ring-2 focus:ring-brand leading-relaxed"
                          placeholder="// tulis kode"
                        />
                      </div>
                    </div>

                    <div className="border-t border-border-light pt-4 space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-500 mb-1">Tantangan Utama</label>
                        <textarea
                          rows={2}
                          value={editForm.challenges || ''}
                          onChange={(e) => setEditForm({ ...editForm, challenges: e.target.value })}
                          className="w-full px-3 py-2 border border-border-light rounded text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-500 mb-1">Solusi yang Diterapkan</label>
                        <textarea
                          rows={2}
                          value={editForm.solutions || ''}
                          onChange={(e) => setEditForm({ ...editForm, solutions: e.target.value })}
                          className="w-full px-3 py-2 border border-border-light rounded text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-500 mb-1">Pelajaran yang Diambil</label>
                        <textarea
                          rows={2}
                          value={editForm.lessonsLearned || ''}
                          onChange={(e) => setEditForm({ ...editForm, lessonsLearned: e.target.value })}
                          className="w-full px-3 py-2 border border-border-light rounded text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                        />
                      </div>
                    </div>
                  </>
                )}

                {selectedFile === 'experience' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-500 mb-1">Role / Jabatan</label>
                        <input
                          type="text"
                          value={editForm.role || ''}
                          onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                          className="w-full px-3 py-2 border border-border-light rounded text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-500 mb-1">Nama Instansi/Perusahaan</label>
                        <input
                          type="text"
                          value={editForm.company || ''}
                          onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                          className="w-full px-3 py-2 border border-border-light rounded text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-500 mb-1">Lokasi</label>
                        <input
                          type="text"
                          value={editForm.location || ''}
                          onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                          className="w-full px-3 py-2 border border-border-light rounded text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-500 mb-1">Jenis Kontrak</label>
                        <input
                          type="text"
                          value={editForm.type || ''}
                          onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                          className="w-full px-3 py-2 border border-border-light rounded text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                          placeholder="Full-time / Internship"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-500 mb-1">Situs Perusahaan (Opsional)</label>
                        <input
                          type="text"
                          value={editForm.companyUrl || ''}
                          onChange={(e) => setEditForm({ ...editForm, companyUrl: e.target.value })}
                          className="w-full px-3 py-2 border border-border-light rounded text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-500 mb-1">Tanggal Mulai (YYYY-MM)</label>
                        <input
                          type="text"
                          value={editForm.startDate || ''}
                          onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })}
                          className="w-full px-3 py-2 border border-border-light rounded text-sm focus:outline-none focus:ring-2 focus:ring-brand font-mono"
                          placeholder="2025-12"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-500 mb-1">Tanggal Berakhir (YYYY-MM)</label>
                        <input
                          type="text"
                          value={editForm.endDate || ''}
                          onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })}
                          className="w-full px-3 py-2 border border-border-light rounded text-sm focus:outline-none focus:ring-2 focus:ring-brand font-mono"
                          placeholder="2026-06 atau Present"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-500 mb-1">Ikhtisar Jabatan (Description)</label>
                      <textarea
                        rows={3}
                        value={editForm.description || ''}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        className="w-full px-3 py-2 border border-border-light rounded text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                      />
                    </div>

                    {/* Achievements List */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-xs font-semibold text-neutral-500">Pencapaian Utama</label>
                        <button
                          type="button"
                          onClick={() => addArrayFieldRow('achievements')}
                          className="text-xs font-semibold text-brand hover:underline"
                        >
                          + Tambah Pencapaian
                        </button>
                      </div>
                      <div className="space-y-2">
                        {editForm.achievements?.map((ach: string, i: number) => (
                          <div key={i} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={ach}
                              onChange={(e) => updateArrayField('achievements', i, e.target.value)}
                              className="w-full px-3 py-1.5 border border-border-light rounded text-xs focus:outline-none focus:ring-2 focus:ring-brand"
                            />
                            <button
                              type="button"
                              onClick={() => removeArrayFieldRow('achievements', i)}
                              className="text-red-500 hover:text-red-700 text-sm font-bold px-2"
                            >
                              &times;
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tech Stack List */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-xs font-semibold text-neutral-500">Teknologi yang Digunakan (Tech Stack)</label>
                        <button
                          type="button"
                          onClick={() => addArrayFieldRow('techStack')}
                          className="text-xs font-semibold text-brand hover:underline"
                        >
                          + Tambah Tech
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {editForm.techStack?.map((tech: string, i: number) => (
                          <div key={i} className="flex items-center gap-1 border border-border-light rounded px-2 py-1 bg-neutral-light">
                            <input
                              type="text"
                              value={tech}
                              onChange={(e) => updateArrayField('techStack', i, e.target.value)}
                              className="bg-transparent border-0 p-0 text-xs w-20 focus:ring-0 focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => removeArrayFieldRow('techStack', i)}
                              className="text-neutral-400 hover:text-red-500 text-xs font-bold px-1"
                            >
                              &times;
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {selectedFile === 'skills' && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-500 mb-1">Nama Kategori Kemampuan</label>
                      <input
                        type="text"
                        value={editForm.category || ''}
                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                        className="w-full px-3 py-2 border border-border-light rounded text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                      />
                    </div>

                    {/* Sub Skills items management */}
                    <div className="border-t border-border-light pt-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="block text-xs font-semibold text-neutral-500 font-heading">Daftar Kemampuan Spesifik</label>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = { ...editForm };
                            updated.skills = [...updated.skills, { name: '', level: 'Intermediate', yearsOfExperience: 1 }];
                            setEditForm(updated);
                          }}
                          className="text-xs font-semibold text-brand hover:underline"
                        >
                          + Tambah Item Skill
                        </button>
                      </div>

                      {editForm.skills?.map((subSkill: any, i: number) => (
                        <div key={i} className="flex flex-col sm:flex-row gap-3 p-3 border border-border-light rounded bg-neutral-light/40 relative">
                          <button
                            type="button"
                            onClick={() => {
                              const updated = { ...editForm };
                              updated.skills = updated.skills.filter((_: any, idx: number) => idx !== i);
                              setEditForm(updated);
                            }}
                            className="absolute top-2 right-2 text-neutral-400 hover:text-red-500 text-sm font-bold"
                          >
                            &times;
                          </button>
                          <div className="flex-1">
                            <label className="block text-[10px] uppercase font-semibold text-neutral-400 mb-1">Nama Teknologi</label>
                            <input
                              type="text"
                              value={subSkill.name || ''}
                              onChange={(e) => {
                                const updated = { ...editForm };
                                updated.skills[i].name = e.target.value;
                                setEditForm(updated);
                              }}
                              className="w-full px-2 py-1 border border-border-light bg-card-custom rounded text-xs"
                            />
                          </div>
                          <div className="w-32">
                            <label className="block text-[10px] uppercase font-semibold text-neutral-400 mb-1">Tingkat</label>
                            <input
                              type="text"
                              value={subSkill.level || ''}
                              onChange={(e) => {
                                const updated = { ...editForm };
                                updated.skills[i].level = e.target.value;
                                setEditForm(updated);
                              }}
                              className="w-full px-2 py-1 border border-border-light bg-card-custom rounded text-xs"
                              placeholder="Expert / Advanced"
                            />
                          </div>
                          <div className="w-24">
                            <label className="block text-[10px] uppercase font-semibold text-neutral-400 mb-1">Tahun Exp</label>
                            <input
                              type="number"
                              value={subSkill.yearsOfExperience || 0}
                              onChange={(e) => {
                                const updated = { ...editForm };
                                updated.skills[i].yearsOfExperience = parseInt(e.target.value) || 0;
                                setEditForm(updated);
                              }}
                              className="w-full px-2 py-1 border border-border-light bg-card-custom rounded text-xs"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {selectedFile === 'education' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-500 mb-1">Nama Instansi</label>
                        <input
                          type="text"
                          value={editForm.institution || ''}
                          onChange={(e) => setEditForm({ ...editForm, institution: e.target.value })}
                          className="w-full px-3 py-2 border border-border-light rounded text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-500 mb-1">Gelar (Degree)</label>
                        <input
                          type="text"
                          value={editForm.degree || ''}
                          onChange={(e) => setEditForm({ ...editForm, degree: e.target.value })}
                          className="w-full px-3 py-2 border border-border-light rounded text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                          placeholder="Sarjana Komputer (S.Kom)"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-1">
                        <label className="block text-xs font-semibold text-neutral-500 mb-1">Bidang Studi (Field)</label>
                        <input
                          type="text"
                          value={editForm.fieldOfStudy || ''}
                          onChange={(e) => setEditForm({ ...editForm, fieldOfStudy: e.target.value })}
                          className="w-full px-3 py-2 border border-border-light rounded text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-500 mb-1">Tanggal Mulai (YYYY-MM)</label>
                        <input
                          type="text"
                          value={editForm.startDate || ''}
                          onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })}
                          className="w-full px-3 py-2 border border-border-light rounded text-sm focus:outline-none focus:ring-2 focus:ring-brand font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-500 mb-1">Tanggal Selesai (YYYY-MM)</label>
                        <input
                          type="text"
                          value={editForm.endDate || ''}
                          onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })}
                          className="w-full px-3 py-2 border border-border-light rounded text-sm focus:outline-none focus:ring-2 focus:ring-brand font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-500 mb-1">Deskripsi Tambahan</label>
                      <textarea
                        rows={2}
                        value={editForm.description || ''}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        className="w-full px-3 py-2 border border-border-light rounded text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                      />
                    </div>
                  </>
                )}

                {selectedFile === 'certificates' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-500 mb-1">Nama Sertifikat</label>
                        <input
                          type="text"
                          value={editForm.title || ''}
                          onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                          className="w-full px-3 py-2 border border-border-light rounded text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-500 mb-1">Lembaga Penerbit</label>
                        <input
                          type="text"
                          value={editForm.issuer || ''}
                          onChange={(e) => setEditForm({ ...editForm, issuer: e.target.value })}
                          className="w-full px-3 py-2 border border-border-light rounded text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-500 mb-1">Tanggal Terbit</label>
                        <input
                          type="text"
                          value={editForm.issueDate || ''}
                          onChange={(e) => setEditForm({ ...editForm, issueDate: e.target.value })}
                          className="w-full px-3 py-2 border border-border-light rounded text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-500 mb-1">ID Kredensial</label>
                        <input
                          type="text"
                          value={editForm.credentialId || ''}
                          onChange={(e) => setEditForm({ ...editForm, credentialId: e.target.value })}
                          className="w-full px-3 py-2 border border-border-light rounded text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-500 mb-1">URL Verifikasi Kredensial</label>
                      <input
                        type="text"
                        value={editForm.credentialUrl || ''}
                        onChange={(e) => setEditForm({ ...editForm, credentialUrl: e.target.value })}
                        className="w-full px-3 py-2 border border-border-light rounded text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                      />
                    </div>
                  </>
                )}

                {selectedFile === 'socials' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-500 mb-1">Nama Platform</label>
                        <input
                          type="text"
                          value={editForm.platform || ''}
                          onChange={(e) => setEditForm({ ...editForm, platform: e.target.value })}
                          className="w-full px-3 py-2 border border-border-light rounded text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                          placeholder="GitHub / LinkedIn / Email"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-500 mb-1">Teks Tautan (Label)</label>
                        <input
                          type="text"
                          value={editForm.label || ''}
                          onChange={(e) => setEditForm({ ...editForm, label: e.target.value })}
                          className="w-full px-3 py-2 border border-border-light rounded text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                          placeholder="Hubungkan di LinkedIn"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-500 mb-1">URL Link</label>
                        <input
                          type="text"
                          value={editForm.url || ''}
                          onChange={(e) => setEditForm({ ...editForm, url: e.target.value })}
                          className="w-full px-3 py-2 border border-border-light rounded text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-500 mb-1">Nama Ikon (Opsional)</label>
                        <input
                          type="text"
                          value={editForm.iconName || ''}
                          onChange={(e) => setEditForm({ ...editForm, iconName: e.target.value })}
                          className="w-full px-3 py-2 border border-border-light rounded text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Form Action row */}
              <div className="flex justify-end gap-3 pt-4 border-t border-border-light">
                <button
                  type="button"
                  onClick={() => {
                    setEditingIndex(null);
                    setEditForm(null);
                    setIsAddingNew(false);
                  }}
                  className="px-4 py-2 border border-border-light hover:bg-neutral-light text-neutral-600 text-sm font-semibold rounded"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSaveForm}
                  className="px-4 py-2 bg-brand hover:bg-brand-hover text-white text-sm font-semibold rounded shadow-sm"
                >
                  Simpan Perubahan
                </button>
              </div>
            </div>
          ) : (
            /* ==================== LIST MODE ==================== */
            <div className="border border-border-light rounded-lg p-6 bg-card-custom space-y-4">
              <div className="flex justify-between items-center border-b border-border-light pb-3">
                <h3 className="font-bold text-neutral-dark font-heading text-lg">
                  Daftar Data ({dataList.length} item)
                </h3>
                <button
                  onClick={startAdd}
                  className="px-3 py-1.5 bg-brand hover:bg-brand-hover text-white text-xs font-semibold rounded shadow-sm"
                >
                  + Tambah Baris Baru
                </button>
              </div>

              {dataList.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-neutral-400">Tidak ada data terunggah.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                  {dataList.map((item, i) => (
                    <div
                      key={item.id || item.platform || i}
                      className="flex items-center justify-between p-4 border border-border-light rounded-lg hover:border-brand/40 bg-neutral-light/20 transition-all"
                    >
                      <div className="text-left">
                        <p className="text-sm font-bold text-neutral-dark">
                          {item.title || item.role || item.category || item.institution || item.platform || 'Item Tanpa Nama'}
                        </p>
                        <p className="text-xs text-neutral-400 mt-1">
                          {item.subtitle || item.company || item.degree || item.issuer || item.url || ''}
                        </p>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(i)}
                          className="px-2.5 py-1.5 text-xs font-semibold bg-card-custom border border-border-light text-neutral-600 hover:text-brand hover:bg-neutral-light rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteItem(i)}
                          className="px-2.5 py-1.5 text-xs font-semibold bg-card-custom border border-border-light text-red-500 hover:bg-red-50 rounded"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Status Alert Box */}
              {status && (
                <div
                  className={`p-3 rounded text-xs font-sans mt-4 ${
                    statusType === 'success'
                      ? 'bg-green-50 border border-green-200 text-green-700'
                      : statusType === 'error'
                        ? 'bg-red-50 border border-red-200 text-red-700'
                        : 'bg-neutral-light border border-border-light text-neutral-600'
                  }`}
                >
                  {status}
                </div>
              )}

              {/* Actions Row */}
              <div className="flex justify-end gap-3 pt-4 border-t border-border-light">
                <button
                  onClick={fetchCurrentContent}
                  className="px-4 py-2 border border-border-light hover:bg-neutral-light text-neutral-600 text-sm font-semibold rounded transition-colors"
                >
                  Reset / Sinkron Ulang
                </button>
                <button
                  onClick={handlePushToGitHub}
                  className="px-4 py-2 bg-brand hover:bg-brand-hover text-white text-sm font-semibold rounded shadow-sm transition-colors"
                >
                  Simpan & Push ke GitHub
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
