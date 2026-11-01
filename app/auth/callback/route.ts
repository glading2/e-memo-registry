import { NextResponse } from "next/server";
import { db } from "@/lib/supabase";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") === "/register" ? "/register" : "/dashboard";

  if (code) {
    const supabase = await db();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      if (next === "/register") {
        return NextResponse.redirect(
          new URL("/e-memo-registry/register", request.url),
        );
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("registration_completed_at")
        .eq("id", (await supabase.auth.getUser()).data.user?.id ?? "")
        .maybeSingle();
      return NextResponse.redirect(
        new URL(
          profile?.registration_completed_at
            ? "/e-memo-registry/verify-2fa"
            : "/e-memo-registry/register",
          request.url,
        ),
      );
    }
  }

  return NextResponse.redirect(
    new URL("/e-memo-registry/register?error=google-auth", request.url),
  );
}
