import { Subject, UploadItem } from './types';

// Check if Supabase is configured
const useSupabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Dynamic import for Supabase functions
async function getSupabaseData() {
  const { getAllWikiContent: supabaseGetAll, getWikiStats: supabaseGetStats, addPaperContent: supabaseAdd } = 
    await import('./data-supabase');
  return {
    getAllWikiContent: supabaseGetAll,
    getWikiStats: supabaseGetStats,
    addPaperContent: supabaseAdd,
  };
}

// JSON fallback for development
const DATA_URL = 'https://wiki-cn-full.vercel.app/data/wiki.json';

async function fetchLocalData() {
  try {
    if (typeof window !== 'undefined') {
      // Client-side: fetch from deployed URL
      const res = await fetch('/data/wiki.json');
      if (!res.ok) throw new Error('Failed to fetch');
      return await res.json();
    } else {
      // Server-side: read from file
      const fs = await import('fs');
      const path = await import('path');
      const dataPath = path.join(process.cwd(), 'data', 'wiki.json');
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      return data;
    }
  } catch (e) {
    console.error('Failed to load local data:', e);
    return { subjects: [] };
  }
}

// Export functions that use either Supabase or JSON fallback
export async function getAllSubjects(): Promise<Subject[]> {
  if (useSupabase) {
    const supabase = await getSupabaseData();
    return supabase.getAllWikiContent();
  }
  
  const data = await fetchLocalData();
  return data.subjects || [];
}

export async function getSubjectByCode(code: string): Promise<Subject | null> {
  const subjects = await getAllSubjects();
  return subjects.find(s => s.code.toUpperCase() === code.toUpperCase()) || null;
}

export async function getAllWikiContent() {
  if (useSupabase) {
    const supabase = await getSupabaseData();
    return supabase.getAllWikiContent();
  }
  
  const data = await fetchLocalData();
  const stats = await getWikiStats();
  
  return {
    ...stats,
    subjects: data.subjects || [],
  };
}

export async function getWikiStats() {
  if (useSupabase) {
    const supabase = await getSupabaseData();
    return supabase.getWikiStats();
  }
  
  const data = await fetchLocalData();
  const subjects = data.subjects || [];
  
  return {
    total_subjects: subjects.length,
    total_papers: subjects.reduce((sum: number, s: Subject) => sum + (s.papers?.length || 0), 0),
  };
}

export async function addUpload(item: UploadItem): Promise<boolean> {
  if (useSupabase) {
    const supabase = await getSupabaseData();
    const result = await supabase.addPaperContent(item);
    return result.success;
  }
  
  // JSON fallback: Can't persist changes, return false
  console.warn('Upload not persisted - no Supabase configured');
  return false;
}
