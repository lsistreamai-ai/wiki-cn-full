export interface WikiSubject {
  id: string;
  code: string;
  name_en: string;
  name_zh: string;
  papers: WikiPaper[];
}

export interface WikiPaper {
  id: string;
  title: string;
  year: number;
  paper_type: string;
  description?: string;
  file_url?: string;
  sections: WikiSection[];
}

export interface WikiSection {
  id: string;
  title: string;
  content: string;
  order: number;
}

export interface WikiContent {
  id: string;
  title: string;
  content: string;
  category: string;
  created_at: string;
  updated_at: string;
}

export interface UploadItem {
  subject_code: string;
  paper_title: string;
  year: number;
  paper_type: string;
  description: string;
  file_url?: string;
  content: string;
}
