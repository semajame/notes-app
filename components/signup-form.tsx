"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { createClient } from "@/supabase/client"
import Link from "next/link"

import { cn } from "@/lib/utils"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { GalleryVerticalEndIcon } from "lucide-react"

// Initialize Supabase client with proper cookie handling
const supabase = createClient()

// Playful SVG mascot characters — inspired by Family wallet's illustrated characters
function MascotLeft() {
  return (
    <svg
      width="320"
      height="320"
      viewBox="0 0 320 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-[320px]"
    >
      {/* Floating decorative elements */}
      {/* Gold coin top-left */}
      <circle cx="38" cy="60" r="18" fill="#F5C842" />
      <circle cx="38" cy="60" r="13" fill="#E8B830" />
      <text
        x="38"
        y="65"
        textAnchor="middle"
        fontSize="11"
        fill="#C49A10"
        fontWeight="700"
      >
        $
      </text>

      {/* Green flower */}
      <circle cx="82" cy="38" r="9" fill="#4CAF72" />
      <circle cx="70" cy="45" r="9" fill="#4CAF72" />
      <circle cx="94" cy="45" r="9" fill="#4CAF72" />
      <circle cx="82" cy="55" r="9" fill="#4CAF72" />
      <circle cx="82" cy="46" r="7" fill="#2E8B50" />

      {/* Blue pencil */}
      <rect
        x="260"
        y="30"
        width="10"
        height="40"
        rx="3"
        fill="#5B9FE8"
        transform="rotate(20 260 30)"
      />
      <polygon
        points="258,68 268,68 263,80"
        fill="#FFD700"
        transform="rotate(20 263 68)"
      />

      {/* Red heart */}
      <path
        d="M240 90 C240 85 233 80 228 85 C223 80 216 85 216 90 C216 100 228 110 228 110 C228 110 240 100 240 90Z"
        fill="#FF6B6B"
      />

      {/* Star sparkles */}
      <path
        d="M200 50 L202 45 L204 50 L209 52 L204 54 L202 59 L200 54 L195 52Z"
        fill="#FFD700"
      />
      <path
        d="M150 30 L151 27 L152 30 L155 31 L152 32 L151 35 L150 32 L147 31Z"
        fill="#FFD700"
      />

      {/* Main mascot — a cute notebook character */}
      {/* Body (rounded notebook) */}
      <rect x="95" y="100" width="130" height="150" rx="20" fill="#5B9FE8" />
      {/* Spiral binding */}
      <rect x="85" y="115" width="18" height="120" rx="9" fill="#4A8FD8" />
      {/* Page lines on notebook */}
      <rect
        x="115"
        y="130"
        width="80"
        height="6"
        rx="3"
        fill="white"
        opacity="0.6"
      />
      <rect
        x="115"
        y="148"
        width="65"
        height="6"
        rx="3"
        fill="white"
        opacity="0.6"
      />
      <rect
        x="115"
        y="166"
        width="72"
        height="6"
        rx="3"
        fill="white"
        opacity="0.6"
      />
      <rect
        x="115"
        y="184"
        width="55"
        height="6"
        rx="3"
        fill="white"
        opacity="0.6"
      />
      {/* Eyes */}
      <circle cx="140" cy="215" r="8" fill="#1a1a1a" />
      <circle cx="180" cy="215" r="8" fill="#1a1a1a" />
      <circle cx="143" cy="212" r="3" fill="white" />
      <circle cx="183" cy="212" r="3" fill="white" />
      {/* Smile */}
      <path
        d="M150 228 Q160 236 172 228"
        stroke="#1a1a1a"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* Little arms */}
      <rect
        x="66"
        y="185"
        width="30"
        height="12"
        rx="6"
        fill="#4A8FE8"
        transform="rotate(-15 66 185)"
      />
      <rect
        x="222"
        y="180"
        width="30"
        height="12"
        rx="6"
        fill="#4A8FE8"
        transform="rotate(15 222 180)"
      />
      {/* Little feet */}
      <ellipse cx="130" cy="258" rx="15" ry="8" fill="#3A7FD5" />
      <ellipse cx="190" cy="258" rx="15" ry="8" fill="#3A7FD5" />
      {/* Shoes */}
      <ellipse cx="130" cy="265" rx="16" ry="9" fill="#FFD166" />
      <ellipse cx="190" cy="265" rx="16" ry="9" fill="#FFD166" />

      {/* Floating elements around mascot */}
      {/* Blue cloud */}
      <ellipse cx="50" cy="180" rx="22" ry="14" fill="#A8CCEE" />
      <ellipse cx="38" cy="175" rx="16" ry="12" fill="#A8CCEE" />
      <ellipse cx="62" cy="174" rx="16" ry="12" fill="#A8CCEE" />

      {/* Small paper note */}
      <rect
        x="240"
        y="150"
        width="50"
        height="60"
        rx="4"
        fill="#FFFDE7"
        stroke="#E8E0C0"
        strokeWidth="1"
      />
      <rect x="248" y="162" width="34" height="3" rx="1.5" fill="#D4C870" />
      <rect x="248" y="172" width="28" height="3" rx="1.5" fill="#D4C870" />
      <rect x="248" y="182" width="32" height="3" rx="1.5" fill="#D4C870" />

      {/* Gear */}
      <circle cx="270" cy="80" r="14" fill="#D0CBBD" />
      <circle cx="270" cy="80" r="8" fill="#FAFAF8" />

      {/* Ethereum-like diamond */}
      <polygon
        points="170,270 180,280 190,270 180,260"
        fill="#627EEA"
        opacity="0.7"
      />

      {/* Orange dot accent */}
      <circle cx="260" cy="230" r="8" fill="#FF8C42" />
      <circle cx="50" cy="130" r="6" fill="#FF6B6B" />
    </svg>
  )
}

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true)
    setError("")
    setSuccess("")

    // Password match validation
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    // Password strength validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        setError(error.message)
        return
      }

      // Supabase may still return a user object
      // even if email already exists depending on settings.
      // This is the safest duplicate check:
      if (data?.user?.identities && data.user.identities.length === 0) {
        setError("Email is already registered")
        return
      }

      setSuccess(
        "Registration successful! Please check your email to confirm your account."
      )
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className={cn(
        "grid w-full max-w-5xl gap-10 overflow-hidden rounded-[2rem] p-6 md:grid-cols-2",
        className
      )}
      {...props}
    >
      <div className="flex flex-col justify-between gap-8 rounded-[1.75rem] bg-background/90 p-6 sm:p-8">
        <div className="space-y-5">
          <div className="bg-amber/10 text-amber ring-amber/20 inline-flex h-12 w-12 items-center justify-center rounded-2xl ring-1">
            <GalleryVerticalEndIcon className="h-6 w-6" />
          </div>
          <div className="space-y-3 text-center md:text-left">
            <p className="text-sm font-semibold tracking-[0.32em] text-primary uppercase">
              Create account
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Start building with your workspace
            </h1>
            <p className="max-w-xl text-sm leading-6 text-muted-foreground">
              Sign up once and enjoy a secure, polished experience with the same
              bright, approachable style used across the app.
            </p>
          </div>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="confirmPassword">
                Confirm Password
              </FieldLabel>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
              />
            </Field>
            {error && (
              <div className="rounded-2xl border border-red-800 bg-red-900/20 p-3 text-center text-sm text-red-400">
                {error}
              </div>
            )}
            {success && (
              <div className="rounded-2xl border border-green-800 bg-green-900/20 p-3 text-center text-sm text-green-400">
                {success}
              </div>
            )}
            <Field>
              <motion.button
                type="submit"
                disabled={loading}
                whileTap={{ scale: 0.98 }}
                whileHover={{ y: -1 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
                className="inline-flex w-full items-center justify-center rounded-lg bg-[#1a1a1a] px-4 py-3 text-sm font-semibold text-white transition-all disabled:opacity-50"
              >
                {loading ? "Creating account..." : "Create Account"}
              </motion.button>
            </Field>
          </FieldGroup>
        </form>

        <div className="space-y-2 text-center md:text-left">
          <FieldDescription>
            Already have an account?{" "}
            <Link className="text-primary" href="/login">
              Sign in
            </Link>
          </FieldDescription>
          <p className="text-sm leading-6 text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <a className="text-primary" href="#">
              Terms of Service
            </a>{" "}
            and{" "}
            <a className="text-primary" href="#">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center rounded-[1.75rem] p-6 sm:p-8">
        <div className="space-y-6 text-center">
          <span className="bg-amber/10 text-amber inline-flex rounded-full px-3 py-1 text-xs font-semibold tracking-[0.32em] uppercase">
            Join the experience
          </span>
          <h2 className="text-3xl font-semibold text-foreground">
            Get started with confidence
          </h2>
          <p className="mx-auto max-w-sm text-sm leading-6 text-muted-foreground">
            A vibrant signup experience with the friendly colors and
            motion-ready polish of the app.
          </p>
          <div className="mx-auto w-full max-w-[320px]">
            <MascotLeft />
          </div>
        </div>
      </div>
    </div>
  )
}
