-- Create products table for the app
-- Run this in your Supabase SQL editor or psql

create extension if not exists "pgcrypto";

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  price integer,
  image text,
  shopeeUrl text,
  description text,
  videoUrl text,
  playlistUrl text,
  isFeatured boolean default false,
  created_at timestamptz default now()
);

-- Optional: index for title search
create index if not exists products_title_idx on products using gin (to_tsvector('simple', coalesce(title,'')));
