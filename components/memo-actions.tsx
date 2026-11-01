"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

const basePath = '/e-memo-registry';

export default function MemoActions({ memoId, status }: { memoId: string; status: string }) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();

  async function cancel() {
    if (!reason.trim()) return;
    const response = await fetch(`${basePath}/api/memos/${memoId}/cancel`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ reason }) });
    const result = await response.json();
    if (!response.ok) setError(result.error);
    else router.refresh();
  }

  async function upload() {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${basePath}/api/memos/${memoId}/attachments`, { method: 'POST', body: formData });
    const result = await response.json();
    if (!response.ok) setError(result.error);
    else router.refresh();
  }

  return <><h2>แนบไฟล์ (ไม่บังคับ)</h2><input type="file" accept=".pdf,.docx" onChange={event => setFile(event.target.files?.[0] ?? null)} /><button onClick={upload} disabled={!file}>อัปโหลดไฟล์</button>{status === 'issued' && <><h2>ยกเลิกเลขทะเบียน (ผู้ดูแลระบบ)</h2><input value={reason} onChange={event => setReason(event.target.value)} placeholder="เหตุผลการยกเลิก" /><button className="danger" onClick={cancel}>ยืนยันยกเลิก</button></>}<p className="error">{error}</p></>;
}

MemoActions.Download = function Download({ path }: { path: string }) {
  const [error, setError] = useState('');
  async function go() {
    const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    const { data, error } = await supabase.storage.from('memo-files').createSignedUrl(path, 60);
    if (error) setError(error.message);
    else window.open(data.signedUrl, '_blank', 'noopener,noreferrer');
  }
  return <><button onClick={go}>เปิดไฟล์</button><span className="error">{error}</span></>;
};
