import { Montserrat, DM_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/providers/SmoothScroll";
import Cursor from "@/components/providers/Cursor";
import ScrollProgress from "@/components/providers/ScrollProgress";
import ThemeProvider from "@/components/providers/ThemeProvider";
import NavBar from "@/components/NavigationBar/NavBar";
import StickerDefs from "@/components/stickers/StickerDefs";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});
const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dmmono",
  display: "swap",
});

const SITE_URL = "https://rahulverma.site";
const DESCRIPTION =
  "Rahul Kumar Verma is a Full-Stack Software Engineer in India building production web and mobile products: AI features (LangChain, GPT-4o), payment systems, and multi-tenant SaaS with Next.js, React Native, and Node.js.";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Rahul Kumar Verma | Full-Stack Software Engineer",
    template: "%s | Rahul Kumar Verma",
  },
  description: DESCRIPTION,
  applicationName: "Rahul Kumar Verma · Portfolio",
  authors: [{ name: "Rahul Kumar Verma", url: SITE_URL }],
  creator: "Rahul Kumar Verma",
  publisher: "Rahul Kumar Verma",
  category: "technology",
  keywords: [
    "Rahul Verma",
    "Rahul Kumar Verma",
    "Rahul Kumar Verma Portfolio",
    "Full-Stack Software Engineer",
    "Full-Stack Developer India",
    "Next.js Developer",
    "React Native Developer",
    "MERN Stack Developer",
    "Node.js Developer",
    "AI Engineer",
    "LangChain Developer",
    "TypeScript Developer",
    "Software Engineer India",
    "Software Developer Portfolio",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Rahul Kumar Verma · Full-Stack Software Engineer",
    title: "Rahul Kumar Verma | Full-Stack Software Engineer",
    description: DESCRIPTION,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rahul Kumar Verma | Full-Stack Software Engineer",
    description: DESCRIPTION,
    creator: "@devrahuljourney",
    site: "@devrahuljourney",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#101110" },
    { media: "(prefers-color-scheme: light)", color: "#ece6d9" },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${montserrat.variable} ${dmMono.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Person",
                  "@id": "https://rahulverma.site/#person",
                  name: "Rahul Kumar Verma",
                  alternateName: "devrahuljourney",
                  url: "https://rahulverma.site",
                  sameAs: [
                    "https://www.linkedin.com/in/devrahuljourney",
                    "https://github.com/devrahuljourney",
                    "https://x.com/devrahuljourney",
                  ],
                  jobTitle: "Full-Stack Software Engineer",
                  worksFor: { "@type": "Organization", name: "Vitraga Solutions" },
                  hasOccupation: {
                    "@type": "Occupation",
                    name: "Full-Stack Software Engineer",
                    skills:
                      "Next.js, React, React Native, Node.js, TypeScript, LangChain, PostgreSQL, Supabase, AI/LLM integration",
                  },
                  address: {
                    "@type": "PostalAddress",
                    addressCountry: "IN",
                  },
                  alumniOf: {
                    "@type": "CollegeOrUniversity",
                    name: "J.C. Bose University of Science and Technology, YMCA, Faridabad, Haryana",
                  },
                  knowsAbout: [
                    "Full-Stack Development",
                    "Next.js",
                    "React Native",
                    "Node.js",
                    "TypeScript",
                    "MERN Stack",
                    "AI / LLM Integration",
                    "LangChain",
                    "PostgreSQL",
                    "Payment Gateway Integration",
                    "SaaS Development",
                  ],
                  description:
                    "Full-stack software engineer building production web and mobile products with Next.js, React Native, Node.js, and AI/LLM integrations.",
                },
                {
                  "@type": "WebSite",
                  "@id": "https://rahulverma.site/#website",
                  url: "https://rahulverma.site",
                  name: "Rahul Kumar Verma · Portfolio",
                  description:
                    "Portfolio of Rahul Kumar Verma, a full-stack software engineer building AI-driven web and mobile products.",
                  inLanguage: "en",
                  publisher: { "@id": "https://rahulverma.site/#person" },
                },
                {
                  "@type": "ProfilePage",
                  "@id": "https://rahulverma.site/#profilepage",
                  url: "https://rahulverma.site",
                  name: "Rahul Kumar Verma | Full-Stack Software Engineer",
                  isPartOf: { "@id": "https://rahulverma.site/#website" },
                  about: { "@id": "https://rahulverma.site/#person" },
                  inLanguage: "en",
                },
              ],
            }),
          }}
        />
      </head>
      <body className="grain antialiased">
        <ThemeProvider>
          <StickerDefs />
          <ScrollProgress />
          <Cursor />
          <NavBar />
          <SmoothScroll>{children}</SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
