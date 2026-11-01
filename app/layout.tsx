import "./globals.css";
import Link from "next/link";
import { db } from "@/lib/supabase";
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const s = await db();
  const {
    data: { user },
  } = await s.auth.getUser();
  return (
    <html lang="th">
      <body>
        <header>
          <strong>e-Memo Registry · ระบบทะเบียนบันทึกข้อความ</strong>
          <nav>
            {user ? (
              <>
                <Link href="/dashboard">ภาพรวม</Link>
                <Link href="/memos/new">ออกเลข</Link>
                <Link href="/memos">สมุดทะเบียน</Link>
                <Link href="/reports">รายงาน</Link>
                <Link href="/settings">ตั้งค่า</Link>
                <form
                  action="/e-memo-registry/auth/signout"
                  method="post"
                  style={{ display: "inline" }}
                >
                  <button style={{ margin: 0, background: "#345979" }}>
                    ออกจากระบบ
                  </button>
                </form>
              </>
            ) : (
              <Link href="/login">เข้าสู่ระบบ</Link>
            )}
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
