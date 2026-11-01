import RegisterForm from '@/components/register-form';

export default function Register() {
  return <section className="register-page">
    <aside className="register-hero">
      <div className="memo-mark" aria-hidden="true"><span /><span /><span /></div>
      <h1>e-Memo Registry</h1>
      <h2>ระบบทะเบียน<br />บันทึกข้อความภายใน</h2>
      <p>กลุ่มงาน / หน่วยงานภายใน</p>
      <div className="desk-scene" aria-hidden="true"><div className="laptop"><div>✦</div></div><div className="plant">✦</div><div className="pen-cup">││</div></div>
    </aside>
    <div className="register-panel">
      <div className="register-heading"><div className="account-icon">♙</div><h1>สมัครสมาชิก</h1><p>สร้างบัญชีเพื่อใช้งานระบบทะเบียนบันทึกข้อความภายใน</p></div>
      <RegisterForm />
    </div>
  </section>;
}
