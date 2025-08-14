"use client";
import { social } from "@/constant/data";
import { useState, useRef, useEffect } from "react";

export default function SocialMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const socialLinks = [
    {
      href: social.x,
      label: "Twitter",
      svg: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.3 4.3 0 0 0 1.88-2.38 8.59 8.59 0 0 1-2.73 1.04 4.28 4.28 0 0 0-7.4 3.9A12.14 12.14 0 0 1 3.16 4.6a4.27 4.27 0 0 0 1.33 5.71 4.23 4.23 0 0 1-1.94-.54v.05a4.28 4.28 0 0 0 3.44 4.19c-.47.13-.97.2-1.49.2-.36 0-.72-.03-1.06-.1a4.28 4.28 0 0 0 4 2.97A8.58 8.58 0 0 1 2 19.54 12.09 12.09 0 0 0 8.29 21c7.55 0 11.68-6.26 11.68-11.68 0-.18-.01-.35-.02-.53A8.36 8.36 0 0 0 22.46 6z" />
        </svg>
      ),
    },
    {
      href: social.github,
      label: "GitHub",
      svg: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.45-1.14-1.1-1.44-1.1-1.44-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.33 1.09 2.9.84.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.99 1.03-2.69-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.02A9.6 9.6 0 0 1 12 6.84a9.6 9.6 0 0 1 2.5.34c1.91-1.29 2.75-1.02 2.75-1.02.55 1.41.2 2.45.1 2.71.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.69-4.57 4.94.36.31.68.93.68 1.87v2.77c0 .26.18.57.69.48A10 10 0 0 0 12 2z"
          />
        </svg>
      ),
    },
    {
      href: social.linkedin,
      label: "LinkedIn",
      svg: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M4.98 3.5A2.5 2.5 0 1 1 0 3.5a2.5 2.5 0 0 1 4.98 0zM.5 8h4.99v12H.5zM8.5 8h4.78v1.64h.07c.67-1.27 2.3-2.61 4.74-2.61 5.07 0 6 3.34 6 7.68V20h-5v-6.57c0-1.57-.03-3.6-2.19-3.6-2.2 0-2.54 1.72-2.54 3.49V20h-5V8z" />
        </svg>
      ),
    },
    {
      href: social.whatsapp,
      label: "WhatsApp",
      svg: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.52 3.48A11.88 11.88 0 0 0 12 0C5.37 0 .02 5.37.02 12c0 2.12.55 4.1 1.52 5.85L0 24l6.37-1.51A11.93 11.93 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.22-3.48-8.52zm-8.52 17.24a9.81 9.81 0 0 1-5.21-1.53l-.37-.22-3.78.89.91-3.69-.24-.38a9.83 9.83 0 1 1 8.69 4.93zm5.27-7.17c-.29-.14-1.71-.84-1.98-.93s-.46-.14-.66.14-.76.93-.93 1.12-.34.21-.63.07a7.05 7.05 0 0 1-2.06-1.26 7.9 7.9 0 0 1-1.46-1.81c-.16-.28 0-.43.12-.57.12-.12.28-.33.42-.5.14-.16.19-.28.29-.47.1-.19.05-.35-.02-.5-.07-.14-.66-1.58-.91-2.17s-.48-.5-.66-.51h-.56a1.05 1.05 0 0 0-.77.36 3.25 3.25 0 0 0-1 2.44c0 1.44.8 2.84 1.13 3.05.33.21 1.94 3 4.7 4.2a5.18 5.18 0 0 0 2.27.45c.92 0 1.76-.37 2.44-.96a4.38 4.38 0 0 0 1.36-2.12c.11-.37.07-.7-.05-.78z"/>
        </svg>
      ),
    }
,    
    {
      href: social.instagram,
      label: "Instagram",
      svg: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zM12 7.25A4.75 4.75 0 1 0 16.75 12 4.76 4.76 0 0 0 12 7.25zm0 7.5A2.75 2.75 0 1 1 14.75 12 2.76 2.76 0 0 1 12 14.75zM17.5 6.75a1.25 1.25 0 1 0-1.25-1.25 1.25 1.25 0 0 0 1.25 1.25z" />
        </svg>
      ),
    },
  ];

  return (
    <div
      className="fixed bottom-5 md:right-6 right-2 z-50 flex flex-col items-end"
      ref={menuRef}
    >
      {/* Social Links */}
      <div
        className={`flex flex-col gap-3 mb-3 transition-all duration-300 ${
          open
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-6 pointer-events-none"
        }`}
      >
        {socialLinks.map((link, i) => (
          <a
            key={i}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/10 hover:bg-white/20 text-white rounded-full p-3 shadow-lg backdrop-blur-md transition"
            title={link.label}
          >
            {link.svg}
          </a>
        ))}
      </div>

      {/* Glassmorphism Toggle */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="backdrop-blur-md bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-2xl p-4 shadow-lg transition"
      >
        {open ? (
    // Close icon
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
      viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ) : (
    // Plus icon
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
      viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  )}
      </button>
    </div>
  );
}
