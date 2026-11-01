import { NextResponse } from "next/server";
import { db } from "@/lib/supabase";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (code) {
    const supabase = await db();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error)
      return NextResponse.redirect(
        new URL("/dashboard", request.url),
      );
  }

  return NextResponse.redirect(
    new URL("/register?error=google-auth", request.url),
  );
}
