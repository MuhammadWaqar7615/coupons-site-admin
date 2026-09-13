"use client";

import React, { startTransition, useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AUTH_TOKEN_STORAGE_KEY } from '@/config/auth';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({ stores: [], coupons: [] });
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    startTransition(() => {
      setIsAuthenticated(Boolean(window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)));
    });
  }, []);

  /**
   * Returns the appropriate text color class for a nav link
   * based on whether it matches the current route.
   */
  const getNavLinkClass = (href) => {
    const isActive = pathname === href || pathname.startsWith(href + '/');
    return isActive
      ? "text-accent hover:text-accent-hover text-[12px] font-bold uppercase tracking-wide"
      : "text-[#666666] hover:text-accent text-[12px] font-bold uppercase tracking-wide";
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.length >= 2) {
        fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
          .then(res => res.json())
          .then(data => {
            setSearchResults(data);
            setIsSearchOpen(true);
            setSelectedIndex(-1);
          })
          .catch(console.error);
      } else {
        setSearchResults({ stores: [], coupons: [] });
        setIsSearchOpen(false);
        setSelectedIndex(-1);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const allSuggestions = [
    ...searchResults.stores.map(s => ({ ...s, url: `/store/${s.slug}`, type: 'store' })),
    ...searchResults.coupons.map(c => ({ ...c, url: `/store/${c.storeId?.slug || ''}`, type: 'coupon' }))
  ];

  const handleKeyDown = (e) => {
    if (!isSearchOpen || allSuggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < allSuggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : allSuggestions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const targetItem = selectedIndex >= 0 ? allSuggestions[selectedIndex] : allSuggestions[0];
      if (targetItem) {
        setIsSearchOpen(false);
        setSearchQuery("");
        router.push(targetItem.url);
      }
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-[#eaeaea]">
      <div className="max-w-[1200px] h-[100px] mx-auto pt-4 px-4 sm:px-6">
        <div className="flex justify-between items-center h-[70px]">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center h-full py-2">
            <Link href="/" className="flex items-center h-full" onClick={() => setIsOpen(false)}>
              <img
                src="/images/logo.png"
                alt="CodiceSconto Logo"
                className="h-[40px] w-auto object-contain hidden sm:block"
              />
            </Link>
          </div>

          {/* Search */}
          <div className="flex-1 mx-4 lg:mx-8 max-w-[450px]" ref={searchRef}>
            <form
              className="w-full flex relative"
              onSubmit={(e) => {
                e.preventDefault();
                handleKeyDown({ key: 'Enter', preventDefault: () => { } });
              }}
            >
              <input
                type="text"
                name="q"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (searchQuery.length >= 2) setIsSearchOpen(true);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Cerca su CodiceSconto"
                className="w-full border border-[#e5e5e5] rounded-[3px] py-[8px] px-4 pr-10 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent text-[13px] text-gray-700 placeholder-gray-400 bg-[#fbfbfb]"
                autoComplete="off"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 bottom-0 text-gray-500 w-10 flex items-center justify-center hover:text-accent"
                aria-label="Cerca"
                onClick={(e) => {
                  e.preventDefault();
                  handleKeyDown({ key: 'Enter', preventDefault: () => { } });
                }}
              >
                <svg className="h-[16px] w-[16px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Live Search Dropdown */}
              {isSearchOpen && allSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white shadow-lg border border-gray-100 rounded-sm overflow-hidden z-50 flex flex-col max-h-[400px] overflow-y-auto">
                  {searchResults.stores.length > 0 && (
                    <div className="p-3 border-b border-gray-100">
                      <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Negozi</div>
                      <div className="space-y-1">
                        {searchResults.stores.map((store, idx) => {
                          const isSelected = selectedIndex === idx;
                          return (
                            <Link
                              key={store._id}
                              href={`/store/${store.slug}`}
                              onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }}
                              className={`flex items-center p-2 rounded-sm transition-colors group ${isSelected ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                            >
                              <div className="w-8 h-8 mr-3 flex items-center justify-center bg-white border border-gray-100 rounded-sm">
                                {store.logoPath ? (
                                  <img src={store.logoPath} alt={store.name} className="max-h-full max-w-full object-contain p-1" />
                                ) : (
                                  <span className="text-[10px] text-gray-400">Logo</span>
                                )}
                              </div>
                              <span className={`text-[13px] font-medium transition-colors ${isSelected ? 'text-accent' : 'text-gray-700 group-hover:text-accent'}`}>{store.name}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {searchResults.coupons.length > 0 && (
                    <div className="p-3">
                      <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Coupon</div>
                      <div className="space-y-1">
                        {searchResults.coupons.map((coupon, idx) => {
                          const globalIdx = searchResults.stores.length + idx;
                          const isSelected = selectedIndex === globalIdx;
                          return (
                            <Link
                              key={coupon._id}
                              href={`/store/${coupon.storeId?.slug || ''}`}
                              onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }}
                              className={`flex items-start p-2 rounded-sm transition-colors group ${isSelected ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                            >
                              <div className="flex-1 min-w-0">
                                <div className={`text-[13px] font-medium truncate transition-colors ${isSelected ? 'text-accent' : 'text-gray-700 group-hover:text-accent'}`}>
                                  {coupon.title}
                                </div>
                                <div className="text-[11px] text-gray-500 truncate mt-0.5">
                                  {coupon.storeId?.name || "Store"} &bull; {coupon.discount}
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </form>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex lg:items-center space-x-[24px]">
            <Link href="/negozi" className={getNavLinkClass("/negozi")}>Negozi</Link>
            <Link href="/offerte" className={getNavLinkClass("/offerte")}>Offerte</Link>
            <Link href="/blog" className={getNavLinkClass("/blog")}>Blog</Link>

            <div className="flex items-center space-x-[8px] pl-[8px]">
              <Link href="/aggiungi-negozio" className="border border-accent text-accent px-[12px] py-[6px] rounded-[3px] text-[11px] font-bold uppercase tracking-wide hover:bg-[#fcfafb] transition-colors">
                Aggiungi negozio
              </Link>
              <Link href={isAuthenticated ? "/dashboard" : "/account/login"} className="bg-primary-dark text-white px-[16px] py-[7px] rounded-[3px] text-[11px] font-bold uppercase tracking-wide hover:bg-primary-dark-hover transition-colors">
                {isAuthenticated ? "Dashboard" : "Accedi"}
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-accent focus:outline-none p-2"
              aria-label="Apri/Chiudi menù"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 absolute w-full shadow-lg z-50">
          <div className="px-4 pt-2 pb-4 space-y-1">
            <Link href="/negozi" onClick={() => setIsOpen(false)} className="block px-3 py-3 rounded-md text-[13px] font-bold uppercase text-gray-800 hover:text-accent hover:bg-gray-50 border-b border-gray-100">Negozi</Link>
            <Link href="/offerte" onClick={() => setIsOpen(false)} className="block px-3 py-3 rounded-md text-[13px] font-bold uppercase text-gray-800 hover:text-accent hover:bg-gray-50 border-b border-gray-100">Offerte</Link>
            <Link href="/blog" onClick={() => setIsOpen(false)} className="block px-3 py-3 rounded-md text-[13px] font-bold uppercase text-gray-800 hover:text-accent hover:bg-gray-50 border-b border-gray-100">Blog</Link>
            <Link href="/aggiungi-negozio" onClick={() => setIsOpen(false)} className="block px-3 py-3 rounded-md text-[13px] font-bold uppercase text-accent hover:bg-gray-50 border-b border-gray-100">Aggiungi negozio</Link>
            <Link href={isAuthenticated ? "/dashboard" : "/account/login"} onClick={() => setIsOpen(false)} className="block text-center mt-3 bg-primary-dark text-white px-3 py-3 rounded-sm text-[13px] font-bold uppercase hover:bg-primary-dark-hover">
              {isAuthenticated ? "Dashboard" : "Accedi"}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;