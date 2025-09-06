import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rutas restringidas por rol
const ROLE_RESTRICTIONS = {
  secretaria: ["/bot", "/consultation", "/reports", "/services", "/register"],
  profesional: ["/bot", " /register"],
  admin_empresa: ["/bot", " /register"],
  super_admin: [],
};

// Decodifica el payload del JWT
function parseJwt(token: string): any {
  try {
    const base64Payload = token.split(".")[1];
    const payload = Buffer.from(base64Payload, "base64").toString();
    return JSON.parse(payload);
  } catch (error) {
    return null;
  }
}

// Obtiene el rol desde el token JWT
function getUserRole(sessionToken: string): string | null {
  const payload = parseJwt(sessionToken);
  return payload?.role || null;
}

export function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get("session")?.value;
  const pathname = request.nextUrl.pathname;

  // Si no hay token de sesión, redirigir a login
  if (!sessionToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Obtener el rol desde el token
  const userRole = getUserRole(sessionToken);

  // Si no se puede obtener el rol, permitir acceso
  if (!userRole) {
    console.log("No se pudo obtener el rol del usuario, permitiendo acceso");
    return NextResponse.next();
  }

  // Verificar rutas restringidas
  const restrictedRoutes =
    ROLE_RESTRICTIONS[userRole as keyof typeof ROLE_RESTRICTIONS];
  if (restrictedRoutes && restrictedRoutes.length > 0) {
    const isRestricted = restrictedRoutes.some((restrictedRoute) =>
      pathname.startsWith(restrictedRoute)
    );
    if (isRestricted) {
      console.log(`Acceso denegado: ${userRole} intentó acceder a ${pathname}`);
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

// Proteger todas las rutas excepto `/` y `/login`
export const config = {
  matcher: ["/((?!login|$|favicon.ico|_next).*)"],
};
