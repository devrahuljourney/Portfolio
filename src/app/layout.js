import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/providers/SmoothScroll";
import Cursor from "@/components/providers/Cursor";
import ScrollProgress from "@/components/providers/ScrollProgress";
import ThemeProvider from "@/components/providers/ThemeProvider";
import ThemeToggle from "@/components/ThemeToggle";
import NavBar from "@/components/NavigationBar/NavBar";
import SocialMenu from "@/components/NavigationBar/SocialMenu";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata = {
  title: "Rahul Kumar Verma | Full-Stack Software Engineer",
  description:
    "Portfolio of Rahul Kumar Verma — Full-Stack Software Engineer from India specializing in MERN stack, React Native, and scalable web applications. Explore projects, skills, and contact details.",
  keywords: [
    "Rahul",
    "Rahul Verma",
    "Rahul Kumar",
    "Rahul Kumar Verma",
    "Rahul Verma Portfolio",
    "Full-Stack Developer",
    "Full-Stack Developer India",
    "MERN Stack Developer",
    "React Native Developer",
    "JavaScript Developer",
    "Freelance Web Developer",
    "Indian Software Engineer",
    "Software Developer Portfolio",
  ],
  authors: [{ name: "Rahul Kumar Verma", url: "https://rahulverma.site" }],
  applicationName: "Rahul Kumar Verma Portfolio",
  openGraph: {
    title: "Rahul Kumar Verma | Full-Stack Software Engineer",
    description:
      "Portfolio of Rahul Kumar Verma — showcasing web & mobile projects, MERN stack expertise, and freelance development work from India.",
    url: "https://rahulverma.site",
    siteName: "Rahul Kumar Verma | Full-Stack Developer India",
    images: [
      {
        url: "/assets/portfolio.png",
        width: 1200,
        height: 630,
        alt: "Portfolio of Rahul Kumar Verma",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rahul Kumar Verma | Full-Stack Software Engineer",
    description:
      "Explore the projects, skills, and freelance work of Rahul Kumar Verma — MERN & React Native Developer from India.",
    images: ["/assets/portfolio.png"],
    creator: "@devrahuljourney",
  },
  metadataBase: new URL("https://rahulverma.site"),
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrains.variable}`}
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
                  name: "Rahul Kumar Verma",
                  url: "https://rahulverma.site",
                  image: "https://rahulverma.site/assets/portfolio.png",
                  sameAs: [
                    "https://www.linkedin.com/in/devrahuljourney",
                    "https://github.com/devrahuljourney",
                    "https://x.com/devrahuljourney",
                  ],
                  jobTitle: "Software Engineer / Full-Stack Developer",
                  worksFor: { "@type": "Organization", name: "Vitraga Solutions" },
                  alumniOf: {
                    "@type": "CollegeOrUniversity",
                    name: "J.C. Bose University of Science and Technology, YMCA Faridabad, Haryana",
                  },
                  knowsAbout: [
                    "Full-Stack Development",
                    "MERN Stack",
                    "React Native",
                    "JavaScript",
                    "Node.js",
                    "Web Development",
                  ],
                  description:
                    "Full-stack software engineer specializing in MERN stack and React Native, building fast, scalable applications.",
                },
                {
                  "@type": "WebSite",
                  url: "https://rahulverma.site",
                  name: "Rahul Kumar Verma Portfolio",
                  description:
                    "Portfolio website of Rahul Kumar Verma — showcasing projects, skills, and freelance development work.",
                  publisher: { "@type": "Person", name: "Rahul Kumar Verma" },
                },
              ],
            }),
          }}
        />
      </head>
      <body className="grain antialiased">
        <ThemeProvider>
          <ScrollProgress />
          <Cursor />
          <ThemeToggle />
          <SmoothScroll>{children}</SmoothScroll>
          <NavBar />
          <SocialMenu />
        </ThemeProvider>
      </body>
    </html>
  );
}
