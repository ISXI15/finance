import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verify, JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get('token');

  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    // Verify the token
    const decoded = verify(token.value, JWT_SECRET) as JwtPayload;

    // If verification is successful, the user is authenticated
    return NextResponse.json({ message: 'Authenticated', user: { userId: decoded.userId } }, { status: 200 });
  } catch (error) {
    // If verification fails, return an error
    console.error('Token verification failed:', error);
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}