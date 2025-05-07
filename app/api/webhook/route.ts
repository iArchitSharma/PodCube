import { NextResponse } from 'next/server'
import { db } from '@/firebase/admin';

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Check if it's an end-of-call-report event
    if (body.message?.type === 'end-of-call-report') {
      
      const recordingUrl = body.message.recordingUrl
      console.log('Recording URL:', recordingUrl)
      const podcastLink = {
        recordingUrl: recordingUrl,
        createdAt: new Date().toISOString()
      }
      await db.collection("podcastLinks").add(podcastLink);
      console.log('Recording URL right:', body.message.artifact.recordingUrl)
      
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook Error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
