"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

export default function LoginForm() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function continueWithGoogle() {
    setBusy(true);
    setError("");
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/e-memo-registry/auth/callback`,
      },
    });
    if (oauthError) {
      setBusy(false);
      setError(oauthError.message);
    }
  }

  return <div className="login-form">
    <p>เข้าสู่ระบบด้วยบัญชี Google ที่ลงทะเบียนไว้</p>
    <button
      type="button"
      className="login-submit"
      disabled={busy}
      onClick={continueWithGoogle}
      style={{ background: "#fff", border: "1px solid #b9c8de", color: "#1d3152", boxShadow: "none" }}
    >
      {busy ? "กำลังเชื่อมต่อ Google..." : "G  เข้าสู่ระบบด้วย Google"}
    </button>
    <p className="error">{error}</p>
  </div>;
}
