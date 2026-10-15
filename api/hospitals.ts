// api/hospitals.ts — Hospital listing API
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from './db';

function ok(res: VercelResponse, data: unknown) {
  return res.status(200).json({ success: true, data });
}
function err(res: VercelResponse, message: string, status = 400) {
  return res.status(status).json({ success: false, error: message });
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method !== 'GET') return err(res, 'Method not allowed', 405);

  try {
    const { state, district, type, scheme, lat, lng } = req.query as Record<string, string>;

    // Build dynamic WHERE conditions
    const conditions: string[] = [];
    const params: (string | undefined)[] = [];

    if (state)    { conditions.push(`state = $${params.length + 1}`);    params.push(state); }
    if (district) { conditions.push(`district = $${params.length + 1}`); params.push(district); }
    if (type)     { conditions.push(`hospital_type = $${params.length + 1}`); params.push(type); }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const rows = (await sql`
      SELECT
        id, name, address, state, district, hospital_type, lat, lng,
        departments, schemes, contact_phone, last_updated
      FROM hospitals
      ${sql.unsafe(whereClause)}
      ORDER BY name ASC
      LIMIT 200`) as Array<Record<string, unknown>>;

    // Calculate distances if coordinates provided
    const userLat = parseFloat(lat ?? '');
    const userLng = parseFloat(lng ?? '');
    const hasCoords = !isNaN(userLat) && !isNaN(userLng);

    let results = rows.map(r => ({
      ...r,
      distanceKm: hasCoords && r.lat && r.lng
        ? Math.round(haversineKm(userLat, userLng, Number(r.lat), Number(r.lng)) * 10) / 10
        : null,
    }));

    if (hasCoords) {
      results = results.sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity));
    }

    return ok(res, results);
  } catch (e: unknown) {
    console.error('[hospitals]', e);
    return err(res, 'Internal server error', 500);
  }
}
