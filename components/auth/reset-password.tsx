"use client";

import { Suspense, useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useSearchParams } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
);

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [tokenValid, setTokenValid] = useState(false);

  const searchParams = useSearchParams();
  const accessToken = searchParams.get("access_token");
  const refreshToken = searchParams.get("refresh_token");

  useEffect(() => {
    // If we have tokens in the URL, set the session
    if (accessToken && refreshToken) {
      supabase.auth
        .setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        })
        .then(({ error }) => {
          if (error) {
            setError(
              "Invalid or expired reset link. Please request a new one.",
            );
          } else {
            setTokenValid(true);
          }
        });
    } else {
      setError("No reset token found. Please use the link from your email.");
    }
  }, [accessToken, refreshToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    // Validate password strength
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        setError(error.message);
      } else {
        setMessage(
          "Password updated successfully! You can now sign in with your new password.",
        );
        // Clear the form
        setPassword("");
        setConfirmPassword("");
        // Redirect to login after a delay
        setTimeout(() => {
          window.location.href = "/login";
        }, 3000);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!tokenValid && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="animate-spin mx-auto h-8 w-8 border-4 border-[var(--amber)] border-t-transparent rounded-full"></div>
            <p className="mt-4 text-[var(--muted)]">Verifying reset link...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-bold text-[var(--text)] font-['DM_Serif_Display']">
              Invalid Reset Link
            </h2>
            <p className="mt-2 text-[var(--muted)]">{error}</p>
            <div className="mt-6">
              <a
                href="/forgot-password"
                className="text-[var(--amber)] hover:text-[var(--amber-dim)] transition-colors"
              >
                Request a new reset link
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[var(--text)] font-['DM_Serif_Display']">
            Set New Password
          </h2>
          <p className="mt-2 text-[var(--muted)]">
            Enter your new password below.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[var(--text)] mb-2"
              >
                New Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[var(--bg2)] border border-[var(--border)] rounded-lg text-[var(--text)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--amber)] focus:border-transparent transition-colors"
                placeholder="Enter your new password (min. 6 characters)"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-[var(--text)] mb-2"
              >
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[var(--bg2)] border border-[var(--border)] rounded-lg text-[var(--text)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--amber)] focus:border-transparent transition-colors"
                placeholder="Confirm your new password"
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
            {loading ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-[var(--bg)]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Updating password...
              </div>
            ) : (
              "Update Password"
            )}
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

function ResetPasswordLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="animate-spin mx-auto h-8 w-8 border-4 border-[var(--amber)] border-t-transparent rounded-full"></div>
          <p className="mt-4 text-[var(--muted)]">Verifying reset link...</p>
        </div>
      </div>
    </div>
  );
}

export default function ResetPassword() {
  return (
    <Suspense fallback={<ResetPasswordLoading />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
