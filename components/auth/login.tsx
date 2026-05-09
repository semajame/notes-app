"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/supabase/client"
import Link from "next/link"
// Initialize Supabase client with proper cookie handling
const supabase = createClient()

// Rate limiting configuration
const MAX_ATTEMPTS = 5
const WINDOW_MINUTES = 15
const STORAGE_KEY = "login_attempts"

interface LoginAttempt {
  timestamp: number
  email: string
}

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [rateLimited, setRateLimited] = useState(false)
  const [remainingTime, setRemainingTime] = useState(0)

  // Check rate limiting on component mount and email change
  useEffect(() => {
    checkRateLimit()
  }, [email])

  // Check rate limiting on mount regardless of email
  useEffect(() => {
    checkRateLimitOnMount()
  }, [])

  // Timer to update remaining time
  useEffect(() => {
    if (rateLimited && remainingTime > 0) {
      const timer = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            setRateLimited(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [rateLimited, remainingTime])

  const checkRateLimitOnMount = () => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return

    try {
      const attempts: LoginAttempt[] = JSON.parse(stored)
      const now = Date.now()
      const windowMs = WINDOW_MINUTES * 60 * 1000

      // Group attempts by email
      const attemptsByEmail: { [email: string]: LoginAttempt[] } = {}
      attempts.forEach((attempt) => {
        if (!attemptsByEmail[attempt.email]) {
          attemptsByEmail[attempt.email] = []
        }
        attemptsByEmail[attempt.email].push(attempt)
      })

      // Check if any email is currently rate limited
      for (const [emailAddr, emailAttempts] of Object.entries(
        attemptsByEmail
      )) {
        const recentAttempts = emailAttempts.filter(
          (attempt) => now - attempt.timestamp < windowMs
        )

        if (recentAttempts.length >= MAX_ATTEMPTS) {
          const oldestAttempt = Math.min(
            ...recentAttempts.map((a) => a.timestamp)
          )
          const timeLeft = Math.ceil((oldestAttempt + windowMs - now) / 1000)

          // Set the rate limited email in the input and show the warning
          setEmail(emailAddr)
          setRemainingTime(timeLeft)
          setRateLimited(true)
          break // Only show the first rate limited email found
        }
      }
    } catch (err) {
      // If parsing fails, reset
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  const checkRateLimit = () => {
    if (!email) return

    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return

    try {
      const attempts: LoginAttempt[] = JSON.parse(stored)
      const now = Date.now()
      const windowMs = WINDOW_MINUTES * 60 * 1000

      // Filter attempts for current email within time window
      const recentAttempts = attempts.filter(
        (attempt) =>
          attempt.email === email && now - attempt.timestamp < windowMs
      )

      if (recentAttempts.length >= MAX_ATTEMPTS) {
        const oldestAttempt = Math.min(
          ...recentAttempts.map((a) => a.timestamp)
        )
        const timeLeft = Math.ceil((oldestAttempt + windowMs - now) / 1000)
        setRemainingTime(timeLeft)
        setRateLimited(true)
      } else {
        setRateLimited(false)
        setRemainingTime(0)
      }
    } catch (err) {
      // If parsing fails, reset
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  const recordAttempt = () => {
    const stored = localStorage.getItem(STORAGE_KEY)
    const attempts: LoginAttempt[] = stored ? JSON.parse(stored) : []

    attempts.push({ timestamp: Date.now(), email })

    // Keep only recent attempts (last 24 hours)
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000
    const filtered = attempts.filter((attempt) => attempt.timestamp > oneDayAgo)

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (rateLimited) {
      setError(
        `Too many login attempts. Try again in ${Math.ceil(remainingTime / 60)} minutes.`
      )
      return
    }

    setLoading(true)
    setError("")

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        recordAttempt()
        setError(error.message)
        checkRateLimit() // Re-check after recording attempt
      } else {
        // Clear attempts on successful login
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          const attempts: LoginAttempt[] = JSON.parse(stored)
          const filtered = attempts.filter((attempt) => attempt.email !== email)
          localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
        }
        // Redirect to dashboard or home page
        window.location.href = "/dashboard"
      }
    } catch (err) {
      recordAttempt()
      setError("An unexpected error occurred")
      checkRateLimit()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="font-['DM_Serif_Display'] text-3xl font-bold text-[var(--text)]">
            Welcome Back
          </h2>
          <p className="mt-2 text-[var(--muted)]">
            Sign in to your account to continue
          </p>
        </div>

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-[var(--text)]"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                disabled={rateLimited}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg2)] px-4 py-3 text-[var(--text)] placeholder-[var(--muted)] transition-colors focus:border-transparent focus:ring-2 focus:ring-[var(--amber)] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter your email"
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-[var(--text)]"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                disabled={rateLimited}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg2)] px-4 py-3 text-[var(--text)] placeholder-[var(--muted)] transition-colors focus:border-transparent focus:ring-2 focus:ring-[var(--amber)] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter your password"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-lg border border-red-800 bg-red-900/20 p-3 text-center text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Rate Limiting Warning */}
          {rateLimited && (
            <div className="rounded-lg border border-yellow-800 bg-yellow-900/20 p-3 text-center text-sm text-yellow-400">
              <div className="mb-1 flex items-center justify-center">
                <svg
                  className="mr-2 h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Too many login attempts
              </div>
              <p>
                Try again in {Math.ceil(remainingTime / 60)}:
                {(remainingTime % 60).toString().padStart(2, "0")}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || rateLimited}
            className="flex w-full justify-center rounded-lg border border-transparent bg-[var(--amber)] px-4 py-3 text-sm font-medium text-[var(--bg)] shadow-sm transition-colors hover:bg-[var(--amber-dim)] focus:ring-2 focus:ring-[var(--amber)] focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center">
                <svg
                  className="mr-3 -ml-1 h-5 w-5 animate-spin text-[var(--bg)]"
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
                Signing in...
              </div>
            ) : (
              "Sign In"
            )}
          </button>

          {/* Additional Links */}
          <div className="space-y-2 text-center">
            <Link
              href="/forgot-password"
              className="text-sm text-[var(--amber)] transition-colors hover:text-[var(--amber-dim)]"
            >
              Forgot your password?
            </Link>
            <div className="mt-2 text-sm text-[var(--muted)]">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-[var(--amber)] transition-colors hover:text-[var(--amber-dim)]"
              >
                Sign up
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
