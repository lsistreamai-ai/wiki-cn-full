import { NextRequest, NextResponse } from 'next/server';
import { getAllSubjects, addUpload, getWikiStats } from '@/lib/data';

export async function GET() {
  try {
    const subjects = getAllSubjects();
    const stats = getWikiStats();
    
    return NextResponse.json({
      success: true,
      ...stats,
      subjects,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to load wiki data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.subject_code || !body.paper_title || !body.year || !body.paper_type || !body.content) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const success = addUpload({
      subject_code: body.subject_code,
      paper_title: body.paper_title,
      year: parseInt(body.year),
      paper_type: body.paper_type,
      description: body.description || '',
      file_url: body.file_url || '',
      content: body.content,
    });

    if (success) {
      return NextResponse.json({ success: true, message: 'Content uploaded successfully' });
    } else {
      return NextResponse.json(
        { success: false, error: 'Failed to save content' },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
