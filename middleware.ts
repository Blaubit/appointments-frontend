import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('user')

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

// Proteger todas las rutas excepto `/` y `/login`
export const config = {
  matcher: [
    /*
      Este patrón excluye `/`, `/login`, y archivos públicos como `/favicon.ico`
      Protege todo lo demás, incluyendo rutas como:
      - /dashboard
      - /appointments
      - /user/profile
    */
    '/((?!login|$|favicon.ico|_next).*)',
  ],
}
