import { NextResponse } from 'next/server';
import { loginUser } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const { user, token } = await loginUser(email, password);
    const response = NextResponse.json({ user, token });
    response.cookies.set('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Login failed' }, { status: 401 });
  }
}