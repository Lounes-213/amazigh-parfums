-- Migration 2 : catégories dynamiques + ordre d'affichage + paramètres du site
-- Exécuter : npx wrangler d1 execute amazigh-db --remote --file=migrate2.sql -y

-- 1) Reconstruit la table perfumes : catégorie libre (plus de CHECK) + sort_order
DROP TABLE IF EXISTS perfumes_new;

CREATE TABLE perfumes_new (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  volume TEXT NOT NULL DEFAULT '100 ML',
  category TEXT NOT NULL,
  gender TEXT NOT NULL CHECK(gender IN ('unisexe', 'homme', 'femme')),
  image TEXT NOT NULL,
  description TEXT NOT NULL,
  notes_top TEXT NOT NULL,
  notes_heart TEXT NOT NULL,
  notes_base TEXT NOT NULL,
  sillage TEXT NOT NULL CHECK(sillage IN ('Intense', 'Modéré', 'Royal')),
  longevity TEXT NOT NULL DEFAULT '+14 Heures',
  accent_color TEXT NOT NULL DEFAULT '#C8A34D',
  rating REAL NOT NULL DEFAULT 4.9,
  reviews_count INTEGER NOT NULL DEFAULT 100,
  is_bestseller INTEGER NOT NULL DEFAULT 0,
  is_new INTEGER NOT NULL DEFAULT 0,
  price REAL NOT NULL DEFAULT 0,
  price_visible INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO perfumes_new (
  id, name, subtitle, volume, category, gender, image, description,
  notes_top, notes_heart, notes_base, sillage, longevity, accent_color,
  rating, reviews_count, is_bestseller, is_new, price, price_visible,
  sort_order, created_at, updated_at
)
SELECT
  id, name, subtitle, volume, category, gender, image, description,
  notes_top, notes_heart, notes_base, sillage, longevity, accent_color,
  rating, reviews_count, is_bestseller, is_new,
  COALESCE(price, 0), COALESCE(price_visible, 1),
  0, created_at, updated_at
FROM perfumes;

DROP TABLE perfumes;
ALTER TABLE perfumes_new RENAME TO perfumes;

CREATE INDEX IF NOT EXISTS idx_perfumes_category ON perfumes(category);
CREATE INDEX IF NOT EXISTS idx_perfumes_gender ON perfumes(gender);
CREATE INDEX IF NOT EXISTS idx_perfumes_sort ON perfumes(sort_order);

-- 2) Table des catégories (types de parfums), gérable depuis l'admin
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO categories (id, label, sort_order) VALUES
  ('oriental', 'Oriental & Ambré', 1),
  ('woody', 'Boisé & Oud', 2),
  ('floral', 'Floral Précieux', 3),
  ('fresh', 'Frais & Noble', 4);

-- 3) Réglages du site (téléphone + réseaux sociaux)
INSERT OR IGNORE INTO settings (key, value) VALUES ('phone', '0549225794');
INSERT OR IGNORE INTO settings (key, value) VALUES ('instagram', 'https://www.instagram.com/officielle_amazigh');
INSERT OR IGNORE INTO settings (key, value) VALUES ('facebook', 'https://www.facebook.com/profile.php?id=61595685982616');
INSERT OR IGNORE INTO settings (key, value) VALUES ('tiktok', '');
INSERT OR IGNORE INTO settings (key, value) VALUES ('site_name', 'AMAZIGH');
