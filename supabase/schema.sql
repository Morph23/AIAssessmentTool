-- Run this script in the Supabase SQL editor to reset and provision the
-- assessment schema. It drops any existing assessment tables, recreates them,
-- enables RLS, and adds permissive insert/select policies (adjust for your app).

begin;

drop table if exists public.ai_teacher_readiness_assessments cascade;
drop table if exists public.science_dept_assessments cascade;
drop table if exists public.humanities_dept_assessments cascade;
drop table if exists public.leadership_assessments cascade;

create extension if not exists "pgcrypto";

create table public.ai_teacher_readiness_assessments (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default timezone('utc', now()),
  config_id text not null default 'ai-teacher-readiness',
  position text,
  experience text,
  subject text,
  ai_knowledge text,
  context jsonb not null default '{}'::jsonb,
  answers jsonb not null default '[]'::jsonb,
  numeric_scores jsonb not null default '[]'::jsonb,
  detailed_answers jsonb not null default '[]'::jsonb,
  total_score numeric,
  max_possible_score numeric,
  result_percentage numeric,
  interpretation_label text,
  interpretation_description text,
  constraint ai_teacher_readiness_config_chk check (config_id = 'ai-teacher-readiness')
);

create index ai_teacher_readiness_assessments_created_at_idx
  on public.ai_teacher_readiness_assessments (created_at desc);
create index ai_teacher_readiness_assessments_result_percentage_idx
  on public.ai_teacher_readiness_assessments (result_percentage);

alter table public.ai_teacher_readiness_assessments enable row level security;

create table public.science_dept_assessments (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default timezone('utc', now()),
  config_id text not null default 'science-dept',
  science_subject text,
  lab_experience text,
  context jsonb not null default '{}'::jsonb,
  answers jsonb not null default '[]'::jsonb,
  numeric_scores jsonb not null default '[]'::jsonb,
  detailed_answers jsonb not null default '[]'::jsonb,
  total_score numeric,
  max_possible_score numeric,
  result_percentage numeric,
  interpretation_label text,
  interpretation_description text,
  constraint science_dept_config_chk check (config_id = 'science-dept')
);

create index science_dept_assessments_created_at_idx
  on public.science_dept_assessments (created_at desc);
create index science_dept_assessments_result_percentage_idx
  on public.science_dept_assessments (result_percentage);

alter table public.science_dept_assessments enable row level security;

create table public.humanities_dept_assessments (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default timezone('utc', now()),
  config_id text not null default 'humanities-dept',
  humanities_subject text,
  context jsonb not null default '{}'::jsonb,
  answers jsonb not null default '[]'::jsonb,
  numeric_scores jsonb not null default '[]'::jsonb,
  detailed_answers jsonb not null default '[]'::jsonb,
  total_score numeric,
  max_possible_score numeric,
  result_percentage numeric,
  interpretation_label text,
  interpretation_description text,
  constraint humanities_dept_config_chk check (config_id = 'humanities-dept')
);

create index humanities_dept_assessments_created_at_idx
  on public.humanities_dept_assessments (created_at desc);
create index humanities_dept_assessments_result_percentage_idx
  on public.humanities_dept_assessments (result_percentage);

alter table public.humanities_dept_assessments enable row level security;

create table public.leadership_assessments (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default timezone('utc', now()),
  config_id text not null default 'leadership',
  leadership_role text,
  context jsonb not null default '{}'::jsonb,
  answers jsonb not null default '[]'::jsonb,
  numeric_scores jsonb not null default '[]'::jsonb,
  detailed_answers jsonb not null default '[]'::jsonb,
  total_score numeric,
  max_possible_score numeric,
  result_percentage numeric,
  interpretation_label text,
  interpretation_description text,
  constraint leadership_config_chk check (config_id = 'leadership')
);

create index leadership_assessments_created_at_idx
  on public.leadership_assessments (created_at desc);
create index leadership_assessments_result_percentage_idx
  on public.leadership_assessments (result_percentage);

alter table public.leadership_assessments enable row level security;

-- Basic policies: allow insert/select to anonymous key (adjust as needed).
create policy "Allow insert from anon"
  on public.ai_teacher_readiness_assessments
  for insert
  with check (true);

create policy "Allow select from anon"
  on public.ai_teacher_readiness_assessments
  for select
  using (true);

create policy "Allow insert from anon"
  on public.science_dept_assessments
  for insert
  with check (true);

create policy "Allow select from anon"
  on public.science_dept_assessments
  for select
  using (true);

create policy "Allow insert from anon"
  on public.humanities_dept_assessments
  for insert
  with check (true);

create policy "Allow select from anon"
  on public.humanities_dept_assessments
  for select
  using (true);

create policy "Allow insert from anon"
  on public.leadership_assessments
  for insert
  with check (true);

create policy "Allow select from anon"
  on public.leadership_assessments
  for select
  using (true);

commit;
