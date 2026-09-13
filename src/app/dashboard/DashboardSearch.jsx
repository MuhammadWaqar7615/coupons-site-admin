"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useCallback } from "react";

const alphabetLetters = ["#", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

export default function DashboardSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [search, setSearch] = useState(() => searchParams.get("search") || "");
  const currentLetter = searchParams.get("letter") || "";

  const updateParams = useCallback(
    (key, value) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router]
  );

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParams("search", search);
  };

  const [isAlphabetOpen, setIsAlphabetOpen] = useState(false);

  return (
    <div className="mb-6 space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
      <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="Search stores by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none w-full"
        />
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            type="submit"
            className="flex-1 sm:flex-none px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-hover transition-colors"
          >
            Search
          </button>
          {searchParams.has("search") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                updateParams("search", "");
              }}
              className="flex-1 sm:flex-none px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </form>

      <div className="mt-4 border-t border-gray-200 pt-4 md:border-none md:pt-0 md:mt-0">
        <button
          type="button"
          onClick={() => setIsAlphabetOpen(!isAlphabetOpen)}
          className="flex md:hidden w-full items-center justify-between bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 shadow-sm"
        >
          <span>Filter Alphabetically {currentLetter ? `(${currentLetter})` : ""}</span>
          <span>
            {isAlphabetOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            )}
          </span>
        </button>

        <div className={`mt-3 md:mt-0 ${isAlphabetOpen ? "block" : "hidden"} md:block`}>
          <div className="hidden md:block text-xs font-semibold text-gray-500 uppercase mb-2">Filter Alphabetically</div>
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => updateParams("letter", "")}
              className={`px-3 py-1 text-xs font-medium rounded border ${!currentLetter ? "bg-accent text-white border-accent" : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"}`}
            >
              All
            </button>
            {alphabetLetters.map((letter) => (
              <button
                key={letter}
                onClick={() => updateParams("letter", letter)}
                className={`px-3 py-1 text-xs font-medium rounded border ${currentLetter === letter ? "bg-accent text-white border-accent" : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"}`}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
