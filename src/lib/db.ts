﻿import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

export default {
  query: (text: string, params?: any[]) => pool.query(text, params),
};