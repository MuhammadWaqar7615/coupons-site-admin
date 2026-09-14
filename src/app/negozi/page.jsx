import { redirect } from "next/navigation";

const getPublicSiteUrl = () => {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, "");
  }
  if (process.env.NODE_ENV === "production") {
    return "https://coupons-site.vercel.app";
  }
  return "http://localhost:3000";
};

export default function NegoziRedirectPage() {
  const publicUrl = getPublicSiteUrl();
  redirect(`${publicUrl}/negozi`);
}
