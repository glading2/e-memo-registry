alter table public.profiles
  add column if not exists username text unique,
  add column if not exists first_name text,
  add column if not exists last_name text;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_username text := lower(trim(coalesce(new.raw_user_meta_data ->> 'username', '')));
  v_first_name text := trim(coalesce(new.raw_user_meta_data ->> 'first_name', ''));
  v_last_name text := trim(coalesce(new.raw_user_meta_data ->> 'last_name', ''));
begin
  if v_username !~ '^[a-z0-9_-]{3,32}$' then
    raise exception 'Invalid username';
  end if;
  if v_first_name !~ '^[ก-๙]+$' or v_last_name !~ '^[ก-๙]+$' then
    raise exception 'First name and last name must contain Thai characters only';
  end if;

  insert into public.profiles (id, username, first_name, last_name, full_name, role, active)
  values (new.id, v_username, v_first_name, v_last_name, v_first_name || ' ' || v_last_name, 'staff', true);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
