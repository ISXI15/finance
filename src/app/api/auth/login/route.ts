import { NextResponse } from 'next/server';
import { loginUser } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const { user, token } = await loginUser(email, password);
    const response = NextResponse.json({ user, token });
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600 // 1 hour
    });
    return response;
  } catch (error: unknown) {
    console.error('Login failed:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { error: 'Login failed. Please check your credentials and try again.' },
      { status: 401 }
    );
  }
}