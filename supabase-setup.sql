-- Alexander & Tamandani public wedding photo gallery
-- Run this in Supabase Dashboard > SQL Editor.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('wedding-gallery', 'wedding-gallery', true, 10485760,
        array['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Wedding gallery public listing" on storage.objects;
create policy "Wedding gallery public listing"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'wedding-gallery');

drop policy if exists "Wedding guests can upload photos" on storage.objects;
create policy "Wedding guests can upload photos"
on storage.objects for insert
to anon, authenticated
with check (bucket_id = 'wedding-gallery' and (storage.foldername(name))[1] = 'uploads');

-- No public UPDATE or DELETE policy is created.
