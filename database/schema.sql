-- MRK SEVA 360 — Database Schema
-- Run this in Neon SQL Editor (vercel.com → Storage → Neon → SQL Editor)

-- Staff users table
CREATE TABLE IF NOT EXISTS staff_users (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  hospital_id TEXT NOT NULL,
  username    TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role        TEXT NOT NULL DEFAULT 'receptionist',
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Patients table
CREATE TABLE IF NOT EXISTS patients (
  id         TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name       TEXT NOT NULL,
  phone      TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id           TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  patient_name TEXT NOT NULL,
  patient_phone TEXT NOT NULL,
  hospital_id  TEXT NOT NULL,
  hospital_name TEXT NOT NULL,
  department   TEXT NOT NULL,
  token_number INTEGER NOT NULL,
  preferred_date TEXT NOT NULL,
  preferred_time TEXT NOT NULL,
  reason       TEXT,
  status       TEXT NOT NULL DEFAULT 'pending',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bookings_hospital ON bookings(hospital_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(preferred_date);

-- Ambulance requests table
CREATE TABLE IF NOT EXISTS ambulance_requests (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  patient_name TEXT NOT NULL,
  patient_phone TEXT NOT NULL,
  pickup_location TEXT NOT NULL,
  destination TEXT NOT NULL,
  hospital_id TEXT,
  status      TEXT NOT NULL DEFAULT 'requested',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Data reports table
CREATE TABLE IF NOT EXISTS data_reports (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  hospital_id TEXT NOT NULL,
  issue_type  TEXT NOT NULL,
  description TEXT,
  status      TEXT NOT NULL DEFAULT 'pending',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed demo staff account
-- Password: Admin@123 (bcrypt hash)
INSERT INTO staff_users (hospital_id, username, password_hash, role)
VALUES (
  'h005',
  'admin@demo.mrkseva',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/VK9Zg7i',
  'admin'
) ON CONFLICT (username) DO NOTHING;
