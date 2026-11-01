import TwoFactorForm from "@/components/two-factor-form";

export default function VerifyTwoFactor() {
  return <section className="card" style={{ maxWidth: 520, margin: "40px auto" }}>
    <h1>ยืนยันตัวตน 2 ขั้นตอน</h1>
    <p className="muted">ใช้แอป Google Authenticator เพื่อปกป้องบัญชีของคุณ</p>
    <TwoFactorForm />
  </section>;
}
