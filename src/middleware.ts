import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'
export async function middleware(req: NextRequest) {
    const url = req.nextUrl.clone()
    const token = await getToken({ req })
    if (token && req.nextUrl.pathname === '/login') {
        url.pathname = '/'
        return NextResponse.redirect(url)
    }
}
export const config = {
    matcher: ['/', '/login'],
}
