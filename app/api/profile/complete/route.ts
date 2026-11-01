import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/supabase";

const workGroup = "เวชระเบียนและข้อมูลทางการแพทย์";
const thaiName = /^[\u0E01-\u0E59]+$/u;

const profileSchema = z.object({
  firstName: z.string().trim().min(1).max(120).regex(thaiName, "กรุณากรอกชื่อเป็นภาษาไทย"),
  lastName: z.string().trim().min(1).max(120).regex(thaiName, "กรุณากรอกนามสกุลเป็นภาษาไทย"),
  organization: z.string().trim().min(1).max(200),
  officePhone: z.string().regex(/^\d{4}$/, "กรุณากรอกโทรศัพท์ภายใน 4 หลัก"),
});

export async function POST(request: Request) {
  const parsed = profileSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "ข้อมูลไม่ถูกต้อง" }, { status: 400 });
  }

  const supabase = await db();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });

  const { firstName, lastName, organization, officePhone } = parsed.data;
  const { error } = await supabase
    .from("profiles")
    .update({
      first_name: firstName,
      last_name: lastName,
      full_name: `${firstName} ${lastName}`,
      organization,
      office_phone: officePhone,
      work_group: workGroup,
      onboarding_completed: true,
    })
    .eq("id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
