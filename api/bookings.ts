// api/bookings.ts — Vercel Serverless Function
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from './db';
import { v4 as uuidv4 } from 'uuid';

function ok(res: VercelResponse, data: unknown, status = 200) {
  return res.status(status).json({ success: true, data });
}
function err(res: VercelResponse, message: string, status = 400) {
  return res.status(status).json({ success: false, error: message });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    // ── GET /api/bookings ──────────────────────────────────────────────
    if (req.method === 'GET') {
      const { hospitalId, patientPhone, date } = req.query as Record<string, string>;

      if (!hospitalId && !patientPhone) {
        return err(res, 'Provide hospitalId or patientPhone query param');
      }

      let rows;
      if (hospitalId && date) {
        rows = await sql`
          SELECT * FROM bookings
          WHERE hospital_id = ${hospitalId} AND preferred_date = ${date}
          ORDER BY token_number ASC`;
      } else if (hospitalId) {
        rows = await sql`
          SELECT * FROM bookings
          WHERE hospital_id = ${hospitalId}
          ORDER BY created_at DESC LIMIT 100`;
      } else {
        rows = await sql`
          SELECT * FROM bookings
          WHERE patient_phone = ${patientPhone}
          ORDER BY created_at DESC LIMIT 50`;
      }

      return ok(res, rows);
    }

    // ── POST /api/bookings ─────────────────────────────────────────────
    if (req.method === 'POST') {
      const {
        patientName, patientPhone, patientEmail,
        hospitalId, hospitalName, department,
        preferredDate, preferredTime, reason,
        patientId,
      } = req.body ?? {};

      if (!patientName || !patientPhone || !hospitalId || !hospitalName || !department || !preferredDate || !preferredTime) {
        return err(res, 'Missing required fields');
      }

      // Generate sequential token for this hospital+dept+date
      const countRows = await sql`
        SELECT COALESCE(MAX(token_number), 0) AS max_token
        FROM bookings
        WHERE hospital_id = ${hospitalId}
          AND department  = ${department}
          AND preferred_date = ${preferredDate}`;

      const tokenNumber = (Number((countRows[0] as any).max_token) || 0) + 1;
      const id = uuidv4();

      const inserted = await sql`
        INSERT INTO bookings
          (id, patient_id, patient_name, patient_phone, patient_email,
           hospital_id, hospital_name, department,
           token_number, preferred_date, preferred_time, reason, status)
        VALUES
          (${id}, ${patientId ?? null}, ${patientName}, ${patientPhone}, ${patientEmail ?? null},
           ${hospitalId}, ${hospitalName}, ${department},
           ${tokenNumber}, ${preferredDate}, ${preferredTime}, ${reason ?? null}, 'pending')
        RETURNING *`;

      return ok(res, inserted[0], 201);
    }

    // ── PATCH /api/bookings ────────────────────────────────────────────
    if (req.method === 'PATCH') {
      const { id } = req.query as Record<string, string>;
      const { status, notes } = req.body ?? {};

      if (!id) return err(res, 'Missing booking id');
      const allowed = ['pending', 'accepted', 'rejected', 'cancelled', 'completed'];
      if (!allowed.includes(status)) return err(res, 'Invalid status');

      const updated = await sql`
        UPDATE bookings
        SET status = ${status}, notes = ${notes ?? null}, updated_at = NOW()
        WHERE id = ${id}
        RETURNING *`;

      if (!updated.length) return err(res, 'Booking not found', 404);
      return ok(res, updated[0]);
    }

    return err(res, 'Method not allowed', 405);
  } catch (e: unknown) {
    console.error('[bookings]', e);
    return err(res, 'Internal server error', 500);
  }
}
