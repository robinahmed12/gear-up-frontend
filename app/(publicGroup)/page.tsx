// Home page — featured gear. Server Component, calls _actions/getGearList.ts directly (no client fetch needed for initial render)

import { CategoryShowcase } from "./_components/Home/CategoryShowcase";
import { FeaturedGear } from "./_components/Home/FeaturedGear";
import { HeroBanner } from "./_components/Home/HeroBanner";
import { HowItWorks } from "./_components/Home/HowItWorks";
import { ProviderCta } from "./_components/Home/ProviderCta";
import { TrustFeatures } from "./_components/Home/TrustFeatures";

export default function PublicgroupPage() {
  return (
    <div>
       <HeroBanner />
      <HowItWorks />
      <FeaturedGear />
      <CategoryShowcase />
      <TrustFeatures />
      <ProviderCta />
    </div>
  );
}
