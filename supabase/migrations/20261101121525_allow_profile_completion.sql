alter table public.profiles
  add column if not exists onboarding_completed boolean not null default false;

revoke update on public.profiles from authenticated;
grant update (first_name, last_name, full_name, work_group, organization, office_phone, onboarding_completed)
  on public.profiles to authenticated;

create policy profiles_self_complete_onboarding
on public.profiles
for update
to authenticated
using (id = (select auth.uid()))
with check (
  id = (select auth.uid())
  and first_name ~ '^[ก-๙]+$'
  and last_name ~ '^[ก-๙]+$'
  and full_name = first_name || ' ' || last_name
  and work_group = 'เวชระเบียนและข้อมูลทางการแพทย์'
  and length(trim(organization)) between 1 and 200
  and office_phone ~ '^[0-9]{4}$'
  and onboarding_completed = true
);
