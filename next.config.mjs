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

const publicSiteUrl = (() => {
  const url = process.env.NEXT_PUBLIC_SITE_URL;
  if (url) {
    return url.trim().replace(/\/+$/, "");
  }
  if (process.env.NODE_ENV === "production") {
    return "https://coupons-site.vercel.app";
  }
  return "http://localhost:3000";
})();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  skipTrailingSlashRedirect: true,
  async redirects() {
    return [
      {
        source: "/negozi",
        destination: `${publicSiteUrl}/negozi`,
        permanent: false,
      },
      {
        source: "/offerte",
        destination: `${publicSiteUrl}/offerte`,
        permanent: false,
      },
      {
        source: "/offerte/:path*",
        destination: `${publicSiteUrl}/offerte/:path*`,
        permanent: false,
      },
      {
        source: "/dashboard/stores",
        destination: "/dashboard",
        permanent: false,
      },
    ];
  },
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
