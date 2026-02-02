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
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};

// Mantemos o nome 'proxy' como você indicou que funciona na sua configuração
export async function proxy(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "";

  // Limpeza do protocolo para evitar erros de comparação
  const rootDomain = (
    process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000"
  ).replace(/^https?:\/\//, "");

  const isSubdomain = hostname.includes(rootDomain) && hostname !== rootDomain;

  // --- 1. LÓGICA DE SUBDOMÍNIO (Sites dos Clientes) ---
  if (isSubdomain) {
    const subdomain = hostname.replace(`.${rootDomain}`, "");

    // CORREÇÃO CRÍTICA: Adicionado ${url.search}
    // Isto garante que o token '?c=123' passa para a página final.
    // Sem isto, o RSVP diz "Link Inválido".
    return NextResponse.rewrite(
      new URL(`/sites/${subdomain}${url.pathname}${url.search}`, req.url)
    );
  }

  // --- 2. LÓGICA DE AUTENTICAÇÃO (Painel) ---
  
  // Nota: Se isto retornar null em produção, verifique se AUTH_SECRET 
  // e NEXTAUTH_URL estão definidos nas variáveis da Vercel.
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