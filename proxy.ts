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

  // 1. Defina quais rotas são exclusivas para VISITANTES
  const authRoutes = ["/login", "/register", "/forgot-password", "reset-password"];
  const isAuthRoute = authRoutes.some(route => url.pathname.startsWith(route));

  // 2. Verificar Sessão
  // Usamos getToken porque no middleware não temos acesso ao banco de dados completo,
  // apenas ao cookie JWT (que é rápido).
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });

  // 3. Lógica de Redirecionamento de Auth
  if (isAuthRoute && token) {
    // Se já está logado e tenta ir para login/register -> Manda pro Dashboard
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // --- Lógica de Subdomínios (Mantém o que já tínhamos) ---
  const isSubdomain = hostname.includes(currentHost) && hostname !== currentHost;

  if (isSubdomain) {
    const subdomain = hostname.replace(`.${currentHost}`, "");
    return NextResponse.rewrite(new URL(`/sites/${subdomain}${url.pathname}`, req.url));
  }

  return NextResponse.next();
}