import { NextRequest, NextResponse } from "next/server";
import { parseSetCookie } from "cookie";
import { checkServerSession } from "./lib/api/serverApi";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );

  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (!accessToken) {
    if (refreshToken) {
      const response = NextResponse.next();

      const data = await checkServerSession();

      const setCookie = data.headers["set-cookie"];

      if (setCookie) {
        const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];

        for (const cookieStr of cookieArray) {
          const parsed = parseSetCookie(cookieStr);

          if (parsed.name && parsed.value) {
            response.cookies.set(parsed.name, parsed.value, {
              expires: parsed.expires,
              maxAge: parsed.maxAge,
              httpOnly: parsed.httpOnly,
              secure: parsed.secure,
              path: parsed.path,
              sameSite: parsed.sameSite,
            });
          }
        }
      }

      if (isPublicRoute) {
        return NextResponse.redirect(new URL("/", request.url), {
          headers: response.headers,
        });
      }

      if (isPrivateRoute) {
        return response;
      }
    }

    if (isPublicRoute) {
      return NextResponse.next();
    }

    if (isPrivateRoute) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  if (isPublicRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isPrivateRoute) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
