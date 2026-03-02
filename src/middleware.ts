import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const token = request.cookies.get('accessToken')?.value // Lấy token từ cookie
    const { pathname } = request.nextUrl

    const protectedPaths = ['/admin', '/staff', '/dashboard']
    const isProtected = protectedPaths.some(path => pathname.startsWith(path))

    if (isProtected && !token) {
        // Nếu vào route bảo vệ mà không có token, chuyển hướng về login
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*', '/staff/:path*', '/dashboard/:path*'],
}