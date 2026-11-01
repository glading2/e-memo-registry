# e-Memo Registry — ระบบออกเลขทะเบียนบันทึกข้อความภายใน

โปรเจกต์ต้นแบบเชิงใช้งานจริง (MVP) สำหรับหลายผู้ใช้: Next.js 15, Supabase Auth, PostgreSQL, Storage, RLS.

## ความสามารถ
- เข้าสู่ระบบด้วยอีเมล/รหัสผ่าน (สร้างผู้ใช้โดยผู้ดูแลผ่าน Supabase Dashboard)
- สร้างกลุ่มงานและรหัสกลุ่มงาน (Admin)
- ออกเลข `<CODE>/<NNNN>/<ปี พ.ศ.>` เช่น `IT/0001/2570` โดยใช้เวลา Asia/Bangkok
- แยกเลขตามกลุ่มงานและปีปฏิทิน เริ่มใหม่ 1 มกราคม
- ออกเลขใน transaction พร้อม row lock, unique constraint และ idempotency key
- สมุดทะเบียน ค้นหา รายละเอียด ยกเลิกโดย Admin พร้อมเหตุผลและ audit log
- แนบ PDF/DOCX ไม่บังคับ สูงสุด 10 MB, private bucket
- รายงาน CSV สำหรับเปิดใน Excel

## วิธีติดตั้ง
1. ติดตั้ง Node.js 20+ และสร้างโปรเจกต์ Supabase ที่องค์กรอนุมัติให้ใช้
2. ใน Supabase Dashboard > SQL Editor รันไฟล์ `supabase/migrations/001_initial.sql` **ครั้งเดียว** ในโปรเจกต์ใหม่ (ตรวจสอบก่อนรันบนฐานข้อมูลที่มีอยู่)
3. ใน Supabase Authentication > Users สร้างบัญชีเจ้าหน้าที่และผู้ดูแล (ปิด public sign-up หากไม่ต้องการให้บุคคลภายนอกสมัคร)
4. ใน SQL Editor กำหนดผู้ดูแลคนแรก โดยแทน `ADMIN_EMAIL` ด้วยอีเมลที่สร้างแล้ว:

```sql
insert into public.profiles(id,full_name,role)
select id,'ผู้ดูแลระบบ','admin' from auth.users where email='ADMIN_EMAIL'
on conflict(id) do update set role='admin';
```

5. สำหรับเจ้าหน้าที่ทั่วไป เพิ่ม profile แล้วเพิ่มสมาชิกกลุ่มงาน หลัง Admin สร้างกลุ่มงานผ่านหน้า `/settings`:

```sql
insert into public.profiles(id,full_name,role)
select id,'เจ้าหน้าที่','staff' from auth.users where email='STAFF_EMAIL'
on conflict(id) do nothing;

insert into public.department_members(department_id,user_id)
select d.id,u.id from public.departments d cross join auth.users u
where d.code='IT' and u.email='STAFF_EMAIL'
on conflict do nothing;
```

6. คัดลอก `.env.example` เป็น `.env.local` และกรอก URL กับ Publishable/Anon Key จาก Supabase Dashboard **ห้ามใช้ service_role key ในไฟล์ที่ส่งไป browser**
7. รัน:

```bash
npm install
npm run dev
```

8. เปิด http://localhost:3000 แล้วเข้าสู่ระบบด้วยบัญชีที่สร้าง
9. ก่อน deploy ให้รัน `npm run typecheck` และ `npm run build` แล้วทดสอบตามรายการด้านล่าง

## ทดสอบที่จำเป็นก่อนใช้งานจริง
- เปิดสอง browser session ต่างบัญชี กดออกเลขพร้อมกัน ต้องได้เลขไม่ซ้ำ
- ออกเลขช่วงเปลี่ยนปีตาม Asia/Bangkok (ทดสอบในสภาพแวดล้อมทดสอบ)
- เจ้าหน้าที่ไม่สามารถดูทะเบียนของกลุ่มงานที่ไม่ได้เป็นสมาชิก
- เจ้าหน้าที่ทั่วไปยกเลิกเลขไม่ได้ แต่ Admin ยกเลิกได้พร้อมเหตุผล
- Upload PDF/DOCX และเปิดไฟล์ได้เฉพาะผู้มีสิทธิ์
- ตรวจสอบว่าเลขยกเลิกไม่ถูกนำกลับมาใช้ใหม่
- ตรวจสอบ backup/restore, retention และนโยบายข้อมูลขององค์กร

## ขอบเขต MVP และสิ่งที่ต้องเพิ่มก่อน production
- ยังไม่มีหน้า UI จัดการสมาชิกกลุ่มงาน (เพิ่มผ่าน SQL ตามตัวอย่าง)
- ค้นหาสูงสุด 100 รายการ; รายงานสูงสุด 1,000 รายการ (ต้องเพิ่ม pagination/export แบบ server-side)
- ยังไม่มีการแก้ไขข้อมูลทะเบียนหลังออกเลข, dashboard สถิติขั้นสูง, PDF report และ workflow อนุมัติ
- ไฟล์ตรวจชนิดด้วย MIME ที่ผู้ส่งระบุ; production ควรตรวจ file signature และสแกนมัลแวร์
- เพิ่ม rate limiting, monitoring, CSRF/origin controls ตาม deployment, security review, automated tests, migration pipeline และ backup
- รหัสกลุ่มงานควรกำหนดให้เรียบร้อยก่อนออกเลข; MVP ไม่เปิดให้แก้รหัสเดิม
- รหัสลำดับ 4 หลักเป็น **ขั้นต่ำ**; เมื่อเกิน 9999 ระบบจะใช้ 5 หลักโดยไม่ซ้ำ
- ไฟล์ SQL ยังไม่รวม automatic user provisioning; ต้อง provision profile ตามขั้นตอน

**หมายเหตุ:** โค้ดนี้เป็น MVP สำหรับทดลองและพัฒนาต่อ ไม่ควรใช้กับเอกสารราชการจริงก่อนผ่านการทดสอบ ความปลอดภัย และการอนุมัติของหน่วยงาน
