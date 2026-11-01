alter table public.profiles
  add column if not exists identity_verified_at timestamptz,
  add column if not exists registration_completed_at timestamptz;

create or replace function public.complete_my_profile(
  p_first_name text,
  p_last_name text,
  p_position text,
  p_work_group text,
  p_organization text,
  p_office_phone text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_google_verified boolean;
begin
  if v_user is null then raise exception 'กรุณาเข้าสู่ระบบก่อนบันทึกข้อมูล'; end if;

  select raw_app_meta_data ->> 'provider' = 'google' and email_confirmed_at is not null
    into v_google_verified
  from auth.users
  where id = v_user;

  if coalesce(v_google_verified, false) is not true then
    raise exception 'ต้องยืนยันตัวตนด้วยบัญชี Google ที่ยืนยันอีเมลแล้ว';
  end if;
  if trim(p_first_name) = '' or trim(p_last_name) = '' then raise exception 'กรุณาระบุชื่อและนามสกุล'; end if;
  if length(trim(p_position)) not between 1 and 120 or length(trim(p_work_group)) not between 1 and 120 or length(trim(p_organization)) not between 1 and 200 then raise exception 'กรุณากรอกข้อมูลหน่วยงานให้ครบถ้วน'; end if;
  if trim(p_office_phone) !~ '^[0-9]{4}$' then raise exception 'โทรศัพท์ภายในต้องเป็นตัวเลข 4 หลัก'; end if;

  update public.profiles
  set first_name = trim(p_first_name), last_name = trim(p_last_name), full_name = trim(p_first_name) || ' ' || trim(p_last_name), position = trim(p_position), work_group = trim(p_work_group), organization = trim(p_organization), office_phone = trim(p_office_phone), identity_verified_at = now(), registration_completed_at = now()
  where id = v_user;
end;
$$;

revoke all on function public.complete_my_profile(text, text, text, text, text, text) from public, anon;
grant execute on function public.complete_my_profile(text, text, text, text, text, text) to authenticated;
