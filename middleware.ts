import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getRoleName } from "./actions/user/getRoleName";
import { getSession } from "./actions/auth";

// Rutas restringidas por rol
const ROLE_RESTRICTIONS = {
  secretaria: [
    "/bot",
    "/consultation",
    "/reports",
    "/services",
    "/register",
    "/admin",
    "/billing",
    "/support/admin",
  ],
  profesional: ["/bot", "/register", "/admin", "/billing", "/support/admin"],
  admin_empresa: ["/bot", "/register", "/admin", "/support/admin"],
  super_admin: [],
};

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  // Obtener sesión
  const sessionToken = await getSession();

  // Si NO hay sesión, redirigir a login
  if (!sessionToken) {
    console.log("No hay sesión, redirigiendo a /login");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Obtener el rol del usuario
  const userRole = await getRoleName();

  // Si NO se puede obtener el rol, redirigir a login (seguridad)
  if (!userRole) {
    console.log("No se pudo obtener el rol del usuario, redirigiendo a /login");

    // Crear respuesta de redirección
    const response = NextResponse.redirect(new URL("/login", request.url));
    // Limpiar cookies en la respuesta
    response.cookies.delete("session");
    response.cookies.delete("user");
    return response;
  }

  // Verificar rutas restringidas por rol
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

  console.log(`Acceso permitido: ${userRole} puede acceder a ${pathname}`);
  return NextResponse.next();
}

// Proteger todas las rutas excepto `/` y `/login`
export const config = {
  matcher: ["/((?!login|$|favicon.ico|favicon.png|_next|api|_vercel).*)"],
};
