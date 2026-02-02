import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};

export async function proxy(req: NextRequest) {
  const url = req.nextUrl;

  const hostname = req.headers.get("host") || "";
  const rootDomain = (
    process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000"
  ).replace(/^https?:\/\//, "");

  const isSubdomain = hostname.includes(rootDomain) && hostname !== rootDomain;

  if (isSubdomain) {
    const subdomain = hostname.replace(`.${rootDomain}`, "");

    return NextResponse.rewrite(
      new URL(`/sites/${subdomain}${url.pathname}${url.search}`, req.url),
    );
  }

  return NextResponse.next();
}
