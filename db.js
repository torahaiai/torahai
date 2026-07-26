import { Pool } from 'pg';

// Railway נותן לך DATABASE_URL מוכן - פשוט מדביקים אותו ב-.env.local
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export default pool;
