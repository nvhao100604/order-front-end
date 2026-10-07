import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // Auth validation and role permission checks are managed client-side by ProtectedRoute component
    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*', '/staff/:path*', '/dashboard/:path*'],
}