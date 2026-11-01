"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SettingsForm() {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch('/api/settings', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code, name }),
    });
    const result = await response.json();
    setMessage(response.ok ? 'สร้างกลุ่มงานสำเร็จ' : result.error);
    if (response.ok) router.refresh();
  }

  return <form onSubmit={submit}>
    <label>รหัสกลุ่มงาน (A-Z, 0-9, -)</label><input required maxLength={20} value={code} onChange={event => setCode(event.target.value.toUpperCase())} />
    <label>ชื่อกลุ่มงาน</label><input required value={name} onChange={event => setName(event.target.value)} />
    <button>สร้างกลุ่มงาน</button><p>{message}</p>
  </form>;
}
