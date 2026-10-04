import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { AIAutomation } from "@/components/AIAutomation";
import { CallingAgent } from "@/components/CallingAgent";
import { WebDevShowcase } from "@/components/WebDevShowcase";
import { SystemLayers } from "@/components/SystemLayers";
import { SearchIntelligence } from "@/components/SearchIntelligence";
import { CaseStudiesSection } from "@/components/CaseStudiesSection";
import { Process } from "@/components/Process";
import { TechStack } from "@/components/TechStack";
import { AboutUs } from "@/components/AboutUs";
import { CTASection } from "@/components/CTASection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { SystemScene } from "@/components/scene/SystemScene";
import { SERVICES } from "@/lib/services";
import { JsonLd, SITE_URL } from "@/lib/seo";

const servicesJsonLd = {
  "@context": "https://schema.org",
  "@graph": SERVICES.map((s) => ({
    "@type": "Service",
    name: s.title,
    description: s.summary,
    serviceType: s.title,
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: "Worldwide",
  })),
};

// Story: calm and immersive sections alternate; transparent ones (data-scene) reveal the 3D stack.
export default function HomePage() {
  return (
    <div id="top">
      <SystemScene />
      <Navbar />
      <main id="main" tabIndex={-1} className="relative z-10">
        <Hero />
        <Services />
        <AIAutomation />
        <CallingAgent />
        <WebDevShowcase />
        <SystemLayers />
        <SearchIntelligence />
        <CaseStudiesSection />
        <Process />
        <TechStack />
        <AboutUs />
        <CTASection />
        <ContactSection />
      </main>
      <Footer />
      <JsonLd data={servicesJsonLd} />
    </div>
  );
}
