import Image from "next/image"
import Navbar from "../components/landing-page/navbar"
import Hero from "../components/landing-page/hero"
import Features from "../components/landing-page/features"
import HowItWorks from "../components/landing-page/how-it-works"
import Testimonials from "../components/landing-page/testimonials"
import Footer from "../components/landing-page/footer"

export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Footer />
    </div>
  )
}
