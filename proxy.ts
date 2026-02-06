// import { NextRequest, NextResponse } from "next/server";

// export const config = {
//   matcher: [
//     "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
//   ],
// };

// export default async function proxy(req: NextRequest) {
//   const url = req.nextUrl;
//   const hostname = req.headers.get("host") || "";

//   const rootDomain = (
//     process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000"
//   ).replace(/^https?:\/\//, "");

//   const currenthost = hostname.replace("www.", "");

//   if (currenthost === rootDomain) {
//     return NextResponse.next();
//   }

//   if (hostname.includes(`.${rootDomain}`)) {

//     const subdomain = hostname.replace(`.${rootDomain}`, "").replace("www.", "");

//     return NextResponse.rewrite(
//       new URL(`/sites/${subdomain}${url.pathname}${url.search}`, req.url)
//     );
//   }

//   return NextResponse.next();
// }

import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};

export default function proxy(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "";

  // 1. LIMPEZA TOTAL DA VARIÁVEL
  const rootDomain = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || "qonvip.com")
    .replace(/^https?:\/\//, "") // Remove https:// se existir
    .replace(/\/$/, "")          // Remove barra final se existir
    .replace("www.", "");        // Remove www. se existir

  // 2. LIMPEZA DO HOSTNAME ATUAL
  const currentHost = hostname.replace("www.", "");

  // 3. SE FOR O APP PRINCIPAL (DASHBOARD)
  if (currentHost === rootDomain) {
    return NextResponse.next();
  }

  // 4. SE FOR UM SUBDOMÍNIO (SITE DE AGÊNCIA)
  // Ex: 'agencia.qonvip.com' -> subdomain vira 'agencia'
  const subdomain = hostname.replace(`.${rootDomain}`, "").replace("www.", "");

  if (subdomain && subdomain !== hostname && subdomain !== rootDomain) {
    // REESCRITA PARA A PASTA DE SITES
    return NextResponse.rewrite(
      new URL(`/sites/${subdomain}${url.pathname}${url.search}`, req.url)
    );
  }

  return NextResponse.next();
}