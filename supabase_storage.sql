-- Run in Supabase SQL editor (after main schema).
-- Then set Vercel env: SUPABASE_STORAGE_BUCKET=generated-files

insert into storage.buckets (id, name, public)
values ('generated-files', 'generated-files', false)
on conflict (id) do nothing;

create policy "Users read own generated files"
on storage.objects for select
to authenticated
using (
  bucket_id = 'generated-files'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Service role uploads generated files"
on storage.objects for insert
to service_role
with check (bucket_id = 'generated-files');

create policy "Service role updates generated files"
on storage.objects for update
to service_role
using (bucket_id = 'generated-files');
