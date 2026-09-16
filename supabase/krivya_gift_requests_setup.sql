-- Krivya shared gift request demo setup.
-- Safe to run more than once. Do not run destructive DROP statements.

create extension if not exists pgcrypto;

create table if not exists public.gift_requests (
  id uuid primary key default gen_random_uuid(),
  request_id text unique not null,
  request_code text unique,
  status text not null default 'New',
  customer_name text not null,
  customer_email text,
  customer_phone text not null,
  email text,
  phone text,
  recipient_name text not null,
  recipient text,
  budget text,
  destination text not null,
  preferred_delivery_date date not null,
  occasion text not null,
  selected_items jsonb not null default '[]'::jsonb,
  personalization_details text,
  personalization_notes text,
  gift_message text,
  additional_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint gift_requests_request_id_format check (
    request_id ~ '^KRV-[0-9]{6}-[A-F0-9]{4}$'
    or request_id ~ '^KRV-[0-9]{5}$'
  ),
  constraint gift_requests_status_check check (status in ('New', 'Reviewing', 'Contacted', 'Confirmed', 'Completed', 'Cancelled')),
  constraint gift_requests_selected_items_array check (jsonb_typeof(selected_items) = 'array')
);

alter table public.gift_requests
  add column if not exists request_id text,
  add column if not exists request_code text,
  add column if not exists status text not null default 'New',
  add column if not exists customer_name text,
  add column if not exists customer_email text,
  add column if not exists customer_phone text,
  add column if not exists email text,
  add column if not exists phone text,
  add column if not exists recipient_name text,
  add column if not exists recipient text,
  add column if not exists budget text,
  add column if not exists destination text,
  add column if not exists preferred_delivery_date date,
  add column if not exists occasion text,
  add column if not exists selected_items jsonb not null default '[]'::jsonb,
  add column if not exists personalization_details text,
  add column if not exists personalization_notes text,
  add column if not exists gift_message text,
  add column if not exists additional_notes text,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'gift_requests'
      and column_name = 'request_code'
  ) then
    execute 'update public.gift_requests set request_id = request_code where request_id is null and request_code is not null';
  end if;
end $$;

update public.gift_requests
set request_id = coalesce(request_id, request_code),
    request_code = coalesce(request_code, request_id),
    customer_phone = coalesce(customer_phone, phone),
    phone = coalesce(phone, customer_phone),
    customer_email = coalesce(customer_email, email),
    email = coalesce(email, customer_email),
    recipient_name = coalesce(recipient_name, recipient),
    recipient = coalesce(recipient, recipient_name),
    personalization_details = coalesce(personalization_details, personalization_notes),
    personalization_notes = coalesce(personalization_notes, personalization_details),
    budget = coalesce(budget, '')
where request_id is null
   or request_code is null
   or customer_phone is null
   or phone is null
   or recipient_name is null
   or recipient is null
   or budget is null
   or personalization_details is null
   or personalization_notes is null;

create unique index if not exists gift_requests_request_id_key on public.gift_requests (request_id);
create unique index if not exists gift_requests_request_code_key on public.gift_requests (request_code);
create index if not exists gift_requests_status_idx on public.gift_requests (status);
create index if not exists gift_requests_created_at_idx on public.gift_requests (created_at desc);
create index if not exists gift_requests_customer_name_idx on public.gift_requests (customer_name);
create index if not exists gift_requests_customer_phone_idx on public.gift_requests (customer_phone);

alter table public.gift_requests enable row level security;

-- No anon SELECT/UPDATE policies are created on purpose.
-- Browser access goes through Next.js API routes.
-- Server-side API routes use SUPABASE_SERVICE_ROLE_KEY, which must never be exposed to client code.
