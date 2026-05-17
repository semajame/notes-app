"use client"

import AnimatedSection from "@/components/animated-section"
import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <AnimatedSection>
      <div className="flex min-h-svh items-center justify-center bg-background p-6 md:p-10">
        <LoginForm className="w-full max-w-5xl" />
      </div>
    </AnimatedSection>
  )
}
