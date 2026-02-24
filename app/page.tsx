import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { AgencyEdge } from "@/components/landing/agency-edge";
import { InteractiveDemo } from "@/components/landing/interative-demo";
import { InteractiveEditor } from "@/components/landing/interarive-editor";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-blue-100">
      <Navbar />
      <main>
        <HeroSection />
        <InteractiveEditor />
        <FeaturesSection />
        <AgencyEdge />
        <InteractiveDemo />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
}