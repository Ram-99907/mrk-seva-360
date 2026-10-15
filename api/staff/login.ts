// api/staff/login.ts — Staff/admin login via bcrypt
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from '../db';
import bcrypt from 'bcryptjs';

function ok(res: VercelResponse, data: unknown) {
  return res.status(200).json({ success: true, data });
}
function err(res: VercelResponse, message: string, status = 400) {
  return res.status(status).json({ success: false, error: message });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method !== 'POST') return err(res, 'Method not allowed', 405);

  try {
    const { username, password } = req.body ?? {};

    if (!username || !password) {
      return err(res, 'username and password are required');
    }

    const rows = await sql`
      SELECT id, hospital_id, username, password_hash, role, is_active
      FROM staff_users
      WHERE username = ${username}
      LIMIT 1`;

    if (!rows.length) {
      return err(res, 'Invalid credentials', 401);
    }

    const user = rows[0] as {
      id: string; hospital_id: string; username: string;
      password_hash: string; role: string; is_active: boolean;
    };

    if (!user.is_active) {
      return err(res, 'Account is inactive', 403);
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return err(res, 'Invalid credentials', 401);
    }

    // Never return the password hash
    return ok(res, {
      id: user.id,
      hospitalId: user.hospital_id,
      username: user.username,
      role: user.role,
    });
  } catch (e: unknown) {
    console.error('[staff/login]', e);
    return err(res, 'Internal server error', 500);
  }
}
