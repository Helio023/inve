// import { NextRequest, NextResponse } from "next/server";
// import { getToken } from "next-auth/jwt";

// export const config = {
//   matcher: [
//     "/((?!api|_next/static|_next/image|favicon.ico).*)",
//   ],
// };

// export async function proxy(req: NextRequest) {
//   const url = req.nextUrl;
//   const hostname = req.headers.get("host") || "";
//   const currentHost = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000";

//   const authRoutes = ["/login", "/register", "/forgot-password", "reset-password"];
//   const isAuthRoute = authRoutes.some(route => url.pathname.startsWith(route));

//   const token = await getToken({ req, secret: process.env.AUTH_SECRET });

//   if (isAuthRoute && token) {

//     return NextResponse.redirect(new URL("/dashboard", req.url));
//   }

//   const isSubdomain = hostname.includes(currentHost) && hostname !== currentHost;

//   if (isSubdomain) {
//     const subdomain = hostname.replace(`.${currentHost}`, "");
//     return NextResponse.rewrite(new URL(`/sites/${subdomain}${url.pathname}`, req.url));
//   }

//   return NextResponse.next();
// }





import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (static assets)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};

// Next.js 16 Proxy Convention: Named export 'proxy'
export async function proxy(req: NextRequest) {
  const url = req.nextUrl;
  
  // Normalização do Hostname
  const hostname = req.headers.get("host") || "";

  // Normalização do Domínio Raiz (Remove protocolos se existirem no .env)
  const rootDomain = (
    process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000"
  ).replace(/^https?:\/\//, "");

  // 1. LÓGICA DE SUBDOMÍNIO
  // Verifica se o hostname contém o rootDomain mas não é igual a ele
  // Ex: "agencia.site.com" contem "site.com" mas não é igual
  const isSubdomain = hostname.includes(rootDomain) && hostname !== rootDomain;

  if (isSubdomain) {
    // Remove o domínio raiz para obter o slug (ex: "agencia")
    const subdomain = hostname.replace(`.${rootDomain}`, "");

    // Reescreve para a pasta /sites/[slug] mantendo os parâmetros de URL (?c=...)
    return NextResponse.rewrite(
      new URL(`/sites/${subdomain}${url.pathname}${url.search}`, req.url)
    );
  }

  // 2. LÓGICA DE PROTEÇÃO DE ROTAS (App Principal)
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  const isAuthenticated = !!token;

  const authRoutes = ["/login", "/register", "/forgot-password", "/reset-password"];
  const isAuthRoute = authRoutes.some((route) => url.pathname.startsWith(route));
  const isDashboardRoute = url.pathname.startsWith("/dashboard");

  // Se já está logado e tenta ir ao Login -> Vai para Dashboard
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard/events", req.url));
  }

  // Se NÃO está logado e tenta ir ao Dashboard -> Vai para Login
  if (isDashboardRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", url.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}