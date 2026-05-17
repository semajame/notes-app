"use client"

import AnimatedSection from "@/components/animated-section"
import { SignupForm } from "@/components/signup-form"

export default function SignupPage() {
  return (
    <AnimatedSection>
      <div className="flex min-h-svh items-center justify-center bg-background p-6 md:p-10">
        <SignupForm className="w-full max-w-5xl" />
      </div>
    </AnimatedSection>
  )
}
