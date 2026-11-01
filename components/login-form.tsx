"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

export default function LoginForm() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function continueWithGoogle(register = false) {
    setBusy(true);
    setError("");
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/e-memo-registry/auth/callback${register ? "?next=/register" : ""}`,
      },
    });
    if (oauthError) {
      setBusy(false);
      setError(oauthError.message);
    }
  }

  return (
    <div className="login-form">
      <p className="login-help">เข้าสู่ระบบด้วยบัญชี Google ที่ลงทะเบียนไว้</p>
      <button
        type="button"
        className="login-submit"
        disabled={busy}
        onClick={continueWithGoogle}
      >
        <span className="google-mark" aria-hidden="true">G</span>
        {busy ? "กำลังเชื่อมต่อ Google..." : "ดำเนินการต่อด้วย Google"}
      </button>
      <p className="register-prompt">
        ยังไม่มีบัญชี? <button type="button" disabled={busy} onClick={() => continueWithGoogle(true)} style={{ margin: 0, padding: 0, border: 0, background: "transparent", color: "#2563b9", font: "inherit", fontWeight: 700, boxShadow: "none", textDecoration: "underline" }}>ลงทะเบียนด้วย Google</button>
      </p>
      <p className="error" role="alert">{error}</p>
    </div>
  );
}
