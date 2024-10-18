import { NextResponse } from 'next/server';
import { registerUser } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json();
    const user = await registerUser(username, email, password);
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Registration failed' }, { status: 400 });
  }
}