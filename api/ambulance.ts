// api/ambulance.ts — Ambulance request API
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
  res.setHeader('Access-Control-Allow-Methods', 'POST, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    // ── POST /api/ambulance ─────────────────────────────────────────
    if (req.method === 'POST') {
      const {
        patientName, patientPhone,
        pickupLocation, destination, hospitalId,
      } = req.body ?? {};

      if (!patientName || !patientPhone || !pickupLocation || !destination) {
        return err(res, 'Missing required fields: patientName, patientPhone, pickupLocation, destination');
      }

      const id = uuidv4();
      const inserted = await sql`
        INSERT INTO ambulance_requests
          (id, patient_name, patient_phone, pickup_location, destination, hospital_id, status)
        VALUES
          (${id}, ${patientName}, ${patientPhone}, ${pickupLocation}, ${destination}, ${hospitalId ?? null}, 'requested')
        RETURNING *`;

      return ok(res, inserted[0], 201);
    }

    // ── PATCH /api/ambulance?id=... ─────────────────────────────────
    if (req.method === 'PATCH') {
      const { id } = req.query as Record<string, string>;
      const { status } = req.body ?? {};

      if (!id) return err(res, 'Missing id query param');

      const allowed = ['requested', 'en route', 'arrived', 'completed', 'cancelled'];
      if (!allowed.includes(status)) return err(res, 'Invalid status');

      const updated = await sql`
        UPDATE ambulance_requests
        SET status = ${status}, updated_at = NOW()
        WHERE id = ${id}
        RETURNING *`;

      if (!updated.length) return err(res, 'Request not found', 404);
      return ok(res, updated[0]);
    }

    return err(res, 'Method not allowed', 405);
  } catch (e: unknown) {
    console.error('[ambulance]', e);
    return err(res, 'Internal server error', 500);
  }
}
