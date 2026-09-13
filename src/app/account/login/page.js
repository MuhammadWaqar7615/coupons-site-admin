"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { AUTH_TOKEN_STORAGE_KEY } from "@/config/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password: password.trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, data.token);
        }
        router.push("/dashboard");
        router.refresh();
      } else {
        const data = await response.json();
        setError(data.error || "Login failed. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex flex-col min-h-screen bg-section-light">

      <main className="flex-grow flex items-center justify-center font-arial px-4 py-3">
        {/* Login Card */}
        <div className="w-full max-w-[750px] bg-white rounded shadow-sm overflow-hidden">

          {/* Card Content Padding */}
          <div className="px-10 py-12 sm:px-[60px]">

            {/* Logo */}
            <div className="flex justify-center mb-6">
              {/* TODO: Replace placeholder with original image */}
              <img
                src="/images/placeholder.png"
                alt="CodiceSconto Logo"
                className="w-[70px] h-[70px] object-contain"
              />
            </div>

            {/* Title */}
            <h1 className="text-[26px] font-medium text-center text-[#4a4a4a] mb-8">
              Entra su CodiceSconto
            </h1>

            {/* Social Logins */}
            <div className="space-y-3.5">
              <button className="relative w-full flex items-center justify-center border border-[#e0e0e0] rounded py-3 hover:bg-gray-50 transition-colors text-[#555] font-normal text-[15px]">
                <div className="absolute left-4">
                  <svg className="w-[18px] h-[18px] text-[#333]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                  </svg>
                </div>
                Accedi con Facebook
              </button>

              <button className="relative w-full flex items-center justify-center border border-[#e0e0e0] rounded py-3 hover:bg-gray-50 transition-colors text-[#555] font-normal text-[15px]">
                <div className="absolute left-4">
                  <svg className="w-[18px] h-[18px] text-[#333]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                  </svg>
                </div>
                Accedi con Google
              </button>
            </div>

            {/* Divider */}
            <div className="relative flex items-center py-5">
              <div className="flex-grow border-t border-[#e8e8e8]"></div>
              <span className="flex-shrink-0 mx-4 text-[#999] text-[13px]">Oppure</span>
              <div className="flex-grow border-t border-[#e8e8e8]"></div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded">
                {error}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#f8f9fa] rounded px-4 py-3.5 text-[15px] text-[#333] placeholder-[#999] focus:outline-none focus:ring-1 focus:ring-accent"
                  required
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#f8f9fa] rounded px-4 py-3.5 text-[15px] text-[#333] placeholder-[#999] focus:outline-none focus:ring-1 focus:ring-accent"
                  required
                />
              </div>

              <div className="pt-1 pb-3">
                <a href="#" className="inline-flex items-center text-[13px] text-[#777] hover:text-[#555] transition-colors">
                  <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Password dimenticata?
                </a>
              </div>

              {/* Bot Verification Mock */}
              <div className="mb-6">
                <span className="block text-[14px] text-[#444] font-medium mb-1.5">Verifica bot</span>
                <div className="border border-[#e4e4e4] rounded p-2 bg-white flex justify-between items-center h-[74px]">
                  <div className="flex items-center pl-2">
                    <div className="w-[26px] h-[26px] bg-[#22c55e] rounded-full flex items-center justify-center mr-3 flex-shrink-0 shadow-sm">
                      <svg className="w-[14px] h-[14px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <span className="text-[#333] text-[15px] font-normal">Success!</span>
                  </div>

                  <div className="flex flex-col items-end justify-center pr-1 pt-1">
                    <div className="flex items-center mb-[2px]">
                      {/* TODO: Replace placeholder with original image */}
                      <img src="/images/placeholder.png" alt="Cloudflare logo" className="w-[22px] h-[14px] object-contain mr-1 opacity-80" />
                      <span className="text-[10px] font-bold tracking-wide text-[#555]">CLOUDFLARE</span>
                    </div>
                    <div className="text-[9px] text-[#888]">
                      <a href="#" className="hover:underline">Privacy</a> &bull; <a href="#" className="hover:underline">Help</a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full text-white font-medium py-3 rounded text-[16px] transition-colors mt-2 ${
                  isLoading ? "bg-accent-muted cursor-not-allowed" : "bg-accent hover:bg-accent-hover"
                }`}
              >
                {isLoading ? "Accesso in corso..." : "Entra"}
              </button>
            </form>
          </div>

          {/* Registration Footer area attached to card */}
          <div className="bg-primary-dark py-[16px] text-center">
            <p className="text-[15px] text-[#e0e0e0]">
              Non hai un account? <a href="/account/registrati" className="text-white font-bold hover:underline ml-1">REGISTRATI</a>
            </p>
          </div>
        </div>
      </main>

    </div>
  );
}
