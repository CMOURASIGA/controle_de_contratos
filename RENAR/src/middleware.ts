import { decode, getToken } from "next-auth/jwt";
import withAuth, { NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { env } from "@/lib/env";

export const customMiddleware = async (request: NextRequestWithAuth) => {
  const session = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET ?? env.NEXTAUTH_SECRET,
  });
  if (session && session.error === "refresh-token-expired") {
    request.cookies.delete("next-auth.session-token");
    request.cookies.delete("__Secure-next-auth.session-token");

    const response = NextResponse.redirect(
      new URL("/denied/token-expired", request.url)
    );

    return response;
  }

  let cookie =
    request.cookies.get("next-auth.session-token") ||
    request.cookies.get("__Secure-next-auth.session-token");
  if (!cookie) {
    /**
     * @summary O NextAuth fragmenta o token em múltiplas partes para garantir que o tamanho total respeite o limite permitido nos cookies.
     * Dessa forma, ele divide o token em fragmentos menores para evitar problemas de armazenamento e compatibilidade.
     */
    const cookies = request.cookies.getAll();

    const fragmentTokenCookies: string[] = cookies
      .filter((cook) => cook.name.includes("next-auth.session-token"))
      .map((cook) => cook.value);
    if (fragmentTokenCookies.length > 0)
      cookie = {
        name: "next-auth.session-token",
        value: fragmentTokenCookies.join(""),
      };
  }

  if (!cookie) return NextResponse.rewrite(new URL("/denied", request.url));

  const token = await decode({
    token: cookie.value,
    secret: process.env.NEXTAUTH_SECRET ?? env.NEXTAUTH_SECRET,
  });

  if (!token) return NextResponse.rewrite(new URL("/denied", request.url));

  return NextResponse.next();
};

export default withAuth(customMiddleware, {
  callbacks: {
    authorized: ({ token }) => !!token,
  },
  secret: process.env.NEXTAUTH_SECRET ?? env.NEXTAUTH_SECRET,
});

export const config = {
  matcher: ["/:path*"],
};
