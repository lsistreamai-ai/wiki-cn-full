import { supabase, createServerClient } from './supabase';
import { Subject, Paper, UploadItem } from './types';

// Get all subjects with paper counts
export async function getSubjects(): Promise<Subject[]> {
  const { data: subjects, error } = await supabase
    .from('subjects')
    .select(`
      *,
      papers(count)
    `)
    .order('code');

  if (error) {
    console.error('Error fetching subjects:', error);
    return [];
  }

  return subjects || [];
}

// Get a single subject by code with all papers
export async function getSubjectByCode(code: string): Promise<Subject | null> {
  const { data, error } = await supabase
    .from('subjects')
    .select(`
      *,
      papers(
        *,
        sections(*)
      )
    `)
    .ilike('code', code)
    .single();

  if (error) {
    console.error('Error fetching subject:', error);
    return null;
  }

  return data;
}

// Get all wiki content (for API)
export async function getAllWikiContent() {
  const { data: subjects, error } = await supabase
    .from('subjects')
    .select(`
      *,
      papers(
        *,
        sections(*)
      )
    `)
    .order('code');

  if (error) {
    console.error('Error fetching wiki content:', error);
    return [];
  }

  return subjects || [];
}

// Get wiki statistics
export async function getWikiStats() {
  const { count: subjectCount } = await supabase
    .from('subjects')
    .select('*', { count: 'exact', head: true });

  const { count: paperCount } = await supabase
    .from('papers')
    .select('*', { count: 'exact', head: true });

  return {
    total_subjects: subjectCount || 0,
    total_papers: paperCount || 0,
  };
}

// Add new paper with content (admin operation)
export async function addPaperContent(item: UploadItem): Promise<{ success: boolean; error?: string }> {
  try {
    const serverClient = createServerClient();

    // Get subject ID from code
    const { data: subject, error: subjectError } = await serverClient
      .from('subjects')
      .select('id')
      .ilike('code', item.subject_code)
      .single();

    if (subjectError || !subject) {
      return { success: false, error: 'Subject not found' };
    }

    // Create paper
    const { data: paper, error: paperError } = await serverClient
      .from('papers')
      .insert({
        subject_id: subject.id,
        title: item.paper_title,
        year: item.year,
        paper_type: item.paper_type,
        description: item.description || null,
        file_url: item.file_url || null,
      })
      .select()
      .single();

    if (paperError || !paper) {
      return { success: false, error: 'Failed to create paper' };
    }

    // Create section
    const { error: sectionError } = await serverClient
      .from('sections')
      .insert({
        paper_id: paper.id,
        title: item.paper_title,
        content: item.content,
        sort_order: 1,
      });

    if (sectionError) {
      return { success: false, error: 'Failed to create section' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error adding paper:', error);
    return { success: false, error: 'Internal server error' };
  }
}

// Update paper
export async function updatePaper(paperId: string, updates: Partial<Paper>): Promise<boolean> {
  const serverClient = createServerClient();
  
  const { error } = await serverClient
    .from('papers')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', paperId);

  return !error;
}

// Delete paper
export async function deletePaper(paperId: string): Promise<boolean> {
  const serverClient = createServerClient();
  
  const { error } = await serverClient
    .from('papers')
    .delete()
    .eq('id', paperId);

  return !error;
}
