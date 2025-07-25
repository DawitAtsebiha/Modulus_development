import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const protectedRoutes = ['/dashboard', '/courses']

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Check if current path is protected
  const isProtectedRoute = protectedRoutes.some(
    route => pathname === route || pathname.startsWith(route + '/')
  )

  console.log(`Middleware: ${pathname}, Protected: ${isProtectedRoute}`) // Add this

  if (!isProtectedRoute) {
    return NextResponse.next()
  }

  // Get token from cookies
  const token = req.cookies.get('token')?.value
  console.log(`Token exists: ${!!token}`) // Add this

  if (!token) {
    console.log(`Redirecting to login from ${pathname}`) // Add this
    return NextResponse.redirect(new URL('/login', req.url))
  }

  try {
    // Use jose for JWT verification in Edge Runtime
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!)
    await jwtVerify(token, secret)
    console.log(`Token valid for ${pathname}`) // Add this
    return NextResponse.next()
  } catch (error) {
    console.log(`Invalid token for ${pathname}`) // Add this
    // Clear invalid token
    const response = NextResponse.redirect(new URL('/login', req.url))
    response.cookies.delete('token')
    return response
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/courses/:path*',
    // Explicitly include the exact paths
    '/dashboard',
    '/courses'
  ]
}