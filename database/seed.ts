// database/seed.ts — Run once to seed demo staff account
// Usage: npx tsx database/seed.ts
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('❌ Set DATABASE_URL in .env.local first');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function seed() {
  console.log('🌱 Seeding demo staff account...');

  // Hash the demo password at runtime (never hardcode hashes)
  const hash = await bcrypt.hash('Admin@123', 12);

  await sql`
    INSERT INTO staff_users (id, hospital_id, username, password_hash, role, is_active)
    VALUES (
      'staff-demo-001',
      'h005',
      'admin@demo.mediseva',
      ${hash},
      'admin',
      true
    )
    ON CONFLICT (username) DO UPDATE
      SET password_hash = EXCLUDED.password_hash,
          updated_at    = NOW()`;

  // Also seed a receptionist account
  const hash2 = await bcrypt.hash('Admin@123', 12);
  await sql`
    INSERT INTO staff_users (id, hospital_id, username, password_hash, role, is_active)
    VALUES (
      'staff-demo-002',
      'h005',
      'receptionist@demo.mediseva',
      ${hash2},
      'receptionist',
      true
    )
    ON CONFLICT (username) DO UPDATE
      SET password_hash = EXCLUDED.password_hash,
          updated_at    = NOW()`;

  console.log('✅ Demo staff seeded!');
  console.log('   Username: admin@demo.mediseva | Password: Admin@123');
  console.log('   Username: receptionist@demo.mediseva | Password: Admin@123');
}

seed().catch(e => { console.error(e); process.exit(1); });
