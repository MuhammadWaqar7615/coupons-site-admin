const backendUrl = (() => {
  const url = process.env.BACKEND_URL;
  if (url) {
    const clean = url.trim().replace(/\/+$/, "");
    // Safety guard: prevent self-referencing redirect loop if set to admin URL
    if (clean.includes("coupons-site-admin.vercel.app")) {
      return clean.replace("coupons-site-admin.vercel.app", "coupons-site-backend.vercel.app");
    }
    return clean;
  }
  if (process.env.NODE_ENV === "production") {
    return "https://coupons-site-backend.vercel.app";
  }
  return "http://localhost:4000";
})();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  skipTrailingSlashRedirect: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
