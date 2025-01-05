import {NextRequest, NextResponse} from "next/server";

export async function middleware(request: NextRequest) {
    const protectedPaths = [
        '/upload'
    ]

    const isProtectedPath = protectedPaths.some(path =>
        request.nextUrl.pathname.startsWith(path)
    )

    if (!isProtectedPath) {
        return NextResponse.next()
    }

    const sessionId = request.cookies.get('session_id')

    if (!sessionId) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('callbackUrl', request.url)
        return NextResponse.redirect(loginUrl)
    }

    try {
        const response = await fetch(`/auth/me`, {
            headers: {
                Cookie: `session_id=${sessionId.value}`
            }
        })

        if (!response.ok) {
            const loginUrl = new URL('/login', request.url)
            loginUrl.searchParams.set('callbackUrl', request.url)
            const res = NextResponse.redirect(loginUrl)
            res.cookies.delete('session_id')
            return res
        }

        return NextResponse.next()
    } catch (error) {
        console.error('Auth check failed:', error)
        return NextResponse.next()
    }
}