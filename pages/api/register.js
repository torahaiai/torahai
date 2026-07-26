import bcrypt from 'bcryptjs';
import pool from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, password, fullName } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'נא למלא אימייל וסיסמה' });

  const existing = await pool.query('select id from users where email = $1', [email]);
  if (existing.rows.length > 0) {
    return res.status(400).json({ error: 'כבר קיים משתמש עם האימייל הזה' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await pool.query(
    'insert into users (email, password_hash, full_name) values ($1, $2, $3)',
    [email, passwordHash, fullName || null]
  );

  res.status(200).json({ success: true });
}
