// import { NextRequest, NextResponse } from "next/server";

// export const config = {
//   matcher: [
//     "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
//   ],
// };

// export default function middleware(req: NextRequest) {
//   const url = req.nextUrl;
//   const hostname = req.headers.get("host") || "";

//   // 1. Limpa a variável rootDomain de qualquer erro (remove https e www)
//   const rootDomain = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || "qonvip.com")
//     .replace(/^https?:\/\//, "")
//     .replace("www.", "")
//     .split(':')[0]; // Remove porta se houver (localhost:3000)

//   // 2. Limpa o hostname atual para comparação (ignora www)
//   const currentHost = hostname.replace("www.", "").split(':')[0];

//   // 3. Se for o domínio principal ou o www do domínio principal
//   // EX: qonvip.com ou www.qonvip.com -> VAI PARA O DASHBOARD/LANDING PAGE
//   if (currentHost === rootDomain) {
//     return NextResponse.next();
//   }

//   // 4. Lógica de Subdomínio (Site da Agência)
//   // Se hostname for 'agencia-elite.qonvip.com' -> subdomain vira 'agencia-elite'
//   const subdomain = hostname.replace(`.${rootDomain}`, "").replace("www.", "");

//   // Só faz o rewrite se for um subdomínio real e não o próprio domínio
//   if (subdomain && hostname.includes(`.${rootDomain}`)) {
//     return NextResponse.rewrite(
//       new URL(`/sites/${subdomain}${url.pathname}${url.search}`, req.url)
//     );
//   }

//   return NextResponse.next();
// }

import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  // Não faz nada. Deixa o Next.js carregar as rotas normais da pasta /app
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};