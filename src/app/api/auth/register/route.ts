import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import db from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json();
    const hashedPassword = await hash(password, 10);

    const result = await db.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, email, hashedPassword]
    );

    const user = result.rows[0];
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 400 });
  }
}