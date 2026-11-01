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
  v_position text := trim(coalesce(new.raw_user_meta_data ->> 'position', ''));
  v_work_group text := trim(coalesce(new.raw_user_meta_data ->> 'work_group', ''));
  v_organization text := trim(coalesce(new.raw_user_meta_data ->> 'organization', ''));
  v_office_phone text := trim(coalesce(new.raw_user_meta_data ->> 'office_phone', ''));
begin
  if v_username !~ '^[a-z0-9_-]{3,32}$' then raise exception 'Invalid username'; end if;
  if v_first_name !~ '^[ก-๙]+$' or v_last_name !~ '^[ก-๙]+$' then raise exception 'First name and last name must contain Thai characters only'; end if;
  if length(v_position) not between 1 and 120 or length(v_work_group) not between 1 and 120 or length(v_organization) not between 1 and 200 then raise exception 'Registration details are required'; end if;
  if v_office_phone !~ '^[0-9]{4}$' then raise exception 'Office phone number must be exactly 4 digits'; end if;

  insert into public.profiles (id, username, first_name, last_name, full_name, position, work_group, organization, office_phone, role, active)
  values (new.id, v_username, v_first_name, v_last_name, v_first_name || ' ' || v_last_name, v_position, v_work_group, v_organization, v_office_phone, 'staff', true);
  return new;
end;
$$;
