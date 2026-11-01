"use client";

import Link from 'next/link';
import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [identity, setIdentity] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const email = identity.trim().toLowerCase();
    if (!email.includes('@')) {
      setError('กรุณากรอกอีเมลที่ใช้สมัครสมาชิก');
      return;
    }
    const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else { router.push('/dashboard'); router.refresh(); }
  }

  return <form className="login-form" onSubmit={submit}>
    <label>อีเมล<input suppressHydrationWarning required type="email" autoComplete="email" value={identity} onChange={event => setIdentity(event.target.value)} placeholder="name@example.com" /></label>
    <label>รหัสผ่าน<input suppressHydrationWarning required type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} placeholder="รหัสผ่าน" /></label>
    <div className="login-options"><label><input suppressHydrationWarning type="checkbox" /> จดจำการเข้าสู่ระบบ</label><a href="#">ลืมรหัสผ่าน?</a></div>
    <p className="error">{error}</p><button suppressHydrationWarning className="login-submit">→ &nbsp; เข้าสู่ระบบ</button>
    <div className="login-divider"><span>หรือ</span></div>
    <Link className="register-link" href="/register">♙ &nbsp; สมัครสมาชิก</Link>
  </form>;
}
