import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavigationBar/NavBar";
import SocialMenu from "@/components/NavigationBar/SocialMenu";
export const metadata = {
  title: "Rahul Kumar Verma | Full-Stack Software Engineer Portfolio",
  description:
    "Official portfolio of Rahul Kumar Verma — Full-Stack Software Engineer from India specializing in MERN stack, React Native, and scalable web applications. Explore Indian and global freelance projects, skills, and contact details.",
  keywords: [
    "Rahul",
    "Rahul Verma",
    "Rahul Kumar",
    "Rahul Kumar Verma",
    "Rahul Verma Portfolio",
    "Rahul Kumar Verma Portfolio",
    "Full-Stack Developer",
    "Full-Stack Developer India",
    "MERN Stack Developer",
    "MERN Stack Developer India",
    "React Native Developer",
    "React Native Developer India",
    "JavaScript Developer",
    "JavaScript Developer India",
    "Freelance Web Developer",
    "Freelance Web Developer India",
    "Indian Software Engineer",
    "Software Developer Portfolio"
  ],
  authors: [{ name: "Rahul Kumar Verma", url: "https://rahulverma.site" }],
  applicationName: "Rahul Kumar Verma Portfolio",
  openGraph: {
    title: "Rahul Kumar Verma | Full-Stack Software Engineer Portfolio",
    description:
      "Portfolio of Rahul Kumar Verma — showcasing web & mobile projects, MERN stack expertise, and freelance development work from India.",
    url: "https://rahulverma.site",
    siteName: "Rahul Kumar Verma | Full-Stack Developer India",
    images: [
      {
        url: "/assets/portfolio.png",
        width: 1200,
        height: 630,
        alt: "Portfolio screenshot of Rahul Kumar Verma"
      }
    ],
    locale: "en_IN",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Rahul Kumar Verma | Full-Stack Software Engineer Portfolio",
    description:
      "Explore the projects, skills, and freelance work of Rahul Kumar Verma — MERN & React Native Developer from India.",
    images: ["/assets/portfolio.png"],
    creator: "@devrahuljourney"
  },
  metadataBase: new URL("https://rahulverma.site")
};



export default function RootLayout({ children }) {
  return (
    <html lang="en">
         <head>
        <link rel="icon" href="/favicon.ico" />
        <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Person",
          "name": "Rahul Kumar Verma",
          "url": "https://rahulverma.site",
          "image": "https://rahulverma.site/assets/portfolio.png",
          "sameAs": [
            "https://www.linkedin.com/in/devrahuljourney",
            "https://github.com/devrahuljourney",
            "https://x.com/devrahuljourney"
          ],
          "jobTitle": "Software Engineer / Full-Stack Developer",
          "worksFor": {
            "@type": "Organization",
            "name": "Freelance"
          },
          "alumniOf": {
            "@type": "CollegeOrUniversity",
            "name": "J.C. Bose University of Science and Technology, YMCA Faridabad, Haryana"
          },
          "knowsAbout": [
            "Full-Stack Development",
            "MERN Stack",
            "React Native",
            "JavaScript",
            "Node.js",
            "Web Development"
          ],
          "description": "Full-stack software engineer specializing in MERN stack and React Native, building fast, scalable applications."
        },
        {
          "@type": "WebSite",
          "url": "https://rahulverma.site",
          "name": "Rahul Kumar Verma Portfolio",
          "description": "Portfolio website of Rahul Kumar Verma — showcasing projects, skills, and freelance development work.",
          "publisher": {
            "@type": "Person",
            "name": "Rahul Kumar Verma"
          },
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://rahulverma.site/?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        }
      ]
    })
  }}
/>

      </head>
    
      <body

    
        
      >
      <div className=" w-full md:w-[60%] flex justify-center items-center z-[30] bottom-10  md:left-[20%] left-0 absolute " >
        <NavBar/>
        <SocialMenu/>
      </div>
        {children}
        
      </body>
    </html>
  );
}
