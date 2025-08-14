import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavigationBar/NavBar";
import SocialMenu from "@/components/NavigationBar/SocialMenu";



export default function RootLayout({ children }) {
  return (
    <html lang="en">
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
