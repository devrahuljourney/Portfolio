// Home.tsx
import Experience from "@/components/Experience";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <div className="w-full h-screen overflow-hidden relative">
      {/* Fixed Background */}
      <div
        className="fixed inset-0 z-0 animate-wave"
        style={{
          background: `radial-gradient(
            ellipse 80% 60% at 50% 0%, 
            rgba(185, 253, 80, 0.15), 
            transparent 70%
          ), #0a0a0a`,
          backgroundSize: "120% 120%",
        }}
      />

      {/* Neon Grid Overlay */}
      <div
        className="fixed inset-0 z-10 pointer-events-none grid-primary"
        style={{
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 80% at 100% 0%, #000 50%, transparent 90%)",
          maskImage:
            "radial-gradient(ellipse 80% 80% at 100% 0%, #000 50%, transparent 90%)",
        }}
      />

      {/* Scrollable Sections */}
      <div className="relative z-20 w-full h-full overflow-y-auto snap-y snap-mandatory">
        <section className="h-screen snap-start flex items-center justify-center">
          <Hero />
        </section>

        <section className="h-screen snap-start flex items-center justify-center">
          <Experience />
        </section>
      </div>
    </div>
  );
}
