"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

export default function TwoFactorForm() {
  const [factorId, setFactorId] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("กำลังเตรียมการยืนยันตัวตน...");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    async function prepare() {
      const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.assign("/e-memo-registry/login");
        return;
      }
      const { data: factors, error: factorsError } = await supabase.auth.mfa.listFactors();
      if (factorsError) {
        setMessage(factorsError.message);
        return;
      }
      const existing = factors.all.find((factor) => factor.factor_type === "totp" && factor.status === "verified");
      if (existing) {
        setFactorId(existing.id);
        setMessage("เปิด Google Authenticator แล้วกรอกรหัส 6 หลัก");
        return;
      }
      const { data, error } = await supabase.auth.mfa.enroll({ factorType: "totp", friendlyName: "Google Authenticator" });
      if (error || !data) {
        setMessage(error?.message ?? "ไม่สามารถเริ่มตั้งค่า 2FA ได้");
        return;
      }
      setFactorId(data.id);
      setQrCode(data.totp.qr_code);
      setSecret(data.totp.secret);
      setMessage("สแกน QR นี้ด้วย Google Authenticator แล้วกรอกรหัส 6 หลัก");
    }
    void prepare();
  }, []);

  async function verify(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!factorId) return;
    setBusy(true);
    setMessage("");
    const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId, code });
    setBusy(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    window.location.assign("/e-memo-registry/dashboard");
  }

  return <form onSubmit={verify}>
    {qrCode && <><img src={qrCode} alt="QR code for Google Authenticator" width={220} height={220} style={{ display: "block", margin: "18px auto" }} /><p className="muted">สแกนไม่ได้? เพิ่มคีย์นี้ด้วยตนเอง: <strong>{secret}</strong></p></>}
    <label htmlFor="totp-code">รหัสจาก Google Authenticator</label>
    <input id="totp-code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))} required placeholder="123456" />
    <button type="submit" disabled={busy || !factorId}>{busy ? "กำลังยืนยัน..." : "ยืนยันและเข้าใช้งาน"}</button>
    <p className="error" role="alert">{message}</p>
  </form>;
}
