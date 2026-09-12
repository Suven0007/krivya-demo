# Supabase Next Steps for Krivya Gift Requests

The current demo stores submitted requests in browser `localStorage` through `lib/requests/localRequestRepository.ts`. This is useful for a single-browser sales demo, but it is not shared across devices and is not production-ready.

## Repository Swap

Replace the implementation behind the `RequestRepository` interface in:

- `lib/requests/requestRepository.ts`
- `lib/requests/localRequestRepository.ts`

A future `supabaseRequestRepository.ts` should expose the same methods:

- `createRequest`
- `getRequest`
- `listRequests`
- `updateStatus`
- `clearAll` or an admin-only replacement if needed

The UI should continue calling the repository abstraction rather than direct Supabase queries.

## Suggested Tables

### `gift_requests`

Fields:

- `id uuid primary key default gen_random_uuid()`
- `request_code text unique not null`
- `customer_name text not null`
- `phone text not null`
- `email text`
- `destination text not null`
- `occasion text not null`
- `recipient text not null`
- `budget text not null`
- `preferred_delivery_date date not null`
- `personalization_notes text`
- `gift_message text`
- `additional_notes text`
- `status gift_request_status not null default 'New'`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

### `gift_request_items`

Fields:

- `id uuid primary key default gen_random_uuid()`
- `request_id uuid not null references gift_requests(id) on delete cascade`
- `item_code text not null`
- `item_name text not null`
- `category text not null`
- `quantity integer not null check (quantity > 0)`
- `image_path text`
- `created_at timestamptz not null default now()`

## Suggested Status Enum

```sql
create type gift_request_status as enum (
  'New',
  'Reviewing',
  'Contacted',
  'Confirmed',
  'Completed',
  'Cancelled'
);
```

## Suggested Indexes

- `gift_requests(request_code)` unique index
- `gift_requests(status)`
- `gift_requests(created_at desc)`
- `gift_requests(customer_name)`
- `gift_request_items(request_id)`

For search, consider a generated `tsvector` or simple trigram indexes later if request volume grows.

## RLS Considerations

- Public visitors should be able to insert a new request only through a controlled API route or server action.
- Public visitors should not be able to list all requests.
- Customer request lookup by `request_code` should be carefully scoped, ideally with an additional verification token if requests contain sensitive details.
- Admin users should be authenticated before listing, filtering, or updating statuses.
- Status updates should be limited to authenticated admin roles.

## Environment Variables Needed Later

Do not add fake keys now. When Supabase is configured, the project will likely need:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` for server-only admin operations, if required

Keep service-role credentials server-only and never expose them in client components.

## Request ID Notes

The demo currently generates request codes like `KRV-YYMMDD-XXXX`. In production, keep `request_code` unique at the database level and retry generation if a collision occurs.
