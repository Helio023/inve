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

export async function proxy(req: NextRequest) {
  const url = req.nextUrl;

  // 1. Definições e Normalização
  const hostname = req.headers.get("host") || "";
  const rootDomain = (
    process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000"
  ).replace(/^https?:\/\//, "");

  const isSubdomain = hostname.includes(rootDomain) && hostname !== rootDomain;

  // 2. Lógica de Autenticação (Permissiva)
  // Usamos AUTH_SECRET ou NEXTAUTH_SECRET (compatibilidade v4/v5)
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  });

  const authRoutes = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ];
  const isAuthRoute = authRoutes.some((route) =>
    url.pathname.startsWith(route),
  );

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/dashboard/events", req.url));
  }

  if (isSubdomain) {
    const subdomain = hostname.replace(`.${rootDomain}`, "");

    // Reescreve mantendo os parâmetros de busca (query params)
    return NextResponse.rewrite(
      new URL(`/sites/${subdomain}${url.pathname}${url.search}`, req.url),
    );
  }

  return NextResponse.next();
}
