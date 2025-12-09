import { ParticlesBackground } from '@/components/landing/ParticlesBackground';
import { AnimatedGrid } from '@/components/landing/AnimatedGrid';
import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { Stats } from '@/components/landing/Stats';
import { CTASection } from '@/components/landing/CTASection';

const Landing = () => {
  return (
    <main className="relative min-h-screen bg-background text-foreground">
      {/* Background Effects */}
      <ParticlesBackground />
      <AnimatedGrid />

      {/* Content */}
      <div className="relative z-10">
        <Hero />
        <Features />
        <Stats />
        <CTASection />
      </div>
    </main>
  );
};

export default Landing;
