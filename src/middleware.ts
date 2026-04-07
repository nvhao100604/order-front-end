import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const LOGIN_URL = '/auth/login'

export function middleware(request: NextRequest) {
    const token = request.cookies.get('refresh_token')?.value

    if (!token) {
        return NextResponse.redirect(new URL(LOGIN_URL, request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*', '/staff/:path*', '/dashboard/:path*'],
}