-- Schema for Amazigh Perfumes Database in Cloudflare D1
CREATE TABLE IF NOT EXISTS perfumes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  volume TEXT NOT NULL DEFAULT '100 ML',
  category TEXT NOT NULL CHECK(category IN ('oriental', 'woody', 'floral', 'fresh')),
  gender TEXT NOT NULL CHECK(gender IN ('unisexe', 'homme', 'femme')),
  image TEXT NOT NULL,
  description TEXT NOT NULL,
  notes_top TEXT NOT NULL,   -- JSON array string
  notes_heart TEXT NOT NULL, -- JSON array string
  notes_base TEXT NOT NULL,  -- JSON array string
  sillage TEXT NOT NULL CHECK(sillage IN ('Intense', 'Modéré', 'Royal')),
  longevity TEXT NOT NULL DEFAULT '+14 Heures',
  accent_color TEXT NOT NULL DEFAULT '#C8A34D',
  rating REAL NOT NULL DEFAULT 4.9,
  reviews_count INTEGER NOT NULL DEFAULT 100,
  is_bestseller INTEGER NOT NULL DEFAULT 0,
  is_new INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_perfumes_category ON perfumes(category);
CREATE INDEX IF NOT EXISTS idx_perfumes_gender ON perfumes(gender);
