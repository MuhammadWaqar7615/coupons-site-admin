"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AUTH_TOKEN_STORAGE_KEY, LEGACY_AUTH_TOKEN_STORAGE_KEY } from "@/config/auth";

export default function LogoutButton({ className, children }) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async (e) => {
    e.preventDefault();
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout request error:", err);
    } finally {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
        window.localStorage.removeItem(LEGACY_AUTH_TOKEN_STORAGE_KEY);
      }
      setIsLoggingOut(false);
      router.push("/account/login");
      router.refresh();
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={className || "w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm text-center disabled:opacity-60 cursor-pointer"}
    >
      {isLoggingOut ? "Logging out..." : (children || "Logout")}
    </button>
  );
}
