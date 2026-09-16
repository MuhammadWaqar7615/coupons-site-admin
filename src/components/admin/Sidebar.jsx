'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AUTH_TOKEN_STORAGE_KEY, LEGACY_AUTH_TOKEN_STORAGE_KEY } from '@/config/auth';

const getPublicSiteUrl = () => {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, '');
  }
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'http://localhost:3000';
  }
  return 'https://coupons-site.vercel.app';
};

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: '⌂' },
  { name: 'SEO Dashboard', href: '/dashboard/seo/dashboard', icon: '◫' },
  { name: 'SEO Settings', href: '/dashboard/seo/global', icon: '⚑' },
  { name: 'Page SEO', href: '/dashboard/seo/pages', icon: '▣' },
  { name: 'Redirects', href: '/dashboard/seo/redirects', icon: '↗' },
  { name: 'Sitemap', href: '/dashboard/seo/sitemap', icon: '⌁' },
  { name: 'Robots.txt', href: '/dashboard/seo/robots', icon: '⎈' },
  { name: 'Coupons', href: '/dashboard/coupons', icon: '◫' },
  { name: 'Categories', href: '/dashboard/categories', icon: '▣' },
  { name: 'Subcategories', href: '/dashboard/subcategories', icon: '▤' },
  { name: 'Sliders', href: '/dashboard/sliders', icon: '▨' },
  { name: 'Main Banner', href: '/dashboard/main-banners', icon: '▤' },
  { name: 'Promo banners', href: '/dashboard/promo-banners', icon: '▣' },
  { name: 'Badges', href: '/dashboard/badges', icon: '★' },
  { name: 'Blog', href: '/dashboard/blog', icon: '✎' },
  { name: 'Users', href: '/dashboard/users', icon: '◔' },
  { name: 'Translations', href: '/dashboard/translations', icon: '文' },
  { name: 'Theme', href: '/dashboard/theme', icon: '◈' },
  { name: 'Email Templates', href: '/dashboard/email-templates', icon: '✉' },
  { name: 'Settings', href: '/dashboard/settings', icon: '⚙' },
  { name: 'Public stores', href: '/negozi', icon: '⌂', isExternal: true },
  { name: 'Public offers', href: '/offerte', icon: '◌', isExternal: true },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const publicSiteUrl = getPublicSiteUrl();

  const handleLogout = async (e) => {
    if (e) e.preventDefault();
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
      window.localStorage.removeItem(LEGACY_AUTH_TOKEN_STORAGE_KEY);
      setIsLoggingOut(false);
      router.push("/account/login");
      router.refresh();
    }
  };

  return (
    <>
      <div className="fixed left-0 right-0 top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 shadow-sm backdrop-blur-sm lg:hidden">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">Admin</p>
          <h1 className="text-lg font-bold text-slate-900">CodiceSconto</h1>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          aria-label="Open sidebar menu"
          aria-expanded={isOpen}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-20 bg-slate-900/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-30 flex h-full w-[280px] -translate-x-full flex-col border-r border-slate-200 bg-white shadow-xl transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:z-10 lg:w-72 lg:translate-x-0 ${isOpen ? 'translate-x-0' : ''}`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">Navigation</p>
            <h1 className="text-lg font-bold text-slate-900">Menu</h1>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 lg:hidden"
            aria-label="Close sidebar menu"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="border-b border-slate-200 bg-slate-50 px-4 py-4">
          <div className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-200">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-lg font-bold text-accent">A</div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">Admin Panel</p>
              <p className="truncate text-xs text-slate-500">Management</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1.5">
            {navItems.map((item) => {
              if (item.isExternal) {
                const externalHref = `${publicSiteUrl}${item.href}`;
                return (
                  <li key={item.name}>
                    <a
                      href={externalHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsOpen(false)}
                      className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600 group-hover:bg-slate-200">
                        {item.icon}
                      </span>
                      <span className="flex-1 text-left">{item.name}</span>
                      <span className="text-xs text-slate-400 group-hover:text-slate-600" title="Opens public site in new tab">↗</span>
                    </a>
                  </li>
                );
              }

              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname === item.href || pathname?.startsWith(`${item.href}/`);

              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                      isActive
                        ? 'bg-accent text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span className="flex-1 text-left">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-slate-200 p-4">
          <form onSubmit={handleLogout}>
            <button
              type="submit"
              disabled={isLoggingOut}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-60 cursor-pointer"
            >
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-red-100 text-xs">↩</span>
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}