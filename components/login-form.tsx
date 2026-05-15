"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { GalleryVerticalEndIcon } from "lucide-react"
import { createClient } from "@/supabase/client"
import Link from "next/link"
import { useState } from "react"

// Initialize Supabase client with proper cookie handling
const supabase = createClient()

// Playful SVG mascot characters — inspired by Family wallet's illustrated characters

function MascotRight() {
  return (
    <svg
      width="300"
      height="300"
      viewBox="0 0 300 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-[300px]"
    >
      {/* Gold coin */}
      <circle cx="250" cy="55" r="18" fill="#F5C842" />
      <circle cx="250" cy="55" r="13" fill="#E8B830" />

      {/* Red flower cloud mascot */}
      <circle cx="220" cy="80" r="22" fill="#FF7B7B" />
      <circle cx="200" cy="68" r="20" fill="#FF7B7B" />
      <circle cx="240" cy="65" r="20" fill="#FF7B7B" />
      <circle cx="210" cy="55" r="18" fill="#FF7B7B" />
      <circle cx="232" cy="52" r="18" fill="#FF7B7B" />
      {/* Cute face on red cloud */}
      <circle cx="210" cy="73" r="5" fill="#1a1a1a" />
      <circle cx="228" cy="73" r="5" fill="#1a1a1a" />
      <path
        d="M212 82 Q220 88 228 82"
        stroke="#1a1a1a"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      {/* Little legs */}
      <rect x="205" y="99" width="8" height="20" rx="4" fill="#FF6060" />
      <rect x="220" y="99" width="8" height="20" rx="4" fill="#FF6060" />

      {/* Green oval mascot */}
      <ellipse cx="80" cy="140" rx="38" ry="28" fill="#4CAF72" />
      {/* Eyes */}
      <circle cx="70" cy="138" r="5" fill="#1a1a1a" />
      <circle cx="90" cy="138" r="5" fill="#1a1a1a" />
      {/* Happy smile */}
      <path
        d="M68 148 Q80 156 92 148"
        stroke="#1a1a1a"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      {/* Little legs */}
      <rect x="65" y="167" width="8" height="18" rx="4" fill="#3A8F58" />
      <rect x="82" y="167" width="8" height="18" rx="4" fill="#3A8F58" />

      {/* Orange triangle mascot */}
      <polygon points="175,210 215,210 195,170" fill="#FF9F43" />
      {/* Face */}
      <circle cx="188" cy="200" r="4" fill="#1a1a1a" />
      <circle cx="202" cy="200" r="4" fill="#1a1a1a" />
      <path
        d="M187 207 Q195 213 203 207"
        stroke="#1a1a1a"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* Legs */}
      <rect x="183" y="208" width="7" height="18" rx="3.5" fill="#E8902E" />
      <rect x="200" y="208" width="7" height="18" rx="3.5" fill="#E8902E" />

      {/* Gold padlock */}
      <rect x="128" y="95" width="32" height="28" rx="5" fill="#F5C842" />
      <path
        d="M134 95 C134 85 158 85 158 95"
        stroke="#D4A820"
        strokeWidth="5"
        fill="none"
      />
      <circle cx="144" cy="110" r="5" fill="#D4A820" />

      {/* Blue magnifier */}
      <circle
        cx="160"
        cy="180"
        r="18"
        fill="none"
        stroke="#5B9FE8"
        strokeWidth="4"
      />
      <line
        x1="173"
        y1="193"
        x2="185"
        y2="205"
        stroke="#5B9FE8"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Checkmark badge */}
      <circle cx="255" cy="145" r="18" fill="#4CAF72" />
      <path
        d="M245 145 L252 153 L266 137"
        stroke="white"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Chat bubble */}
      <rect x="30" y="70" width="45" height="32" rx="8" fill="#A8CCEE" />
      <circle cx="42" cy="86" r="3" fill="#5B9FE8" />
      <circle cx="52" cy="86" r="3" fill="#5B9FE8" />
      <circle cx="62" cy="86" r="3" fill="#5B9FE8" />
      <polygon points="40,102 50,102 40,112" fill="#A8CCEE" />

      {/* Star sparkles */}
      <path
        d="M120 55 L122 50 L124 55 L129 57 L124 59 L122 64 L120 59 L115 57Z"
        fill="#FFD700"
      />
      <path
        d="M48 180 L49 177 L50 180 L53 181 L50 182 L49 185 L48 182 L45 181Z"
        fill="#FFD700"
      />
      <path
        d="M270 190 L271 187 L272 190 L275 191 L272 192 L271 195 L270 192 L267 191Z"
        fill="#FFD700"
      />

      {/* Cat face emoji-like */}
      <rect
        x="90"
        y="215"
        width="50"
        height="50"
        rx="10"
        fill="#F4DEB8"
        stroke="#E8C990"
        strokeWidth="1"
      />
      <circle cx="108" cy="235" r="4" fill="#FF8C42" />
      <circle cx="122" cy="235" r="4" fill="#FF8C42" />
      <path
        d="M108 245 Q115 250 122 245"
        stroke="#FF8C42"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* Small pill/capsule */}
      <rect x="240" y="200" width="40" height="16" rx="8" fill="#A8CCEE" />
      <rect x="240" y="200" width="20" height="16" rx="8" fill="#5B9FE8" />

      {/* Orange dot */}
      <circle cx="30" cy="230" r="7" fill="#FF8C42" />
      <circle cx="280" cy="250" r="5" fill="#FF6B6B" />
    </svg>
  )
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true)
    setError("")

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
      } else {
        // Redirect to dashboard or home page
        window.location.href = "/dashboard"
      }
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
        <form onSubmit={handleLogin}>
          <FieldGroup>
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex flex-col items-center gap-2 font-medium">
                <div className="flex size-8 items-center justify-center rounded-md">
                  <GalleryVerticalEndIcon className="size-6" />
                </div>
                <span className="sr-only">Acme Inc.</span>
              </div>
              <h1 className="text-xl font-bold">Welcome to Acme Inc.</h1>
              <FieldDescription>
                Don&apos;t have an account?{" "}
                <Link href="/register">Sign up</Link>
              </FieldDescription>
            </div>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </Field>
            {error && (
              <Field>
                <div className="rounded-lg border border-red-800 bg-red-900/20 p-3 text-center text-sm text-red-400">
                  {error}
                </div>
              </Field>
            )}
            <Field>
              <Button type="submit" disabled={loading} className="bg-[#5B9FE8]">
                {loading ? "Signing in..." : "Login"}
              </Button>
            </Field>
          </FieldGroup>
        </form>
        <FieldDescription className="text-sm leading-6 text-muted-foreground">
          By clicking continue, you agree to our{" "}
          <a className="text-primary" href="#">
            Terms of Service
          </a>{" "}
          and{" "}
          <a className="text-primary" href="#">
            Privacy Policy
          </a>
          .
        </FieldDescription>
      </div>

      <div className="flex items-center justify-center rounded-[1.75rem] p-6 sm:p-8">
        <MascotRight />
      </div>
    </div>
  )
}
