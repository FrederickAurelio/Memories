import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export function setCookieSid(
  response: Response,
  cookieStore: ReadonlyRequestCookies,
) {
  const cookieObj: Record<string, string> = {};
  const setCookieHeader = response.headers.get("set-cookie");
  if (setCookieHeader) {
    const cookieArray = setCookieHeader.split(";");
    cookieArray.forEach((cookie) => {
      const [key, value] = cookie.split("=");
      if (key && value) {
        cookieObj[key.trim()] = value.trim();
      }
    });
  }
  cookieStore.set("connect.sid", cookieObj["connect.sid"], {
    expires: new Date(cookieObj["Expires"]),
    path: "/",
    httpOnly: true,
    secure: false,
    maxAge: 60 * 60 * 24 * 14,
  });
}

export function setCookieRecentLogin(
  cookieStore: ReadonlyRequestCookies,
  email: string,
) {
  const recentLogin = cookieStore.get("recent-login") || "";
  let recentLoginArray = recentLogin ? recentLogin.value.split(";") : [];
  if (recentLoginArray.includes(email))
    recentLoginArray = recentLoginArray.filter((s) => s !== email);
  recentLoginArray = [email, ...recentLoginArray];
  recentLoginArray = recentLoginArray.slice(0, 4);
  cookieStore.set("recent-login", recentLoginArray.join(";"), {
    path: "/",
    maxAge: 60 * 60 * 24 * 30 * 2,
  });
}
