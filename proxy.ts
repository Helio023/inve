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


  const rootDomain = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || "qonvip.com")
    .replace(/^https?:\/\//, "")
    .replace("www.", "");

  // 2. Limpa o hostname da requisição atual para comparação
  const currentHost = hostname.replace("www.", "");

  // 3. Se for o domínio principal (App), não faz reescrita
  // Ex: qonvip.com ou www.qonvip.com -> Segue para a pasta /app normal
  if (currentHost === rootDomain) {
    return NextResponse.next();
  }

  // 4. Lógica de Subdomínio (Site da Agência)
  // Se hostname for 'agencia.qonvip.com', o subdomain será 'agencia'
  const subdomain = hostname.replace(`.${rootDomain}`, "").replace("www.", "");

  // Se o subdomínio não for o próprio domínio e não for o hostname inteiro
  if (subdomain && subdomain !== hostname && subdomain !== rootDomain) {
    // REESCRITA INTERNA: agencia.qonvip.com/evento -> /sites/agencia/evento
    return NextResponse.rewrite(
      new URL(`/sites/${subdomain}${url.pathname}${url.search}`, req.url)
    );
  }

  return NextResponse.next();
}