import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

const db = {
  query: (text: string, params?: unknown[]) => pool.query(text, params),
};

// Exportiere das db-Objekt als Standard-Export
export default db;
