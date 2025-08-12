// Home.tsx
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <div className="min-h-screen w-full relative bg-theme overflow-hidden">
      {/* Tech Glow Background */}
      <div
        className="absolute inset-0 z-0 animate-wave"
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
        className="absolute inset-0 z-10 pointer-events-none grid-primary"
        style={{
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 80% at 100% 0%, #000 50%, transparent 90%)",
          maskImage:
            "radial-gradient(ellipse 80% 80% at 100% 0%, #000 50%, transparent 90%)",
        }}
      />

      <div className="relative z-20 w-full flex justify-center items-center">
        <Hero />
      </div>
    </div>
  );
}
