import Preloader from "@/components/Preloader";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import Works from "@/components/sections/Works";
import Toolkit from "@/components/sections/Toolkit";
import Activity from "@/components/sections/Activity";
import Featured from "@/components/sections/Featured";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <main className="relative w-full">
      <Preloader />
      <Hero />
      <About />
      <Experience />
      <Works />
      <Toolkit />
      <Activity />
      <Featured />
      <Contact />
      <Footer />
    </main>
  );
}
