"use client";
import { useEffect, useState } from "react";
import NavBar from "@/components/NavigationBar/NavBar";
import SocialMenu from "@/components/NavigationBar/SocialMenu";

export default function NavWrapper() {
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    let timeout;
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY) {
        // scrolling down → hide
        setVisible(false);
      } else if (lastScrollY - currentScrollY > 50) {
        // scrolled up by at least 50px → show
        setVisible(true);
      }

      setLastScrollY(currentScrollY);

      // if user stops scrolling, show after 200ms
      clearTimeout(timeout);
      timeout = setTimeout(() => setVisible(true), 200);
    };

    window.addEventListener("scroll", controlNavbar);
    return () => {
      window.removeEventListener("scroll", controlNavbar);
      clearTimeout(timeout);
    };
  }, [lastScrollY]);

  return (
    <div
      className={`fixed w-full md:w-[60%] flex justify-center items-center 
        md:left-[20%] left-0 bottom-10 z-[30] transition-transform duration-300 
        ${visible ? "translate-y-0" : "translate-y-24"}`}
    >
      <NavBar />
      <SocialMenu />
    </div>
  );
}
