PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS stories (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  cover_image TEXT NOT NULL DEFAULT '',
  reading_level TEXT NOT NULL DEFAULT '',
  source_url TEXT NOT NULL,
  public_domain_note TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  chunk_size INTEGER NOT NULL DEFAULT 140 CHECK (chunk_size BETWEEN 40 AND 500),
  published_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS story_age_bands (
  story_id TEXT NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  age_band TEXT NOT NULL CHECK (age_band IN ('k4', '5-8', '9-12')),
  PRIMARY KEY (story_id, age_band)
);

CREATE TABLE IF NOT EXISTS story_passages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  story_id TEXT NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  passage_number INTEGER NOT NULL,
  text TEXT NOT NULL,
  word_count INTEGER NOT NULL,
  UNIQUE (story_id, passage_number)
);

CREATE INDEX IF NOT EXISTS idx_stories_public ON stories(status, published_at, updated_at);
CREATE INDEX IF NOT EXISTS idx_story_passages_order ON story_passages(story_id, passage_number);
