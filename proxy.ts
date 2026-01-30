import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

export async function proxy(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "";
  const currentHost = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000";

  
  const authRoutes = ["/login", "/register", "/forgot-password", "reset-password"];
  const isAuthRoute = authRoutes.some(route => url.pathname.startsWith(route));


  const token = await getToken({ req, secret: process.env.AUTH_SECRET });

  
  if (isAuthRoute && token) {
   
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }


  const isSubdomain = hostname.includes(currentHost) && hostname !== currentHost;

  if (isSubdomain) {
    const subdomain = hostname.replace(`.${currentHost}`, "");
    return NextResponse.rewrite(new URL(`/sites/${subdomain}${url.pathname}`, req.url));
  }

  return NextResponse.next();
}

// import { NextRequest, NextResponse } from "next/server";
// import { getToken } from "next-auth/jwt";

// export const config = {
//   matcher: [
//     /*
//      * Corresponde a todos os caminhos exceto:
//      * - api (rotas de API)
//      * - _next/static (ficheiros estáticos)
//      * - _next/image (ficheiros de otimização de imagem)
//      * - favicon.ico, sitemap.xml (ativos estáticos)
//      */
//     "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml).*)",
//   ],
// };

// export default async function middleware(req: NextRequest) {
//   const url = req.nextUrl;
  
  
//   let hostname = req.headers.get("host")!;


//   const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN;

  
//   const isSubdomain = hostname !== rootDomain;


//   if (isSubdomain) {
   
//     const agencySlug = hostname.replace(`.${rootDomain}`, "");

//     return NextResponse.rewrite(
//       new URL(`/sites/${agencySlug}${url.pathname}`, req.url)
//     );
//   }


//   // Se não é subdomínio, estamos na App principal (localhost:3000 ou meusite.com)
//   const token = await getToken({ req, secret: process.env.AUTH_SECRET });
//   const isAuthenticated = !!token;

//   const authRoutes = ["/login", "/register", "/forgot-password"];
//   const isAuthRoute = authRoutes.some(route => url.pathname.startsWith(route));
//   const isDashboardRoute = url.pathname.startsWith("/dashboard");

//   // CASO A: Utilizador logado a tentar ir para Login -> Manda para Dashboard
//   if (isAuthRoute && isAuthenticated) {
//     return NextResponse.redirect(new URL("/dashboard/events", req.url));
//   }

//   // CASO B: Utilizador NÃO logado a tentar ir para Dashboard -> Manda para Login
//   if (isDashboardRoute && !isAuthenticated) {
//     const loginUrl = new URL("/login", req.url);
//     // Guarda a URL que ele queria ir para redirecionar depois do login
//     loginUrl.searchParams.set("callbackUrl", url.pathname);
//     return NextResponse.redirect(loginUrl);
//   }

//   // Caso contrário (Landing Page, Sobre, Preços, etc.), deixa passar normal
//   return NextResponse.next();
// }