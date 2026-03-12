-- Supabase Data Model for CeyLaw MVP

-- Note: Users table is managed by Supabase Auth (auth.users)

-- Categories Table
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL
);

-- Laws Table
CREATE TABLE laws (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  short_title text,
  year integer,
  act_number text,
  category_id uuid REFERENCES categories(id),
  description text,
  full_text text,
  source_url text,
  source_name text,
  published boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Law Sections Table
CREATE TABLE law_sections (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  law_id uuid REFERENCES laws(id) ON DELETE CASCADE,
  section_number text NOT NULL,
  heading text NOT NULL,
  content text NOT NULL,
  order_index integer,
  anchor_slug text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(law_id, section_number)
);

-- AI Queries (Optional Logging)
CREATE TABLE ai_queries (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  question text NOT NULL,
  context_law_id uuid REFERENCES laws(id) ON DELETE SET NULL,
  answer text,
  created_at timestamp with time zone DEFAULT now()
);

-- Index recommendations for full-text search capability
CREATE INDEX idx_law_sections_content ON law_sections USING GIN (to_tsvector('english', content));
CREATE INDEX idx_laws_title ON laws USING GIN (to_tsvector('english', title));
