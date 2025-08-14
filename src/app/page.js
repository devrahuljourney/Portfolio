// Home.tsx
import ContactForm from "@/components/ContactForm";
import Experience from "@/components/Experience";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import ProjectSection from "@/components/ProjectSection";
import Skill from "@/components/Skill";

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
        <section id="home" className="min-h-screen snap-start flex items-center justify-center">
          <Hero />
        </section>

        <section className="min-h-screen snap-start flex items-center justify-center">
          <Experience />
        </section>

        <section className="min-h-screen snap-start flex items-center justify-center">
          <Skill />
        </section>

        <section className="min-h-screen snap-start flex items-center justify-center">
          <ProjectSection />
        </section>

        <section className="min-h-screen snap-start flex items-center justify-center">
          <ContactForm />
        </section>

        {/* Footer - Full Width */}
        <footer className="w-full snap-start">
          <Footer />
        </footer>
      </div>
    </div>
  );
}
