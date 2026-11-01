import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const openPaths = ["/e-memo-registry/login", "/e-memo-registry/register", "/e-memo-registry/auth/callback", "/e-memo-registry/verify-2fa"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const appPath = pathname.startsWith("/e-memo-registry") ? pathname : `/e-memo-registry${pathname}`;
  if (openPaths.some((path) => appPath === path || appPath.startsWith(`${path}/`))) return NextResponse.next();

  let response = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookies) => {
          cookies.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookies.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    },
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/e-memo-registry/login", request.url));

  const [{ data: factors }, { data: assurance }] = await Promise.all([
    supabase.auth.mfa.listFactors(),
    supabase.auth.mfa.getAuthenticatorAssuranceLevel(),
  ]);
  const hasVerifiedTotp = factors?.all.some((factor) => factor.factor_type === "totp" && factor.status === "verified");
  if (!hasVerifiedTotp || assurance?.currentLevel !== "aal2") {
    return NextResponse.redirect(new URL("/e-memo-registry/verify-2fa", request.url));
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
