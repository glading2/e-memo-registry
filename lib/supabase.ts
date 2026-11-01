import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

type CookieToSet = { name: string; value: string; options: CookieOptions };

export async function db() {
  const jar = await cookies();
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return jar.getAll();
      },
      setAll(items: CookieToSet[]) {
        try {
          items.forEach(({ name, value, options }) => jar.set(name, value, options));
        } catch {
          // Server Components cannot write cookies; middleware or a Route Handler can.
        }
      },
    },
  });
}
