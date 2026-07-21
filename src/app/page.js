import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Skill from "@/components/Skill";
import ProjectSection from "@/components/ProjectSection";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative w-full">
      <Hero />
      <About />
      <Experience />
      <Skill />
      <ProjectSection />
      <ContactForm />
      <Footer />
    </main>
  );
}
