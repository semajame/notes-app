"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
);

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setError(error.message);
      } else {
        setMessage(
          "If this email is registered, a password reset link has been sent.",
        );
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[var(--text)] font-['DM_Serif_Display']">
            Reset Password
          </h2>
          <p className="mt-2 text-[var(--muted)]">
            Enter your email and we’ll send you a link to reset your password.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[var(--text)] mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[var(--bg2)] border border-[var(--border)] rounded-lg text-[var(--text)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--amber)] focus:border-transparent transition-colors"
                placeholder="Enter your email"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-400 text-sm text-center bg-red-900/20 border border-red-800 rounded-lg p-3">
              {error}
            </div>
          )}

          {message && (
            <div className="text-green-300 text-sm text-center bg-green-900/20 border border-green-800 rounded-lg p-3">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-[var(--bg)] bg-[var(--amber)] hover:bg-[var(--amber-dim)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--amber)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Sending link..." : "Send reset link"}
          </button>

          <div className="text-center text-sm text-[var(--muted)]">
            Remember your password?{" "}
            <a
              href="/login"
              className="text-[var(--amber)] hover:text-[var(--amber-dim)] transition-colors"
            >
              Sign in
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
