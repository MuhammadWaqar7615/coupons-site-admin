import { cookies } from "next/headers";

export async function backendFetch(path, options = {}) {
  const rawBackendUrl =
    process.env.BACKEND_URL ||
    (process.env.NODE_ENV === "production"
      ? "https://coupons-site-backend.vercel.app"
      : "http://localhost:4000");
  const backendUrl = rawBackendUrl.trim().replace(/\/+$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  const cookieStore = await cookies();
  const headers = {
    cookie: cookieStore.toString(),
    ...(options.headers || {}),
  };

  const res = await fetch(`${backendUrl}${cleanPath}`, {
    cache: "no-store",
    ...options,
    headers,
  });

  return res;
}
