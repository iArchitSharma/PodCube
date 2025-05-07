import { NextResponse } from 'next/server';
import { db } from '@/firebase/admin';
import admin from 'firebase-admin'; 

export async function POST(request: Request) {
  try {
    const body = await request.json();

    
    if (body.message?.type === 'end-of-call-report') {
      const recordingUrl = body.message.recordingUrl || body.message.artifact?.recordingUrl;

      if (!recordingUrl) {
        console.warn('No recording URL found in webhook payload');
        return NextResponse.json({ success: false, message: 'No recording URL' }, { status: 400 });
      }

      const podcastLink = {
        recordingUrl,
        createdAt: admin.firestore.FieldValue.serverTimestamp(), 
      };

      await db.collection('podcastLinks').add(podcastLink);

      console.log('✅ Stored recording URL:', recordingUrl);

      return NextResponse.json({ success: true });
    }

    
    return NextResponse.json({ success: false, message: 'Ignored event' }, { status: 200 });

  } catch (error) {
    console.error('❌ Webhook Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
