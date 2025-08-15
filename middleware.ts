import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Definir los roles y las rutas restringidas para cada uno
const ROLE_RESTRICTIONS = {
  // Rutas que cada rol NO puede acceder
  secretaria: [
    '/bot',
    '/consultation', 
    '/reports',
    '/services',
  ],
  profesional: [
    '/bot',
    
  ],
  admin_empresa: [
    '/bot', 
  ],
  super_admin: [] // Super admin puede acceder a todo
};

// Función para obtener el rol del usuario
function getUserRole(userCookie: string): string | null {
  try {
    // Decodificar la cookie URL-encoded
    const decodedUser = decodeURIComponent(userCookie);
    
    // Parsear el JSON
    const userData = JSON.parse(decodedUser);
    
    // Extraer el rol desde user.role.name
    return userData?.role?.name || null;
  } catch (error) {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const userToken = request.cookies.get("user");
  const pathname = request.nextUrl.pathname;

  // Si no hay token de usuario, redirigir a login
  if (!userToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Obtener el rol del usuario
  const userRole = getUserRole(userToken.value);
  
  // Si no se puede obtener el rol, permitir acceso (para no romper la funcionalidad)
  if (!userRole) {
    console.log("No se pudo obtener el rol del usuario, permitiendo acceso");
    return NextResponse.next();
  }

  // Verificar si el rol tiene restricciones para esta ruta
  const restrictedRoutes = ROLE_RESTRICTIONS[userRole as keyof typeof ROLE_RESTRICTIONS];
  
  if (restrictedRoutes && restrictedRoutes.length > 0) {
    // Verificar si la ruta actual está restringida para este rol
    const isRestricted = restrictedRoutes.some(restrictedRoute => 
      pathname.startsWith(restrictedRoute)
    );
    
    if (isRestricted) {
      console.log(`Acceso denegado: ${userRole} intentó acceder a ${pathname}`);
      // Redirigir al dashboard si intenta acceder a una ruta restringida
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

// Proteger todas las rutas excepto `/` y `/login`
export const config = {
  matcher: [
    "/((?!login|$|favicon.ico|_next).*)",
  ],
};