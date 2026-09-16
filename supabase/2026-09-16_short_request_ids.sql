-- Krivya short Request ID migration.
-- Safe for existing demo records: supports both old and new request ID formats.

alter table public.gift_requests
  drop constraint if exists gift_requests_request_id_format;

alter table public.gift_requests
  add constraint gift_requests_request_id_format
  check (
    request_id ~ '^KRV-[0-9]{6}-[A-F0-9]{4}$'
    or request_id ~ '^KRV-[0-9]{5}$'
  );
