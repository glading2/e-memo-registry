import RegisterForm from '@/components/register-form';
import ProfileForm from '@/components/profile-form';
import { db } from '@/lib/supabase';

export default async function Register() {
  const supabase = await db();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = user
    ? await supabase.from('profiles').select('first_name,last_name,position,work_group,organization,office_phone').eq('id', user.id).maybeSingle()
    : { data: null };

  return <section className="register-page">
    <aside className="register-hero">
      <div className="memo-mark" aria-hidden="true"><span /><span /><span /></div>
      <h1>e-Memo Registry</h1>
      <h2>ระบบทะเบียน<br />บันทึกข้อความภายใน</h2>
      <p>กลุ่มงาน / หน่วยงานภายใน</p>
      <div className="desk-scene" aria-hidden="true"><div className="laptop"><div>✦</div></div><div className="plant">✦</div><div className="pen-cup">││</div></div>
    </aside>
    <div className="register-panel">
      <div className="register-heading"><div className="account-icon">♙</div><h1>{user ? 'ข้อมูลส่วนตัว' : 'สมัครสมาชิก'}</h1><p>{user ? 'กรอกข้อมูลให้ครบถ้วนเพื่อเปิดใช้งานบัญชี' : 'ยืนยันตัวตนด้วยบัญชี Google เพื่อเริ่มลงทะเบียน'}</p></div>
      {user ? <ProfileForm userId={user.id} email={user.email ?? ''} verified={Boolean(user.email_confirmed_at)} profile={profile} /> : <RegisterForm />}
    </div>
  </section>;
}
