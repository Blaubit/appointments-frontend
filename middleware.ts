import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getRoleName } from "./actions/user/getRoleName";

// Rutas restringidas por rol
const ROLE_RESTRICTIONS = {
  secretaria: [
    "/bot",
    "/consultation",
    "/reports",
    "/services",
    "/register",
    "/admin",
  ],
  profesional: ["/bot", "/register", "/admin"],
  admin_empresa: ["/bot", "/register", "/admin"],

  super_admin: [],
};

export async function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get("session")?.value;
  const pathname = request.nextUrl.pathname;

  // Si no hay token de sesión, redirigir a login
  if (!sessionToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Obtener el rol desde el token
  const userRole = await getRoleName();

  // Si no se puede obtener el rol, permitir acceso
  if (!userRole) {
    console.log("No se pudo obtener el rol del usuario, permitiendo acceso");
    return NextResponse.redirect(new URL("/login", request.url));
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
