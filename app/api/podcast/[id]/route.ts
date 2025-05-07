import { db } from '@/firebase/admin';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const docRef = db.collection('podcasts').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return new Response(JSON.stringify({ success: false, error: 'Podcast not found' }), {
        status: 404,
      });
    }

    const data = doc.data();

    return new Response(JSON.stringify({ success: true, podcastScript: data?.podcastScript || null }), {
      status: 200,
    });
  } catch (error: any) {
    console.error('Error fetching podcast:', error);
    return new Response(JSON.stringify({ success: false, error: error.message || 'Server Error' }), {
      status: 500,
    });
  }
}
