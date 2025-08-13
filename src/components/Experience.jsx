"use client";
import React from "react";
import { FaCheckCircle } from "react-icons/fa";

export default function Experience() {
  const experienceData = [
    {
      id: 1,
      role: "Frontend Developer Intern (Founding Member)",
      start: "Sep 2024",
      end: "Jan 2025",
      description: `
- Developed and deployed a full-stack furniture e-commerce site using the MERN stack with responsive UI and optimized checkout flow.
- Implemented bulk product upload via CSV, reducing manual entry by 80% and improving admin efficiency.
- Contributed to the esports admin panel with user management and integrated Cloudinary for secure, fast image uploads and storage.
      `,
    },
    {
      id: 2,
      role: "Freelance Full Stack Developer",
      start: "Jan 2025",
      end: "Present",
      description: `
- Built a full MERN stack e-commerce platform with user, seller, and admin dashboards, bulk CSV uploads, Cashfree payments, and invoice generation.
- Delivered a responsive legal services website with a Quill.js blog and admin panel for content management.
- Created a marketing website for a client, implementing interactive sections and smooth animations.
      `,
    },
  ];

  return (
    <section className="py-20 relative">
      <h2 className="text-primary font-heading text-2xl sm:text-3xl md:text-5xl mb-[5%] tracking-wide text-center text-[#B9FD50]">
        Work Experience
      </h2>

      <div className="relative max-w-6xl mx-auto px-4">
        {/* Vertical Line */}
        <div className="absolute md:left-1/2  top-0 w-1 bg-[#B9FD50] h-full -translate-x-1/2"></div>

        <ul className="space-y-20">
          {experienceData.map((exp, idx) => {
            const isLeft = idx % 2 === 0;
            return (
              <li key={exp.id} className="relative flex flex-col md:flex-row w-full">
                {/* Icon */}
                <div className="absolute md:left-1/2 -translate-x-1/2 bg-[#B9FD50] w-6 h-6 rounded-full flex items-center justify-center z-10">
                  <FaCheckCircle className="text-black w-4 h-4" />
                </div>

                {/* Content */}
                <div
                  className={`w-full md:w-1/2 px-4 mt-8 md:mt-0 ${
                    isLeft
                      ? "md:text-right md:pr-12 md:ml-auto"
                      : "md:text-left md:pl-12 md:mr-auto"
                  }`}
                >
                  <time className="font-mono italic text-[#B9FD50]">{exp.start} – {exp.end}</time>
                  <div className="text-xl sm:text-2xl md:text-2xl font-bold text-white mt-2">{exp.role}</div>
                  <p className="text-gray-400 whitespace-pre-line mt-2">{exp.description}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
