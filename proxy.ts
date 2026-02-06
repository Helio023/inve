// import { NextRequest, NextResponse } from "next/server";

// export const config = {
//   matcher: [
//     "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
//   ],
// };

// export default function proxy(req: NextRequest) {
//   const url = req.nextUrl;

//   const host = req.headers.get("host")?.split(":")[0] || "";

//   const rootDomain = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || "qonvip.com")
//     .replace(/^https?:\/\//, "")
//     .replace("www.", "");

//   const currentHost = host.replace("www.", "");

//   if (currentHost.endsWith("localhost")) {
//     const subdomain = currentHost.replace(".localhost", "");

//     if (subdomain !== "localhost") {
//       return NextResponse.rewrite(
//         new URL(`/sites/${subdomain}${url.pathname}${url.search}`, req.url),
//       );
//     }
//     return NextResponse.next();
//   }

//   if (currentHost === rootDomain) {
//     return NextResponse.next();
//   }

//   if (currentHost.endsWith(`.${rootDomain}`)) {
//     const subdomain = currentHost.replace(`.${rootDomain}`, "");

//     return NextResponse.rewrite(
//       new URL(`/sites/${subdomain}${url.pathname}${url.search}`, req.url),
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

export default function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const host = req.headers.get("host") || "";


  const rootDomain = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || "qonvip.com")
    .replace(/^https?:\/\//, "")
    .replace("www.", "")
    .split(':')[0];


  const currentHost = host.replace("www.", "").split(':')[0];


  if (
    url.pathname.includes(".") || 
    url.pathname.startsWith("/_next") ||
    url.pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }


  if (currentHost.endsWith("localhost")) {
    const subdomain = currentHost.replace(".localhost", "");

    if (subdomain !== "localhost") {
      return NextResponse.rewrite(
        new URL(`/sites/${subdomain}${url.pathname}${url.search}`, req.url)
      );
    }
    return NextResponse.next();
  }

  if (currentHost === rootDomain) {
    return NextResponse.next();
  }

  if (currentHost.endsWith(`.${rootDomain}`)) {
    const subdomain = currentHost.replace(`.${rootDomain}`, "");

    return NextResponse.rewrite(
      new URL(`/sites/${subdomain}${url.pathname}${url.search}`, req.url)
    );
  }

  return NextResponse.next();
}