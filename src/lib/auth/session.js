import { decodeJwt } from "jose";
import { cookies } from "next/headers";

export async function getSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  if (!sessionCookie) return null;

  try {
    const payload = decodeJwt(sessionCookie);
    if (!payload || !payload.exp || payload.exp * 1000 < Date.now()) {
      return null;
    }
    return payload;
  } catch (error) {
    return null;
  }
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}
