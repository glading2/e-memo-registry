import Image from "next/image";
import LoginForm from "@/components/login-form";
import styles from "./reference.module.css";

export default function Login() {
  return (
    <>
      <style>{`body:has(.reference-login){overflow:hidden}body:has(.reference-login) header{display:none}main:has(.reference-login){max-width:none;margin:0;padding:0}`}</style>
      <section
        className={`${styles.page} reference-login`}
        style={{
          height: "100dvh",
          minHeight: 0,
          padding: 10,
          position: "relative",
        }}
      >
        <Image
          src="/e-memo-registry/images/login-flower-books.png"
          alt=""
          width={520}
          height={600}
          priority
          style={{
            position: "absolute",
            zIndex: 0,
            left: 0,
            bottom: 0,
            width: "min(36vw, 440px)",
            height: "auto",
            opacity: 0.72,
            pointerEvents: "none",
          }}
        />
        <div
          className={styles.card}
          style={{
            width: "min(700px, 100%)",
            height: "calc(100dvh - 20px)",
            minHeight: 0,
            borderRadius: 58,
            zIndex: 1,
          }}
        >
          <div className={styles.content} style={{ marginTop: 14, zoom: 0.72 }}>
            <div className={styles.document}>☷</div>
            <h1>e-Memo Registry</h1>
            <p className={styles.subtitle}>ระบบทะเบียนบันทึกข้อความภายใน</p>
            <div className={styles.swoosh} />
            <LoginForm />
          </div>
        </div>
      </section>
    </>
  );
}
