"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

const usernamePattern = /^[a-z0-9_-]{3,32}$/;
const passwordPattern = /^(?=.*[a-z])(?=.*\d)[a-z\d]{6,}$/;
const thaiPattern = /^[ก-๙]+$/;
const phonePattern = /^\d{4}$/;

export default function RegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [position, setPosition] = useState("");
  const [workGroup, setWorkGroup] = useState("");
  const [organization, setOrganization] = useState("");
  const [officePhone, setOfficePhone] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const data = {
      username: username.trim().toLowerCase(),
      email: email.trim().toLowerCase(),
      password,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      position: position.trim(),
      workGroup: workGroup.trim(),
      organization: organization.trim(),
      officePhone: officePhone.trim(),
    };
    if (!usernamePattern.test(data.username))
      return setMessage(
        "Username ใช้ a-z, 0-9, _ หรือ - ความยาว 3–32 ตัวอักษร",
      );
    if (!/^\S+@\S+\.\S+$/.test(data.email))
      return setMessage("กรุณากรอกอีเมลให้ถูกต้อง");
    if (!passwordPattern.test(data.password))
      return setMessage(
        "รหัสผ่านต้องมี a-z และตัวเลขเท่านั้น และยาวอย่างน้อย 6 ตัวอักษร",
      );
    if (data.password !== confirmPassword)
      return setMessage("ยืนยันรหัสผ่านไม่ตรงกัน");
    if (!thaiPattern.test(data.firstName) || !thaiPattern.test(data.lastName))
      return setMessage("ชื่อและนามสกุลต้องเป็นภาษาไทยเท่านั้น");
    if (!data.position || !data.workGroup || !data.organization)
      return setMessage("กรุณากรอกตำแหน่ง กลุ่มงาน และหน่วยงาน");
    if (!phonePattern.test(data.officePhone))
      return setMessage("กรุณากรอกโทรศัพท์หน่วยงานเป็นตัวเลข 4 หลัก");
    setBusy(true);
    setMessage("");
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          username: data.username,
          first_name: data.firstName,
          last_name: data.lastName,
          position: data.position,
          work_group: data.workGroup,
          organization: data.organization,
          office_phone: data.officePhone,
        },
      },
    });
    setBusy(false);
    setMessage(error ? error.message : "สมัครสมาชิกสำเร็จ กรุณาเข้าสู่ระบบ");
  }

  async function signInWithGoogle() {
    setBusy(true);
    setMessage("");
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setBusy(false);
      setMessage(error.message);
    }
  }

  return (
    <form className="register-form" onSubmit={submit}>
      <div className="register-grid">
        <label>
          ชื่อ <em>*</em>
          <input
            required
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            placeholder="กรอกชื่อ"
          />
        </label>
        <label>
          นามสกุล <em>*</em>
          <input
            required
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            placeholder="กรอกนามสกุล"
          />
        </label>
      </div>
      <label>
        ชื่อผู้ใช้ <em>*</em>
        <div style={{ position: "relative" }}>
          <span
            style={{
              position: "absolute",
              left: 13,
              top: 8,
              color: "#526585",
              fontSize: 19,
              fontWeight: 700,
            }}
          >
            @
          </span>
          <input
            style={{ paddingLeft: 34 }}
            required
            autoComplete="username"
            value={username}
            onChange={(event) =>
              setUsername(event.target.value.replace(/^@+/, ""))
            }
            placeholder="กำหนดชื่อผู้ใช้"
          />
        </div>
      </label>
      <label>
        อีเมล <em>*</em>
        <input
          required
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="name@example.com"
        />
      </label>
      <label>
        รหัสผ่าน <em>*</em>
        <input
          required
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="อย่างน้อย 6 ตัวอักษร"
        />
        <small>ใช้ a-z และตัวเลขเท่านั้น โดยต้องมีทั้งตัวอักษรและตัวเลข</small>
      </label>
      <label>
        ยืนยันรหัสผ่าน <em>*</em>
        <input
          required
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          placeholder="กรอกรหัสผ่านอีกครั้ง"
        />
      </label>
      <div className="register-grid">
        <label>
          กลุ่มงาน <em>*</em>
          <input
            required
            value={workGroup}
            onChange={(event) => setWorkGroup(event.target.value)}
            placeholder="เช่น กลุ่มงานสารบรรณ"
          />
        </label>
        <label>
          ตำแหน่ง <em>*</em>
          <input
            required
            value={position}
            onChange={(event) => setPosition(event.target.value)}
            placeholder="เช่น เจ้าหน้าที่"
          />
        </label>
      </div>
      <label>
        หน่วยงาน <em>*</em>
        <input
          required
          value={organization}
          onChange={(event) => setOrganization(event.target.value)}
          placeholder="กรอกชื่อหน่วยงาน"
        />
      </label>
      <label>
        โทรศัพท์หน่วยงาน <em>*</em>
        <input
          required
          type="tel"
          inputMode="numeric"
          pattern="[0-9]{4}"
          maxLength={4}
          value={officePhone}
          onChange={(event) =>
            setOfficePhone(event.target.value.replace(/\D/g, "").slice(0, 4))
          }
          placeholder="0000"
        />
      </label>
      <p className="error">{message}</p>
      <button className="register-submit" disabled={busy}>
        {busy ? "กำลังสมัคร..." : "♙  สมัครสมาชิก"}
      </button>
      <button
        type="button"
        className="register-submit"
        disabled={busy}
        onClick={signInWithGoogle}
        style={{
          marginTop: 10,
          background: "#fff",
          border: "1px solid #b9c8de",
          color: "#1d3152",
          boxShadow: "none",
        }}
      >
        G&nbsp;&nbsp;สมัครด้วย Google
      </button>
      <p className="signin-link">
        มีบัญชีอยู่แล้ว? <Link href="/login">เข้าสู่ระบบ</Link>
      </p>
    </form>
  );
}
