import { LandingHeader } from "./(marketing)/_components/header";
import { HeroSection } from "./(marketing)/_components/hero";
import { FeaturesSection } from "./(marketing)/_components/features";
import { ShowcaseSection } from "./(marketing)/_components/showcase";
import { IntegrationsSection } from "./(marketing)/_components/integrations";
import { PricingSection } from "./(marketing)/_components/pricing";
import { CTASection } from "./(marketing)/_components/cta-section";
import { LandingFooter } from "./(marketing)/_components/footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen scroll-smooth">
      <LandingHeader />
      <HeroSection />
      <FeaturesSection />
      <ShowcaseSection />
      <IntegrationsSection />
      <PricingSection />
      <CTASection />
      <LandingFooter />
    </main>
  );
}
