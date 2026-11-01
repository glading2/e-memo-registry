"use client";
type Row={registry_number:string;subject:string;recipient:string;status:string;issued_at:string};
export default function ReportExport({rows}:{rows:Row[]}){
 function download(){
  const safe=(v:string)=>{const s=/^[=+@\-\t\r]/.test(v)?"'"+v:v;return '"'+s.replace(/"/g,'""')+'"'};
  const lines=[['เลขทะเบียน','เรื่อง','เรียน','สถานะ','วันเวลา'],...rows.map(r=>[r.registry_number,r.subject,r.recipient,r.status,r.issued_at])];
  const csv='\uFEFF'+lines.map(row=>row.map(safe).join(',')).join('\r\n');
  const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));
  const a=document.createElement('a');a.href=url;a.download='memo-report.csv';a.click();URL.revokeObjectURL(url);
 }
 return <button onClick={download}>ดาวน์โหลด CSV สำหรับ Excel</button>;
}
