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

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "qonvip.com";

  const isMainApp = hostname === rootDomain || hostname === `www.${rootDomain}`;

  if (isMainApp) {
    return NextResponse.next();
  }

  const subdomain = hostname.replace(`.${rootDomain}`, "").replace("www.", "");

  if (subdomain && subdomain !== hostname) {
    return NextResponse.rewrite(
      new URL(`/sites/${subdomain}${url.pathname}${url.search}`, req.url),
    );
  }

  return NextResponse.next();
}
