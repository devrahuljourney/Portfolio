import html from "../../public/assests/html-16-svgrepo-com.svg";
import css from "../../public/assests/css-16-svgrepo-com.svg";
import tailwind from "../../public/assests/tailwind-svgrepo-com.svg";
import javascript from "../../public/assests/javascript-16-svgrepo-com.svg";
import react from "../../public/assests/react-svgrepo-com.svg";
import reactNative from "../../public/assests/react-svgrepo-com.svg";
import nextjs from "../../public/assests/next-js-svgrepo-com.svg";

import mongoDb from "../../public/assests/mongodb-svgrepo-com.svg";
import express from "../../public/assests/expressjs-icon.svg";
import nodejs from "../../public/assests/node-16-svgrepo-com.svg";
import github from "../../public/assests/github-svgrepo-com.svg";
import vscode from "../../public/assests/vs-code-logo-microsoft-svgrepo-com.svg";
import notion from "../../public/assests/notion-svgrepo-com.svg";

import vercel from "../../public/assests/vercel-svgrepo-com.svg";
import slack from "../../public/assests/slack-svgrepo-com.svg";
import docker from "../../public/assests/docker-svgrepo-com.svg";
import aws from "../../public/assests/aws-svgrepo-com.svg";

import studynotion from "../../public/assests/studynotion.png"
import friendify from "../../public/assests/friendify.png"
import gallybajar from "../../public/assests/gallybajar.png"
import anil from "../../public/assests/ana.png"
import rn from "../../public/assests/rn.png"
import coskill from "../../public/assests/coskill.jpeg"
import ph from "../../public/assests/ph.png"



export const SkillImageAndName = [
  // Frontend core
  { name: "HTML", img: html },
  { name: "CSS", img: css },
  { name: "JavaScript", img: javascript },
  { name: "Tailwind CSS", img: tailwind },

  // Frameworks
  { name: "React", img: react },
  { name: "React Native", img: reactNative },
  { name: "Next.js", img: nextjs },

  // Backend
  { name: "Node.js", img: nodejs },
  { name: "Express.js", img: express },
  { name: "MongoDB", img: mongoDb },

  // Tools
  { name: "GitHub", img: github },
  { name: "VS Code", img: vscode },
  { name: "Notion", img: notion },
  { name: "Slack", img: slack },

  // Deployment & Cloud
  { name: "Vercel", img: vercel },
  { name: "Docker", img: docker },
  { name: "AWS", img: aws },
];

export const skillImage = [
  html,
  css,
  javascript,
  tailwind,
  react,
  reactNative,
  nextjs,
  nodejs,
  express,
  mongoDb,
  github,
  vscode,
  notion,
  slack,
  vercel,
  docker,
  aws,
];


export const experience = [
    {
      "id":1,
      "role": "Frontend Developer",
      "company": "We Play India",
      "start": "July 2024",
      "end": "Jan 2025",
    },
    {
      "id":2,
      "role": "Full Stack Developer",
      "company": "Freelancer",
      "start": "Jan 2025",
      "end": "Present",
    }
  ]
  


  export const projects = [
    {
      id: 10,
      title: "ReThink",
      tagline: "Digital-wellbeing app — Android",
      year: "2025",
      description:
        "A screen-time app that actually intervenes. I wrote a custom Kotlin AccessibilityService and a from-scratch React Native native-module bridge to detect the foreground app in real time and hard-block distracting apps instantly — even when the app is force-closed (HeadlessJS). Adds AI coaching (Gemini + LangChain), scheduled Focus Mode, and 15-minute background sync.",
      image: "personal",
      tech: ["React Native", "Kotlin", "Node.js", "Supabase", "Gemini"],
      category: ["all", "app", "mobile", "ai"],
      liveLink: null,
      githubLink: "https://github.com/devrahuljourney/rethink",
    },
    {
      id: 8,
      title: "AI Travel Platform",
      tagline: "AI trip-planner — B2C + B2B",
      client: "Client work · via Vitraga Solutions",
      year: "2026",
      description:
        "The consumer site and franchise-agent portal for a 260-year-old Indian travel brand. I built an AI trip-planner (LangChain + GPT-4o + pgvector semantic search) that cut agent package discovery from ~20 min to under 2, with in-chat OTP lead capture and two-way TeleCRM sync powering 5,000+ leads — plus a unified HDFC / ICICI payment layer.",
      image: "confidential",
      tech: ["Next.js 15", "TypeScript", "Supabase", "LangChain", "pgvector"],
      category: ["all", "work", "web", "ai"],
      liveLink: null,
      githubLink: null,
    },
    {
      id: 9,
      title: "NDIS SaaS",
      tagline: "Disability-services platform — Australia",
      client: "Client · via Vitraga Solutions",
      year: "2025",
      description:
        "A multi-tenant SaaS for Australian NDIS providers. I built a task-to-invoice pipeline (PDF, NDIS service codes, GST) that dropped billing from 2+ days to under 5 minutes, an LLM plan-parser that reads 20–40 page government PDFs into structured data, and a 200+ permission-key RBAC/ABAC system enforced in Express and scoped SQL.",
      image: "confidential",
      tech: ["Next.js", "Express", "Supabase", "Google Gemini", "Docker"],
      category: ["all", "work", "app", "ai"],
      liveLink: null,
      githubLink: null,
    },
    {
      id: 1,
      title: "StudyNotion",
      tagline: "EdTech learning platform",
      year: "2024",
      description:
        "A full EdTech platform where students enroll, track progress, and consume course material. Ships with role-based dashboards, a course catalog, Razorpay checkout, and real-time progress updates.",
      image: studynotion,
      tech: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS", "Razorpay"],
      category: ["all", "web", "edtech"],
      liveLink: "https://ed-tech-frontend-delta.vercel.app/",
      githubLink: "https://github.com/devrahuljourney/EdTech_frontend"
    },
    {
      id: 2,
      title: "Friendify",
      tagline: "Real-time social network",
      year: "2024",
      description:
        "A MERN social app built for live interaction — WebSocket chat, posts, likes, comments, profiles, follows, and notifications, wrapped in a fast, modern UI.",
      image: friendify,
      tech: ["MongoDB", "Express", "React", "Node.js", "WebSocket", "Tailwind CSS"],
      category: ["all", "web", "social"],
      liveLink: "https://friendify-alpha.vercel.app/",
      githubLink: "https://github.com/devrahuljourney/Friendify_Frontend"
    },
    {
      id: 3,
      title: "CoSkill",
      tagline: "Skill-swap & mock interviews",
      year: "2025",
      description:
        "A React Native platform that matches people by mutual skill interest, schedules mock interviews, and powers real-time chat with WebSocket + Redis — plus session feedback and trending-skill discovery.",
      image: coskill,
      tech: ["React Native", "Node.js", "Express", "MongoDB", "Redis", "Expo"],
      category: ["all", "app", "mobile"],
      liveLink: "https://www.youtube.com/shorts/RPMTcxZlLVY",
      githubLink: "https://github.com/devrahuljourney/CoSkill_Frontend"
    },
    {
      id: 4,
      title: "GallyBajar",
      tagline: "Multi-vendor e-commerce",
      year: "2025",
      description:
        "A freelance MERN commerce platform with separate seller, customer, and admin dashboards — product management, order processing, payments, Google auth, and Cloudinary media, fully responsive end to end.",
      image: gallybajar,
      tech: ["MongoDB", "Express", "React", "Node.js", "Google Auth", "Cloudinary"],
      category: ["all", "freelance", "web"],
      liveLink: "https://gallybajar.com/",
      githubLink: null
    },
    {
      id: 5,
      title: "Anil Dhyani & Associates",
      tagline: "Law firm website",
      year: "2025",
      description:
        "A freelance MERN site for a law firm: service pages, a Quill.js-powered blog, an email-notifying contact form, and an admin panel built for effortless content management.",
      image: anil,
      tech: ["MongoDB", "Express.js", "React", "Node.js", "Tailwind CSS", "Quill.js"],
      category: ["all", "freelance", "web"],
      liveLink: "https://anildhyaniassociates.com/",
      githubLink: null
    },
    {
      id: 6,
      title: "Confidential Marketing Site",
      tagline: "Client marketing website",
      year: "2025",
      description:
        "A full-stack marketing site for a client — responsive landing pages, a blog, an email-notifying contact form, and interactive UI. Details under NDA.",
      image: "/assets/projects/placeholder.png",
      tech: ["React", "Node.js", "Express.js", "Tailwind CSS"],
      category: ["all", "freelance", "web"],
      liveLink: null,
      githubLink: null
    },
    {
      id: 7,
      title: "RN Style Injector",
      tagline: "VS Code extension · 450+ devs",
      year: "2025",
      description:
        "A lightweight VS Code extension for React Native that scans a file and auto-adds missing styles to StyleSheet.create — existing styles untouched, zero setup, triggered with Alt + S. Open source, used by 450+ developers.",
      image: rn,
      tech: ["JavaScript", "React Native", "VS Code API"],
      category: ["all", "extension", "tool"],
      liveLink: "https://marketplace.visualstudio.com/items?itemName=rahul-dev.rn-style-injector",
      githubLink: "https://github.com/devrahuljourney/rn-style-injector"
    }
  ];

  // Sharpened narrative copy used across the revamped UI (facts unchanged).
  export const hero = {
    name: "Rahul Kumar Verma",
    role: "Full-Stack Software Engineer",
    badge: "Software Engineer @ Vitraga Solutions",
    line: "I build production software end to end — from data models and LLM features to the last pixel of the interface. Currently shipping AI-driven travel and SaaS products.",
    location: "India",
  };

  export const about = {
    kicker: "About",
    heading:
      "I turn ambiguous ideas into products people actually ship and use.",
    body: [
      "I'm a full-stack engineer at Vitraga Solutions, building production systems for a 260-year-old Indian travel brand and for an Australian NDIS provider. I went from intern to engineer doing it.",
      "My work leans into the hard parts: LLM features in real products, payment gateways, multi-tenant SaaS, and CRM pipelines that move 5,000+ leads. On the side I ship developer tooling used by 450+ people.",
    ],
    meta: "B.Tech CSE '26 · J.C. Bose University of Science & Technology · India",
  };

  export const stats = [
    { value: "5K+", label: "Leads synced via CRM" },
    { value: "10+", label: "Products & apps shipped" },
    { value: "200+", label: "Access-control rules built" },
    { value: "450+", label: "Devs using my tooling" },
  ];

  export const contactEmail = "devrahulverma9162@gmail.com";
  

  export const social = {
    linkedin: "https://www.linkedin.com/in/devrahuljourney/",
    instagram: "https://www.instagram.com/rhullvrma/",
    github: "https://github.com/devrahuljourney",
    x: "https://x.com/devrahuljourney",
    whatsapp: "https://wa.me/9162988797",
    leetcode: "https://leetcode.com/yourusername"
  };
  