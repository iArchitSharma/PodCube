
import { auth } from 'firebase-admin'
import { cookies } from 'next/headers'

export async function getCurrentUser() {
  const session = (await cookies()).get('session')?.value
  if (!session) return null

  const decodedClaims = await auth().verifySessionCookie(session)
  return decodedClaims
}