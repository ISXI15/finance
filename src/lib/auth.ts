import { compare, hash } from 'bcryptjs';
import { sign, verify, JwtPayload, Secret } from 'jsonwebtoken';
import pool from './db';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

export async function registerUser(username: string, email: string, password: string) {
  const hashedPassword = await hash(password, 10);
  try {
    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, email, hashedPassword]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error registering user:', error);
    throw new Error('Failed to register user');
  }
}

export async function loginUser(email: string, password: string) {
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user) {
      throw new Error('User not found');
    }
    const isValid = await compare(password, user.password);
    if (!isValid) {
      throw new Error('Invalid password');
    }
    const token = sign({ id: user.id }, JWT_SECRET as Secret, { expiresIn: '1h' });
    return { user: { id: user.id, username: user.username, email: user.email }, token };
  } catch (error) {
    console.error('Error logging in user:', error);
    throw new Error('Login failed');
  }
}

// Verwende einen Typ statt eines Interfaces
type CustomJwtPayload = JwtPayload & { id: number };

export function verifyToken(token: string): CustomJwtPayload {
  try {
    const decoded = verify(token, JWT_SECRET as Secret) as CustomJwtPayload;
    if (typeof decoded === 'string' || !decoded.id) {
      throw new Error('Invalid token payload');
    }
    return decoded;
  } catch (error) {
    console.error('Error verifying token:', error);
    throw new Error('Invalid token');
  }
}
