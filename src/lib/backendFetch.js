import { cookies } from "next/headers";

export async function backendFetch(path, options = {}) {
  const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";
  const cookieStore = await cookies();
  const headers = {
    cookie: cookieStore.toString(),
    ...(options.headers || {}),
  };

  const res = await fetch(`${backendUrl}${path.startsWith("/") ? "" : "/"}${path}`, {
    cache: "no-store",
    ...options,
    headers,
  });

  return res;
}
