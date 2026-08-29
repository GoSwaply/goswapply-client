import { NextResponse, type NextRequest } from "next/server";

/**
 * Server-side gate for the signed-in area.
 *
 * The dashboard routes are statically prerendered, so their HTML was served to
 * anyone who requested the URL — a crawler or a compliance reviewer saw the
 * full page before the client-side auth check in the layout ever ran. That
 * check only redirects after hydration, which is too late to stop the content
 * being delivered.
 *
 * Running at the edge means an unauthenticated request is redirected before
 * any markup is sent.
 *
 * This is a gate, not an authorisation decision: it checks that a session
 * cookie is present, not that it is valid. Signature verification would need
 * the JWT secret, which must never reach the client bundle. Every piece of
 * real data still comes from the API, which verifies the token properly — so a
 * forged cookie gets an empty shell and 401s from every request it makes.
 */
const PROTECTED_PATHS = [
  "/dashboard",
  "/wallet",
  "/profile",
  "/airtime",
  "/data",
  "/electricity",
  "/cable",
  "/flights",
  // Restricted categories: deliberately unreachable without a session, so they
  // cannot be crawled or surfaced during platform review.
  "/betting",
  "/crypto",
  "/giftcards",
];

/** Categories that must never be indexed, even if a link leaks. */
const NO_INDEX_PATHS = ["/betting", "/crypto", "/giftcards"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
  if (!isProtected) return NextResponse.next();

  const hasSession = Boolean(request.cookies.get("access_token")?.value);

  if (!hasSession) {
    const signIn = new URL("/login", request.url);
    // Carry the destination so signing in lands where they were headed.
    signIn.searchParams.set("next", pathname);
    const redirect = NextResponse.redirect(signIn);
    redirect.headers.set("X-Robots-Tag", "noindex, nofollow");
    return redirect;
  }

  const response = NextResponse.next();
  // The signed-in area is private; nothing here belongs in a search index.
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  if (NO_INDEX_PATHS.some((p) => pathname.startsWith(p))) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  }
  return response;
}

export const config = {
  /*
   * Everything except Next internals and static assets. Public pages fall
   * through untouched because they are not in PROTECTED_PATHS.
   */
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.jpg|.*\\.svg).*)"],
};
