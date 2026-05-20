import Navbar from "../components/landing-page/navbar"
import Hero from "../components/landing-page/hero"
import Features from "../components/landing-page/features"

import Testimonials from "../components/landing-page/testimonials"
import Footer from "../components/landing-page/footer"
import AnimatedSection from "../components/animated-section"

export default function Home() {
  return (
    <div>
      <Navbar />
      <AnimatedSection>
        <Hero />
      </AnimatedSection>
      <AnimatedSection>
        <Features />
      </AnimatedSection>
      <AnimatedSection>
        <Testimonials />
      </AnimatedSection>
      <AnimatedSection>
        <Footer />
      </AnimatedSection>
    </div>
  )
}
