"use client";

import Link from "next/link";
import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

export default function RegisterForm() {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function continueWithGoogle() {
    setBusy(true);
    setMessage("");

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/e-memo-registry/auth/callback` },
    });

    if (error) {
      setBusy(false);
      setMessage(error.message);
    }
  }

  return (
    <div className="register-form">
      <p className="muted">
        ใช้บัญชี Google ของคุณเพื่อลงทะเบียนและเข้าใช้งานระบบ
      </p>
      <button
        type="button"
        className="register-submit"
        disabled={busy}
        onClick={continueWithGoogle}
        style={{
          background: "#fff",
          border: "1px solid #b9c8de",
          color: "#1d3152",
          boxShadow: "none",
        }}
      >
        {busy ? "กำลังเชื่อมต่อ Google..." : "G  ดำเนินการต่อด้วย Google"}
      </button>
      <p className="error">{message}</p>
      <p className="signin-link">
        มีบัญชีอยู่แล้ว? <Link href="/login">เข้าสู่ระบบ</Link>
      </p>
    </div>
  );
}
