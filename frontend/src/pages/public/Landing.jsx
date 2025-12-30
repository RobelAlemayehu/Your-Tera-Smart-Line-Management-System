import Navbar from "@/components/layout/navbar"
import Hero from "@/components/layout/hero"
import ServicesHeader from "@/components/layout/services-header"
import FeatureCards from "@/components/layout/feature-cards"
import Testimonials from "@/components/layout/testimonials"
import Footer from "@/components/layout/footer"

export default function LandingPage() {
  return (
    <main style={{ backgroundColor: 'white', width: '100vw', margin: 0, padding: 0 }}>
      <Navbar />
      <Hero />
      
      <FeatureCards />
      <ServicesHeader />
      <Testimonials />
      <Footer />
    </main>
  )
}
