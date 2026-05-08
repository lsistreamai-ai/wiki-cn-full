import { NextRequest, NextResponse } from 'next/server';
import { getAllWikiContent, addUpload } from '@/lib/data';

export async function GET() {
  try {
    const data = await getAllWikiContent();
    
    return NextResponse.json({
      success: true,
      ...data,
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load wiki data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Simple auth check
    const authHeader = request.headers.get('authorization');
    const password = process.env.ADMIN_PASSWORD || 'aplus2026';
    
    if (authHeader !== `Bearer ${password}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    
    // Validate required fields
    if (!body.subject_code || !body.paper_title || !body.year || !body.paper_type || !body.content) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const success = await addUpload({
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
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
