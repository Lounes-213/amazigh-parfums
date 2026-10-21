-- Migration: Add price, settings table, and orders table
-- Run with: npx wrangler d1 execute amazigh-db --remote --file=backend/migrate.sql -y

-- Add price columns to perfumes
ALTER TABLE perfumes ADD COLUMN price REAL DEFAULT 0;
ALTER TABLE perfumes ADD COLUMN price_visible INTEGER NOT NULL DEFAULT 1;

-- Settings table for site config (logo, video, order method, notifications)
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default settings
INSERT OR IGNORE INTO settings (key, value) VALUES ('logo_url', '');
INSERT OR IGNORE INTO settings (key, value) VALUES ('bg_video_url', '');
INSERT OR IGNORE INTO settings (key, value) VALUES ('order_method', 'whatsapp');
INSERT OR IGNORE INTO settings (key, value) VALUES ('notification_token', '');
INSERT OR IGNORE INTO settings (key, value) VALUES ('whatsapp_number', '213549225794');

-- Orders table to track orders and send notifications
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  items TEXT NOT NULL,
  notes TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
