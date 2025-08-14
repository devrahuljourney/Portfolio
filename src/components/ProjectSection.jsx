"use client";

import React, { useState } from "react";
import Tilt from "react-parallax-tilt";
import Image from "next/image";
import { projects } from "@/constant/data";

const categories = ["all", "freelance", "web", "app", "extension"];

export default function ProjectSection() {
  const [activeTab, setActiveTab] = useState("all");
  const [expanded, setExpanded] = useState({});

  const filteredProjects =
    activeTab === "all"
      ? projects
      : projects.filter((project) => project.category.includes(activeTab));

  const toggleReadMore = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section
      id="projects"
      className="py-12 px-4 sm:px-6 lg:px-12 bg-transparent"
    >
      {/* Heading */}
      <div className="text-center mb-10">
        <h2 className="text-primary font-heading text-2xl sm:text-3xl md:text-5xl mb-[5%] tracking-wide text-center text-white">
          My <span className="text-[#B9FD50]">Projects</span>
        </h2>
        <p className="text-gray-400 mt-3 max-w-2xl mx-auto text-sm sm:text-base">
          A curated selection of work — from freelance collaborations to
          personal builds — covering web, app, and extension development.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center flex-wrap gap-3 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`px-4 py-2 rounded-full text-sm sm:text-base font-semibold transition-all duration-300 backdrop-blur-md border 
              ${
                activeTab === cat
                  ? "bg-[#B9FD50] text-black border-[#B9FD50]"
                  : "bg-white/10 text-white border-white/20 hover:bg-white/20"
              }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">

        {filteredProjects.map((project) => {
          const isExpanded = expanded[project.id];
          const shortDesc =
            project.description.length > 120
              ? project.description.slice(0, 120) + "..."
              : project.description;

          return (
            <Tilt
              key={project.id}
              tiltMaxAngleX={6}
              tiltMaxAngleY={6}
              perspective={1000}
              scale={1.03}
              transitionSpeed={700}
              className="w-full"
            >
              <div className="flex flex-col h-full p-4 sm:p-5 rounded-xl backdrop-blur-lg bg-white/10 border border-white/20 shadow-lg hover:shadow-[#B9FD50]/40 transition-all duration-300">
                {/* Image */}
                <div className="w-full aspect-video relative rounded-lg overflow-hidden mb-4">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-white mb-2">
                  {project.title}
                </h3>

                {/* Description with Read More */}
                <p className="text-sm text-gray-300 flex-grow">
                  {isExpanded ? project.description : shortDesc}
                </p>
                {project.description.length > 120 && (
                  <button
                    onClick={() => toggleReadMore(project.id)}
                    className="text-xs text-[#B9FD50] mt-1 hover:underline"
                  >
                    {isExpanded ? "Read Less" : "Read More"}
                  </button>
                )}

                {/* Tech stack */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {project.tech.map((t, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 text-xs bg-[#B9FD50]/20 text-[#B9FD50] rounded-full border border-[#B9FD50]/40"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex justify-between items-center mt-4">
                  <a
                    href={project.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#B9FD50] text-sm hover:underline"
                  >
                    Live
                  </a>
                  {project.githubLink ? (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#B9FD50] text-sm hover:underline"
                    >
                      Code
                    </a>
                  ) : (
                    <span className="text-gray-500 text-sm">Private</span>
                  )}
                </div>
              </div>
            </Tilt>
          );
        })}
      </div>
    </section>
  );
}
