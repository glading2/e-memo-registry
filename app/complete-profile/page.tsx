import { redirect } from "next/navigation";
import CompleteProfileForm from "@/components/complete-profile-form";
import { requireUser } from "@/lib/auth";

export default async function CompleteProfilePage() {
  const { supabase, user } = await requireUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_completed")
    .eq("id", user.id)
    .single();

  if (profile?.onboarding_completed) redirect("/dashboard");

  return <section className="register-page">
    <div className="register-panel">
      <div className="register-heading">
        <div className="account-icon">◉</div>
        <h1>กรอกข้อมูลผู้ใช้งาน</h1>
        <p>โปรดกรอกข้อมูลให้ครบถ้วนก่อนเข้าใช้งานระบบ</p>
      </div>
      <CompleteProfileForm />
    </div>
  </section>;
}
