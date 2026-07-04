import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const userId = request.cookies.get('user_id')?.value

  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!userId) {
      return NextResponse.redirect(new URL('/sign-in', request.url))
    }
  }

  // Redirect signed-in users away from auth pages
  if (request.nextUrl.pathname === '/sign-in' || request.nextUrl.pathname === '/sign-up') {
    if (userId) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/sign-in', '/sign-up'],
}
