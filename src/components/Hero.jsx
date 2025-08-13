import React from "react";
import { BackgroundBeamsWithCollision } from "./ui/BackgroundBeam";
import MiddleSection from "./Hero/MiddleSection";
import SideScrollBar from "./Hero/SideScrollBar";


export default function Hero() {
  return (
<BackgroundBeamsWithCollision className="bg-transparent w-full flex h-[99vh] items-center">
  {/* Left sidebar */}
  <div className="hidden sm:flex w-[10%] justify-center">
    <SideScrollBar />
  </div>

  
  <div className=" w-[80%] md:flex-1 flex justify-center min-w-0">
    <MiddleSection />
  </div>

  {/* Right sidebar */}
  <div className="hidden sm:flex w-[10%] justify-center">
    <SideScrollBar />
  </div>
</BackgroundBeamsWithCollision>

  
  );
}
