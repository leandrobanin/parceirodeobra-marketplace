import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

type AppRole = 'CUSTOMER' | 'PROFESSIONAL' | 'ADMIN';

function normalizeRole(role: unknown): AppRole {
  if (role === 'ADMIN' || role === 'PROFESSIONAL') return role;
  return 'CUSTOMER';
}

function redirectToSignIn(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = '/auth';
  url.searchParams.set('mode', 'signin');
  url.searchParams.set('next', `${request.nextUrl.pathname}${request.nextUrl.search}`);
  return NextResponse.redirect(url);
}

export const updateSession = async (request: NextRequest) => {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase URL or publishable key is missing from environment variables.');
  }

  // Create an unmodified response
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    supabaseUrl!,
    supabaseKey!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    },
  );

  // Refresh and validate the session with Supabase Auth.
  const { data: { user } } = await supabase.auth.getUser();
  const pathname = request.nextUrl.pathname;
  const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/');
  const isDashboardRoute = pathname === '/dashboard' || pathname.startsWith('/dashboard/');
  const isProfileRoute = pathname === '/profile';
  const isProtectedRoute = isAdminRoute || isDashboardRoute || isProfileRoute;

  if (!isProtectedRoute) {
    return response;
  }

  if (!user) {
    return redirectToSignIn(request);
  }

  const { data: profile } = await supabase
    .from('User')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();
  const role = normalizeRole(profile?.role);

  if (isAdminRoute && role !== 'ADMIN') {
    const url = request.nextUrl.clone();
    url.pathname = role === 'PROFESSIONAL' ? '/dashboard' : '/';
    url.search = '';
    return NextResponse.redirect(url);
  }

  if (isDashboardRoute && role !== 'PROFESSIONAL' && role !== 'ADMIN') {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    url.search = '';
    return NextResponse.redirect(url);
  }

  return response;
};
