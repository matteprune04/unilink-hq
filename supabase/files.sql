-- UniLink HQ — allegati (Supabase Storage)
-- Da incollare UNA volta in Supabase -> SQL Editor -> Run.
-- Crea un archivio PRIVATO "hq-files": i file si aprono solo dopo l'accesso con la password del team.

insert into storage.buckets (id, name, public, file_size_limit)
values ('hq-files', 'hq-files', false, 26214400)   -- 25 MB per file
on conflict (id) do update set public = false, file_size_limit = 26214400;

drop policy if exists hq_team_files on storage.objects;
create policy hq_team_files on storage.objects
  for all to authenticated
  using (bucket_id = 'hq-files' and public.is_hq_team())
  with check (bucket_id = 'hq-files' and public.is_hq_team());
