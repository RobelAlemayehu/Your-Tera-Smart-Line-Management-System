import Navbar from "@/components/layout/navbar"
import Hero from "@/components/layout/hero"
import ServicesHeader from "@/components/layout/services-header"
import FeatureCards from "@/components/layout/feature-cards"
import Testimonials from "@/components/layout/testimonials"
import Footer from "@/components/layout/footer"

export default function LandingPage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <ServicesHeader />
      <FeatureCards />
      <Testimonials />
      <Footer />
    </main>
  )
}
