"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

type Profile = {
  first_name?: string | null;
  last_name?: string | null;
  position?: string | null;
  work_group?: string | null;
  organization?: string | null;
  office_phone?: string | null;
} | null;

export default function ProfileForm({ userId, email, verified, profile }: { userId: string; email: string; verified: boolean; profile: Profile }) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function saveProfile(formData: FormData) {
    setBusy(true);
    setMessage("");
    const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    const { error } = await supabase.rpc("complete_my_profile", {
      p_first_name: String(formData.get("first_name") || ""),
      p_last_name: String(formData.get("last_name") || ""),
      p_position: String(formData.get("position") || ""),
      p_work_group: String(formData.get("work_group") || ""),
      p_organization: String(formData.get("organization") || ""),
      p_office_phone: String(formData.get("office_phone") || ""),
    });
    setBusy(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    window.location.assign("/e-memo-registry/verify-2fa");
  }

  return <form action={saveProfile} className="register-form">
    <p className="muted">ยืนยันตัวตนด้วย Google แล้ว: <strong>{email || "ไม่พบอีเมล"}</strong> {verified ? "✓" : ""}</p>
    {!verified && <p className="error">ยังยืนยันอีเมล Google ไม่สำเร็จ กรุณาเลือกบัญชี Google ที่ยืนยันอีเมลแล้ว</p>}
    <div className="register-grid">
      <label>ชื่อจริง<input name="first_name" required defaultValue={profile?.first_name ?? ""} /></label>
      <label>นามสกุล<input name="last_name" required defaultValue={profile?.last_name ?? ""} /></label>
    </div>
    <label>ตำแหน่ง<input name="position" required defaultValue={profile?.position ?? ""} /></label>
    <label>กลุ่มงาน / ฝ่าย<input name="work_group" required defaultValue={profile?.work_group ?? ""} /></label>
    <label>หน่วยงาน / องค์กร<input name="organization" required defaultValue={profile?.organization ?? ""} /></label>
    <label>โทรศัพท์ภายใน (4 หลัก)<input name="office_phone" inputMode="numeric" pattern="[0-9]{4}" required defaultValue={profile?.office_phone ?? ""} /></label>
    <button type="submit" className="register-submit" disabled={busy || !verified}>{busy ? "กำลังบันทึก..." : "บันทึกและเข้าใช้งาน"}</button>
    <p className="error" role="alert">{message}</p>
  </form>;
}
