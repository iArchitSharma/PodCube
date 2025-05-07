
import { db } from '@/firebase/admin';
import { serverTimestamp } from 'firebase-admin/firestore';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const snapshot = await db
      .collection("podcastLinks")
      .orderBy("createdAt", "desc")
      .limit(1)
      .get();

    if (snapshot.empty) {
      return NextResponse.json({ recording: null }, { status: 200 });
    }

    const doc = snapshot.docs[0];
    return NextResponse.json({ recording: { id: doc.id, ...doc.data() } }, { status: 200 });
  } catch (error) {
    console.error('Error fetching latest recording:', error);
    return NextResponse.json({ error: 'Failed to fetch recording' }, { status: 500 });
  }
}
