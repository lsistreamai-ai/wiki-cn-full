export interface Subject {
  id: string;
  code: string;
  name_en: string;
  name_zh: string | null;
  created_at: string;
  updated_at: string;
  papers?: Paper[];
}

export interface Paper {
  id: string;
  subject_id: string;
  title: string;
  year: number | null;
  paper_type: string | null;
  description: string | null;
  file_url: string | null;
  created_at: string;
  updated_at: string;
  sections?: Section[];
  subjects?: Subject;
}

export interface Section {
  id: string;
  paper_id: string;
  title: string;
  content: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface UploadItem {
  subject_code: string;
  paper_title: string;
  year: number;
  paper_type: string;
  description?: string;
  file_url?: string;
  content: string;
}

// Database types for Supabase
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      subjects: {
        Row: Subject;
        Insert: Omit<Subject, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Subject>;
      };
      papers: {
        Row: Paper;
        Insert: Omit<Paper, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Paper>;
      };
      sections: {
        Row: Section;
        Insert: Omit<Section, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Section>;
      };
    };
  };
}
