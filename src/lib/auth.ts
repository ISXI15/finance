import { compare, hash } from 'bcryptjs';
import { sign, verify, JwtPayload } from 'jsonwebtoken';
import pool from './db';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function registerUser(username: string, email: string, password: string) {
  const hashedPassword = await hash(password, 10);
  const result = await pool.query(
    'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
    [username, email, hashedPassword]
  );
  return result.rows[0];
}

export async function loginUser(email: string, password: string) {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  const user = result.rows[0];
  if (!user) {
    throw new Error('User not found');
  }
  const isValid = await compare(password, user.password);
  if (!isValid) {
    throw new Error('Invalid password');
  }
  const token = sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
  return { user: { id: user.id, username: user.username, email: user.email }, token };
}

export function verifyToken(token: string): JwtPayload & { id: number } {
  return verify(token, JWT_SECRET) as JwtPayload & { id: number };
}