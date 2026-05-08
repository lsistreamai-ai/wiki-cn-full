import fs from 'fs';
import path from 'path';
import { WikiSubject, UploadItem } from './types';

const DATA_PATH = path.join(process.cwd(), 'data', 'wiki.json');

// DSE Core Subjects
const DSE_SUBJECTS = [
  { code: 'CHIN', name_en: 'Chinese Language', name_zh: '中國語文' },
  { code: 'ENG', name_en: 'English Language', name_zh: '英國語文' },
  { code: 'MATH', name_en: 'Mathematics', name_zh: '數學' },
  { code: 'CSD', name_en: 'Citizenship and Social Development', name_zh: '公民與社會發展' },
];

// DSE Elective Subjects
const DSE_ELECTIVES = [
  { code: 'PHY', name_en: 'Physics', name_zh: '物理' },
  { code: 'CHEM', name_en: 'Chemistry', name_zh: '化學' },
  { code: 'BIO', name_en: 'Biology', name_zh: '生物' },
  { code: 'ICT', name_en: 'Information and Communication Technology', name_zh: '資訊及通訊科技' },
  { code: 'ECON', name_en: 'Economics', name_zh: '經濟' },
  { code: 'GEOG', name_en: 'Geography', name_zh: '地理' },
  { code: 'HIST', name_en: 'History', name_zh: '歷史' },
  { code: 'BAF', name_en: 'Business, Accounting and Financial Studies', name_zh: '企業、會計與財務概論' },
];

export function getAllSubjects(): WikiSubject[] {
  try {
    if (fs.existsSync(DATA_PATH)) {
      const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
      return data.subjects || [];
    }
  } catch (e) {
    console.error('Failed to load wiki data:', e);
  }
  
  // Return default structure
  return [...DSE_SUBJECTS, ...DSE_ELECTIVES].map(s => ({
    id: s.code.toLowerCase(),
    code: s.code,
    name_en: s.name_en,
    name_zh: s.name_zh,
    papers: []
  }));
}

export function getSubjectByCode(code: string): WikiSubject | null {
  const subjects = getAllSubjects();
  return subjects.find(s => s.code.toUpperCase() === code.toUpperCase()) || null;
}

export function addUpload(item: UploadItem): boolean {
  try {
    const subjects = getAllSubjects();
    const subjectIndex = subjects.findIndex(s => s.code.toUpperCase() === item.subject_code.toUpperCase());
    
    if (subjectIndex === -1) {
      // Create new subject if doesn't exist
      subjects.push({
        id: item.subject_code.toLowerCase(),
        code: item.subject_code.toUpperCase(),
        name_en: item.subject_code.toUpperCase(),
        name_zh: '',
        papers: []
      });
    }
    
    const subject = subjects[subjectIndex >= 0 ? subjectIndex : subjects.length - 1];
    
    const paper = {
      id: `${item.subject_code}-${Date.now()}`,
      title: item.paper_title,
      year: item.year,
      paper_type: item.paper_type,
      description: item.description,
      file_url: item.file_url,
      sections: [{
        id: `section-${Date.now()}`,
        title: item.paper_title,
        content: item.content,
        order: 1
      }]
    };
    
    subject.papers.push(paper);
    
    // Ensure data directory exists
    const dataDir = path.dirname(DATA_PATH);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    fs.writeFileSync(DATA_PATH, JSON.stringify({ subjects }, null, 2));
    return true;
  } catch (e) {
    console.error('Failed to add upload:', e);
    return false;
  }
}

export function getWikiStats() {
  const subjects = getAllSubjects();
  const totalPapers = subjects.reduce((sum, s) => sum + s.papers.length, 0);
  
  return {
    total_subjects: subjects.length,
    total_papers: totalPapers,
    subjects: subjects.map(s => ({
      code: s.code,
      name_en: s.name_en,
      name_zh: s.name_zh,
      paper_count: s.papers.length
    }))
  };
}
