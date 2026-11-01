"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Group = { id: string; name: string; code: string };

export default function MemoForm({ groups }: { groups: Group[] }) {
  const [group, setGroup] = useState(groups[0]?.id ?? '');
  const [subject, setSubject] = useState('');
  const [recipient, setRecipient] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const response = await fetch('/api/memos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Idempotency-Key': crypto.randomUUID() },
        body: JSON.stringify({ department_id: group, subject, recipient, remark: note }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'บันทึกไม่สำเร็จ');
      router.push(`/memos/${result.id}`);
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'เกิดข้อผิดพลาด');
      setBusy(false);
    }
  }

  return <form onSubmit={submit}>
    <label>กลุ่มงาน</label>
    <select required value={group} onChange={event => setGroup(event.target.value)}>
      {groups.map(item => <option key={item.id} value={item.id}>{item.name} ({item.code})</option>)}
    </select>
    <label>เรื่อง *</label><textarea required maxLength={1000} value={subject} onChange={event => setSubject(event.target.value)} />
    <label>เรียน *</label><input required maxLength={300} value={recipient} onChange={event => setRecipient(event.target.value)} />
    <label>หมายเหตุ</label><textarea value={note} onChange={event => setNote(event.target.value)} />
    <p className="error">{error}</p>
    <button disabled={busy || !group}>{busy ? 'กำลังบันทึก...' : 'ยืนยันออกเลขทะเบียน'}</button>
  </form>;
}
