import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type');
  const query = searchParams.get('query');
  const orientation = searchParams.get('orientation') || 'landscape';

  const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

  if (!PEXELS_API_KEY) {
      return NextResponse.json({ error: 'Missing Pexels API Key' }, { status: 500 });
  }

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  try {
    if (type === 'video') {
      const response = await fetch(`https://api.pexels.com/videos/search?query=${query}&orientation=${orientation}&per_page=1`, {
        headers: {
          Authorization: PEXELS_API_KEY
        }
      });
      const data = await response.json();
      const url = data.videos?.[0]?.video_files?.find((file: any) => file.quality === 'hd')?.link || null;
      return NextResponse.json({ url });
    } else if (type === 'image') {
      const response = await fetch(`https://api.pexels.com/v1/search?query=${query}&orientation=${orientation}&per_page=1`, {
        headers: {
          Authorization: PEXELS_API_KEY
        }
      });
      const data = await response.json();
      const url = data.photos?.[0]?.src?.large2x || data.photos?.[0]?.src?.large || null;
      return NextResponse.json({ url });
    } else {
      return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
    }
  } catch (error) {
    console.error(`Error fetching Pexels ${type}:`, error);
    return NextResponse.json({ error: 'Failed to fetch from Pexels' }, { status: 500 });
  }
}
