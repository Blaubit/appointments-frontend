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
    "/support/client",
  ],
  profesional: [
    "/bot",
    "/register",
    "/admin",
    "/billing",
    "/support/admin",
    "/support/client",
    "/reports",
  ],
  admin_empresa: [
    "/bot",
    "/register",
    "/admin",
    "/support/admin",
    "/support/client",
  ],
  super_admin: [],
};

// Detecta un 401 en distintas formas (AxiosError, objeto serializado, Response-like, etc.)
function isUnauthorized(obj: any) {
  if (!obj) return false;

  // axios error shape: err.response.status
  if (obj?.response?.status === 401) return true;

  // some code attach status directly
  if (obj?.status === 401) return true;

  // mensaje que incluye "status code 401" o "401"
  if (typeof obj?.message === "string" && obj.message.includes("401"))
    return true;

  // axios name/code patterns
  if (
    obj?.name === "AxiosError" &&
    (obj?.code === "ERR_BAD_REQUEST" || obj?.code === "ERR_NETWORK")
  ) {
    if (typeof obj?.message === "string" && obj.message.includes("401"))
      return true;
  }

  // si el objeto tiene .statusCode
  if (obj?.statusCode === 401) return true;

  return false;
}

// Construye una respuesta de redirección a /login y borra cookies de sesión/usuario
function redirectToLogin(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/login", request.url));
  // Borra cookies relevantes (añade nombres extra si los usas)
  response.cookies.delete("session");
  response.cookies.delete("user");
  // Si usas otros nombres de cookie de sesión, agrégalos aquí:
  // response.cookies.delete("next-auth.session-token");
  return response;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Llamada a getSession con manejo de excepciones y detección de 401
  let sessionToken: any = null;
  try {
    sessionToken = await getSession();
  } catch (err: any) {
    if (isUnauthorized(err)) {
      return redirectToLogin(request);
    }

    return redirectToLogin(request);
  }
  // Si getSession devolvió un objeto que representa un 401
  if (isUnauthorized(sessionToken)) {
    return redirectToLogin(request);
  }
  // Si NO hay sesión, redirigir a login
  if (!sessionToken) {
    return redirectToLogin(request);
  }
  // Obtener el rol del usuario con manejo de errores y detección de 401
  let userRole: any = null;
  try {
    userRole = await getRoleName();
  } catch (err: any) {
    if (isUnauthorized(err)) {
      return redirectToLogin(request);
    }
    return redirectToLogin(request);
  }

  if (isUnauthorized(userRole)) {
    return redirectToLogin(request);
  }

  if (!userRole) {
    return redirectToLogin(request);
  }

  // Verificar rutas restringidas por rol
  const restrictedRoutes =
    ROLE_RESTRICTIONS[userRole as keyof typeof ROLE_RESTRICTIONS];

  if (restrictedRoutes && restrictedRoutes.length > 0) {
    const isRestricted = restrictedRoutes.some((restrictedRoute) =>
      pathname.startsWith(restrictedRoute)
    );

    if (isRestricted) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }
  return NextResponse.next();
}

// Proteger todas las rutas excepto `/` y `/login`
export const config = {
  matcher: ["/((?!login|$|favicon.ico|favicon.png|_next|api|_vercel).*)"],
};
