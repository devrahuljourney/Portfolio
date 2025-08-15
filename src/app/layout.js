import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavigationBar/NavBar";
import SocialMenu from "@/components/NavigationBar/SocialMenu";


export const metadata = {
  title: "Rahul Verma - Full-Stack Developer Portfolio",
  description: "Explore the projects, skills, and freelance work of Rahul Verma, a Full-Stack Developer specialized in MERN and React Native apps.",
  keywords: ["Rahul Verma", "Full-Stack Developer", "MERN Stack", "React Native", "Portfolio", "Freelance Developer"],
  authors: [{ name: "Rahul Verma", url: "https://yourportfolio.com" }],
  openGraph: {
    title: "Rahul Verma - Full-Stack Developer Portfolio",
    description: "Explore the projects, skills, and freelance work of Rahul Verma, a Full-Stack Developer specialized in MERN and React Native apps.",
    url: "https://yourportfolio.com",
    siteName: "Rahul Verma Portfolio",
    images: [
      {
        url: "/assets/projects/portfolio.png",
        width: 800,
        height: 600,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rahul Verma - Full-Stack Developer Portfolio",
    description: "Explore the projects, skills, and freelance work of Rahul Verma.",
    images: ["/assets/projects/portfolio.png"],
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
         <head>
        <link rel="icon" href="/favicon.ico" />
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
