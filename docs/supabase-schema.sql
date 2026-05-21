-- Run in Supabase SQL Editor (free tier). Minimal tables for V2.

create extension if not exists "uuid-ossp";

create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  guest_id text,
  status text not null default 'in_progress',
  extracted_data jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint conversations_owner_check check (user_id is not null or guest_id is not null)
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz not null default now()
);

create table if not exists property_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  guest_id text,
  uprn bigint not null,
  postcode text,
  address text,
  epc_data jsonb,
  solar_data jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_conversations_user on conversations(user_id);
create index if not exists idx_conversations_guest on conversations(guest_id);
create index if not exists idx_messages_conversation on messages(conversation_id);
create index if not exists idx_property_reports_user on property_reports(user_id);

-- RLS: backend uses service_role key; enable RLS and deny anon direct access
alter table conversations enable row level security;
alter table messages enable row level security;
alter table property_reports enable row level security;
