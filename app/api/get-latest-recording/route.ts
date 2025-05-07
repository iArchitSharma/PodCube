import { db } from '@/firebase/admin';
import { NextResponse } from 'next/server';
import admin from 'firebase-admin'; 

export async function GET() {
  try {
    const twoMinutesAgo = admin.firestore.Timestamp.fromDate(new Date(Date.now() - 2 * 60 * 1000));

    const snapshot = await db
      .collection("podcastLinks")
      .orderBy("createdAt", "desc")
      .limit(1)
      .get();

    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      const createdAt = doc.get('createdAt');

      if (createdAt && createdAt.toMillis() > twoMinutesAgo.toMillis()) {
        return NextResponse.json({
          recording: { id: doc.id, ...doc.data() }
        }, { status: 200 });
      }
    }


    return waitForNewRecording();

  } catch (error) {
    console.error('Error fetching latest recording:', error);
    return NextResponse.json({ error: 'Failed to fetch recording' }, { status: 500 });
  }
}

async function waitForNewRecording() {
  return new Promise<NextResponse>((resolve) => {
    const now = admin.firestore.Timestamp.now();

    const timeout = setTimeout(() => {
      unsubscribe();
      resolve(NextResponse.json({ recording: null }, { status: 200 }));
    }, 30000); 

    const unsubscribe = db
      .collection("podcastLinks")
      .where("createdAt", ">", now)
      .limit(1)
      .onSnapshot((snapshot) => {
        if (!snapshot.empty) {
          const doc = snapshot.docs[0];
          clearTimeout(timeout);
          unsubscribe();
          resolve(NextResponse.json({
            recording: { id: doc.id, ...doc.data() }
          }, { status: 200 }));
        }
      });
  });
}
