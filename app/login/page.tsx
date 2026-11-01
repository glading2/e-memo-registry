import LoginForm from "@/components/login-form";
import styles from "./minimal.module.css";

export default function Login() {
  return (
    <section className={`${styles.page} login-page`}>
      <style>{`body:has(.login-page){background:#f7f9fc}body:has(.login-page) header{display:none}main:has(.login-page){max-width:none;margin:0;padding:0}`}</style>
      <div className={styles.card}>
        <div className={styles.mark} aria-hidden="true">✦</div>
        <h1>e-Memo Registry</h1>
        <p className={styles.subtitle}>ระบบทะเบียนบันทึกข้อความภายใน</p>
        <div className={styles.divider} />
        <LoginForm />
      </div>
    </section>
  );
}
