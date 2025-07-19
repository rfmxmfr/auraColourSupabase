import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  // Refresh session if expired
  const { data: { session } } = await supabase.auth.getSession();
  
  // Check for protected routes
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');
  
  if (isAdminRoute) {
    if (!session) {
      // Redirect to login if no session
      const redirectUrl = new URL('/login', req.url);
      redirectUrl.searchParams.set('redirect', req.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }
    
    // Check if user has admin role
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single();
    
    if (!profile || profile.role !== 'admin') {
      // Redirect to home if not admin
      return NextResponse.redirect(new URL('/', req.url));
    }
  }
  
  return res;
}

export const config = {
  matcher: ['/admin/:path*', '/report/:path*'],
};