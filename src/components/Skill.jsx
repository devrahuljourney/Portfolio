"use client";
import { SkillImageAndName } from "@/constant/data";
import Image from "next/image";
import React from "react";
import Tilt from "react-parallax-tilt";

export default function Skill() {
  return (
    <div
      id="skills"
      className="flex flex-col justify-center items-center h-screen px-4"
    >
      {/* Heading with rotating gears */}
      <div className="flex md:w-full w-[80%]  items-center text-center justify-center md:gap-3  mb-8">
        {/* Left gear */}
        <svg
          className="w-14 h-14  text-[#B9FD50] animate-spin-slow"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.591 1.069c1.527-.88 3.362.954 2.482 2.482a1.724 1.724 0 001.068 2.592c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.068 2.592c.88 1.527-.955 3.362-2.482 2.482a1.724 1.724 0 00-2.591 1.068c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.592-1.068c-1.527.88-3.362-.955-2.482-2.482a1.724 1.724 0 00-1.068-2.592c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.068-2.592c-.88-1.528.955-3.362 2.482-2.482.96.553 2.165.223 2.592-1.068z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>

        {/* Text */}
        <h1 className="text-primary font-heading text-xl sm:text-2xl md:text-4xl tracking-wide text-[#B9FD50]">
          Tools and Technologies
        </h1>

        {/* Right gear */}
        <svg
          className="w-14 h-14 text-[#B9FD50] animate-spin-slow"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.591 1.069c1.527-.88 3.362.954 2.482 2.482a1.724 1.724 0 001.068 2.592c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.068 2.592c.88 1.527-.955 3.362-2.482 2.482a1.724 1.724 0 00-2.591 1.068c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.592-1.068c-1.527.88-3.362-.955-2.482-2.482a1.724 1.724 0 00-1.068-2.592c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.068-2.592c-.88-1.528.955-3.362 2.482-2.482.96.553 2.165.223 2.592-1.068z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </div>

      {/* Skills list */}
      <div className="flex flex-row font-body flex-wrap justify-center items-centerflex-wrap md:gap-6 gap-2 md:w-[80%] w-full ">
        {SkillImageAndName.map((data, index) => (
          <Tilt key={index}>
          <div className="p-4 md:px-8 rounded-2xl flex md:flex-row flex-col justify-center items-center gap-2 backdrop-blur-md bg-white/10 border border-white/20 shadow-lg hover:scale-105 transition-transform duration-300">
  <Image
    src={data.img}
    alt={data.name}
    width={32}
    height={32}
    className="w-8 h-8"
  />
  <p className="text-center text-white text-sm hidden sm:block">
    {data.name}
  </p>
</div>

          </Tilt>
        ))}
      </div>
    </div>
  );
}
