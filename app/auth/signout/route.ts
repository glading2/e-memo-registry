import { db } from "@/lib/supabase";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
  const s = await db();
  await s.auth.signOut();
  return NextResponse.redirect(new URL("/e-memo-registry/login", req.url), 303);
}
