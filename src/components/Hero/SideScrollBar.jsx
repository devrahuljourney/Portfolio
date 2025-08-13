import { skillImage } from "@/constant/data";
import React from "react";

export default function SideScrollBar() {
  const loopList = [...skillImage, ...skillImage];

  return (
    <div
      className="overflow-hidden h-screen relative"
      style={{
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,1) 15%, rgba(0,0,0,1) 85%, transparent 100%)",
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskSize: "100% 100%",
        maskImage:
          "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,1) 15%, rgba(0,0,0,1) 85%, transparent 100%)",
        maskRepeat: "no-repeat",
        maskSize: "100% 100%",
      }}
    >
      <div className="flex flex-col animate-scroll">
        {loopList.map((src, index) => (
          <img
            key={index}
            src={src.src}
            alt={`skill-${index}`}
            className="w-12 h-12 mb-16"
          />
        ))}
      </div>
    </div>
  );
}
