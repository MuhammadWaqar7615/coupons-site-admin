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

export default async function OfferteSubpathRedirectPage({ params }) {
  const publicUrl = getPublicSiteUrl();
  const p = await Promise.resolve(params);
  const slugParts = Array.isArray(p?.slug) ? p.slug.join("/") : p?.slug || "";
  redirect(`${publicUrl}/offerte${slugParts ? `/${slugParts}` : ""}`);
}
