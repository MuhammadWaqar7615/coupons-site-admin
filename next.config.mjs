const backendUrl = (() => {
  const url = process.env.BACKEND_URL;
  if (url) return url;
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "BACKEND_URL must be set in production. Refusing to start with localhost fallback."
    );
  }
  return "http://localhost:4000";
})();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
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
