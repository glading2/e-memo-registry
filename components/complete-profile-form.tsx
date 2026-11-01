"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const workGroup = "เวชระเบียนและข้อมูลทางการแพทย์";

export default function CompleteProfileForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [organization, setOrganization] = useState("");
  const [officePhone, setOfficePhone] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");

    const response = await fetch("/e-memo-registry/api/profile/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, organization, officePhone }),
    });
    const result = await response.json();
    if (!response.ok) {
      setMessage(result.error ?? "บันทึกข้อมูลไม่สำเร็จ");
      setBusy(false);
      return;
    }
    router.replace("/dashboard");
    router.refresh();
  }

  return <form className="register-form" onSubmit={submit}>
    <div className="register-grid">
      <label>ชื่อ <em>*</em><input required value={firstName} onChange={event => setFirstName(event.target.value)} /></label>
      <label>นามสกุล <em>*</em><input required value={lastName} onChange={event => setLastName(event.target.value)} /></label>
    </div>
    <label>หน่วยงาน <em>*</em><input required value={organization} onChange={event => setOrganization(event.target.value)} /></label>
    <label>โทรศัพท์ภายใน <em>*</em><input required inputMode="numeric" pattern="[0-9]{4}" maxLength={4} value={officePhone} onChange={event => setOfficePhone(event.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="0000" /></label>
    <label>กลุ่มงาน<input readOnly value={workGroup} /></label>
    <p className="error">{message}</p>
    <button className="register-submit" disabled={busy}>{busy ? "กำลังบันทึก..." : "บันทึกและเข้าใช้งาน"}</button>
  </form>;
}
