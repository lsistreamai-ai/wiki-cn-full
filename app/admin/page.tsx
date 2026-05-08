'use client';

import { useState } from 'react';
import { Upload, FileText, Book, Check, AlertCircle, LogOut } from 'lucide-react';

const SUBJECTS = [
  { code: 'CHIN', name: 'Chinese Language 中國語文' },
  { code: 'ENG', name: 'English Language 英國語文' },
  { code: 'MATH', name: 'Mathematics 數學' },
  { code: 'CSD', name: 'Citizenship and Social Development 公民與社會發展' },
  { code: 'PHY', name: 'Physics 物理' },
  { code: 'CHEM', name: 'Chemistry 化學' },
  { code: 'BIO', name: 'Biology 生物' },
  { code: 'ICT', name: 'Information and Communication Technology 資訊及通訊科技' },
  { code: 'ECON', name: 'Economics 經濟' },
  { code: 'GEOG', name: 'Geography 地理' },
  { code: 'HIST', name: 'History 歷史' },
  { code: 'BAF', name: 'Business, Accounting and Financial Studies 企業、會計與財務概論' },
];

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  
  const [formData, setFormData] = useState({
    subject_code: 'CHIN',
    paper_title: '',
    year: 2025,
    paper_type: '',
    description: '',
    file_url: '',
    content: '',
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple demo auth - replace with real auth later
    if (loginForm.username === 'admin' && loginForm.password === 'aplus2026') {
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Invalid credentials');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitMessage(null);

    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setSubmitMessage({ type: 'success', text: 'Content uploaded successfully!' });
        setFormData({
          subject_code: 'CHIN',
          paper_title: '',
          year: 2025,
          paper_type: '',
          description: '',
          file_url: '',
          content: '',
        });
      } else {
        setSubmitMessage({ type: 'error', text: data.error || 'Upload failed' });
      }
    } catch {
      setSubmitMessage({ type: 'error', text: 'Network error. Please try again.' });
    }

    setSubmitting(false);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8">
            <div className="text-center mb-6">
              <Book className="w-12 h-12 text-primary mx-auto mb-4" />
              <h1 className="text-xl font-bold text-white">Admin Login</h1>
              <p className="text-sm text-slate-400 mt-1">APlus Wiki Management</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-primary"
                  placeholder="Enter username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-primary"
                  placeholder="Enter password"
                />
              </div>

              {loginError && (
                <p className="text-red-400 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {loginError}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-2 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition"
              >
                Login
              </button>
            </form>

            <p className="mt-4 text-xs text-slate-500 text-center">
              Demo credentials: admin / aplus2026
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-slate-900/80 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Book className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-white">Wiki Admin</h1>
                <p className="text-xs text-slate-400">Upload Study Materials</p>
              </div>
            </div>
            <button
              onClick={() => setIsLoggedIn(false)}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <Upload className="w-6 h-6 text-primary" />
            <h2 className="text-lg font-semibold text-white">Upload New Material</h2>
          </div>

          {submitMessage && (
            <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
              submitMessage.type === 'success' 
                ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                : 'bg-red-500/10 border border-red-500/30 text-red-400'
            }`}>
              {submitMessage.type === 'success' ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              {submitMessage.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Subject 科目 *
              </label>
              <select
                value={formData.subject_code}
                onChange={(e) => setFormData({ ...formData, subject_code: e.target.value })}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-primary"
              >
                {SUBJECTS.map((s) => (
                  <option key={s.code} value={s.code}>{s.name}</option>
                ))}
              </select>
            </div>

            {/* Paper Title & Year */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Paper Title 試卷標題 *
                </label>
                <input
                  type="text"
                  value={formData.paper_title}
                  onChange={(e) => setFormData({ ...formData, paper_title: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-primary"
                  placeholder="e.g., 2025 DSE Paper 1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Year 年份 *
                </label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-primary"
                  min="2012"
                  max="2030"
                  required
                />
              </div>
            </div>

            {/* Paper Type */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Paper Type 卷別 *
              </label>
              <input
                type="text"
                value={formData.paper_type}
                onChange={(e) => setFormData({ ...formData, paper_type: e.target.value })}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-primary"
                placeholder="e.g., Paper 1 Reading / 卷一 閱讀"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Description 描述
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-primary"
                placeholder="Brief description of the material"
              />
            </div>

            {/* File URL */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                File URL 檔案連結 (Optional)
              </label>
              <input
                type="url"
                value={formData.file_url}
                onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-primary"
                placeholder="https://example.com/paper.pdf"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Content 內容 *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={10}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-primary font-mono text-sm"
                placeholder="Paste paper content, notes, or analysis here..."
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-primary hover:bg-primary-dark disabled:bg-slate-600 text-white font-medium rounded-lg transition flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Upload Material
                </>
              )}
            </button>
          </form>
        </div>

        {/* Info Note */}
        <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <p className="text-sm text-blue-300">
            <strong>Note:</strong> Uploaded content will be immediately visible to students on the main wiki page.
            Students will review this system on May 16, 2026.
          </p>
        </div>
      </main>
    </div>
  );
}
