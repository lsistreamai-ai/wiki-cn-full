'use client';

import { useState, useEffect } from 'react';
import { Book, FileText, ChevronDown, Search, GraduationCap } from 'lucide-react';

interface Subject {
  id: string;
  code: string;
  name_en: string;
  name_zh: string;
  papers: Paper[];
}

interface Paper {
  id: string;
  title: string;
  year: number;
  paper_type: string;
  description?: string;
  sections: Section[];
}

interface Section {
  id: string;
  title: string;
  content: string;
  order: number;
}

export default function WikiViewer() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/content')
      .then(res => res.json())
      .then(data => {
        setSubjects(data.subjects || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredSubjects = subjects.filter(s => 
    s.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.name_zh.includes(searchQuery) ||
    s.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-400">Loading Wiki...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-slate-900/80 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GraduationCap className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-white">APlus Wiki</h1>
                <p className="text-xs text-slate-400">DSE Study Materials • DSE學習資源</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a href="/admin" className="text-sm text-slate-400 hover:text-white transition">
                Admin 登入
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search subjects... 搜尋科目..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <div className="text-2xl font-bold text-primary">{subjects.length}</div>
            <div className="text-sm text-slate-400">Subjects 科目</div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <div className="text-2xl font-bold text-accent">
              {subjects.reduce((sum, s) => sum + s.papers.length, 0)}
            </div>
            <div className="text-sm text-slate-400">Papers 試卷</div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-400">12</div>
            <div className="text-sm text-slate-400">DSE Core 核心科目</div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-400">2026</div>
            <div className="text-sm text-slate-400">Exam Year 考試年份</div>
          </div>
        </div>

        {/* Subject Grid */}
        {!selectedPaper && !selectedSubject && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSubjects.map((subject) => (
              <button
                key={subject.id}
                onClick={() => setSelectedSubject(subject)}
                className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 text-left hover:border-primary transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Book className="w-6 h-6 text-primary" />
                  </div>
                  <span className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-300">
                    {subject.code}
                  </span>
                </div>
                <h3 className="font-semibold text-white mb-1">{subject.name_en}</h3>
                <p className="text-sm text-slate-400 mb-3">{subject.name_zh}</p>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <FileText className="w-4 h-4" />
                  {subject.papers.length} papers
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Subject Detail */}
        {selectedSubject && !selectedPaper && (
          <div>
            <button
              onClick={() => setSelectedSubject(null)}
              className="mb-6 text-slate-400 hover:text-white flex items-center gap-2"
            >
              <ChevronDown className="w-4 h-4 rotate-90" />
              Back to subjects
            </button>
            
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-1">{selectedSubject.name_en}</h2>
              <p className="text-slate-400">{selectedSubject.name_zh}</p>
            </div>

            {selectedSubject.papers.length === 0 ? (
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 text-center">
                <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">No papers uploaded yet for this subject.</p>
                <p className="text-sm text-slate-500 mt-2">此科目尚未上傳試卷。</p>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedSubject.papers.map((paper) => (
                  <button
                    key={paper.id}
                    onClick={() => setSelectedPaper(paper)}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-4 text-left hover:border-primary transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-white mb-1">{paper.title}</h3>
                        <p className="text-sm text-slate-400">{paper.paper_type} • {paper.year}</p>
                        {paper.description && (
                          <p className="text-sm text-slate-500 mt-2">{paper.description}</p>
                        )}
                      </div>
                      <ChevronDown className="w-5 h-5 text-slate-400 -rotate-90" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Paper Content */}
        {selectedPaper && (
          <div>
            <button
              onClick={() => setSelectedPaper(null)}
              className="mb-6 text-slate-400 hover:text-white flex items-center gap-2"
            >
              <ChevronDown className="w-4 h-4 rotate-90" />
              Back to {selectedSubject?.name_en}
            </button>

            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-2">{selectedPaper.title}</h2>
              <p className="text-slate-400 mb-6">
                {selectedPaper.paper_type} • Year {selectedPaper.year}
              </p>

              {selectedPaper.sections.map((section) => (
                <div key={section.id} className="mb-6 last:mb-0">
                  <h3 className="font-semibold text-white mb-3">{section.title}</h3>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-slate-300 whitespace-pre-wrap">{section.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-slate-400 text-sm">
          <p>APlus Education • DSE Excellence</p>
          <p className="mt-1">Language Services International (PET) Ltd.</p>
          <p className="mt-2 text-xs">學生測試版 Student Beta • May 16, 2026</p>
        </div>
      </footer>
    </div>
  );
}
