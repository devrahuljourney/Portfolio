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
      id: 1,
      title: "StudyNotion",
      description: "StudyNotion is a comprehensive EdTech platform that allows students to enroll in courses, track progress, and access learning materials. It includes user dashboards, course listings, payment integration via Razorpay, and real-time updates.",
      image: studynotion,
      tech: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS", "Razorpay"],
      category: ["all", "web", "edtech"],
      liveLink: "https://ed-tech-frontend-delta.vercel.app/",
      githubLink: "https://github.com/devrahuljourney/EdTech_frontend"
    },
    {
      id: 2,
      title: "Friendify",
      description: "Friendify is a full-stack social media web app built with the MERN stack. It features real-time chat using WebSocket, post creation, likes, comments, user profiles, following/unfollowing, and notifications. Designed for seamless interaction and modern UI experience.",
      image: friendify,
      tech: ["MongoDB", "Express", "React", "Node.js", "WebSocket", "Tailwind CSS"],
      category: ["all", "web", "social"],
      liveLink: "https://friendify-alpha.vercel.app/",
      githubLink: "https://github.com/devrahuljourney/Friendify_Frontend"
    },
    {
      id: 3,
      title: "CoSkill",
      description: "CoSkill is a React Native + Node.js-based skill-sharing and interview preparation platform. Users can sign up, select skills to explore or offer, get matched based on mutual skill interest, schedule mock interviews, chat in real-time using WebSocket + Redis, provide session feedback, and discover trending skills and active users nearby.",
      image: coskill,
      tech: ["React Native", "Node.js", "Express", "MongoDB", "Redis", "Expo"],
      category: ["all", "app", "mobile"],
      liveLink: "https://www.youtube.com/shorts/RPMTcxZlLVY",
      githubLink: "https://github.com/devrahuljourney/CoSkill_Frontend"
    },
    {
      id: 4,
      title: "GallyBajar E-commerce Platform",
      description: "A full-stack freelance e-commerce platform built with MERN. Includes separate dashboards for sellers, customers, and admins. Features product management, order processing, payment integration, Google authentication, and real-time updates. Fully responsive with modern UI and seamless user experience.",
      image: gallybajar,
      tech: ["MongoDB", "Express", "React", "Node.js", "Google Auth", "Cloudinary"],
      category: ["all", "freelance", "web"],
      liveLink: "https://gallybajar.com/",
      githubLink: null
    },
    {
      id: 5,
      title: "Anil Dhyani & Associates Website",
      description: "A professional law firm website built as a full-stack MERN freelance project. Includes service pages, blog section with Quill.js editor, contact form with email notifications, and a modern responsive UI. Designed for easy content management and client engagement.",
      image: anil,
      tech: ["MongoDB", "Express.js", "React", "Node.js", "Tailwind CSS", "Quill.js"],
      category: ["all", "freelance", "web"],
      liveLink: "https://anildhyaniassociates.com/",
      githubLink: null
    },
    {
      id: 6,
      title: "Confidential Marketing Website",
      description: "A full-stack marketing website built for a client. Includes responsive landing pages, blog section, contact form with email notifications, and modern UI components. Details are confidential.",
      image: "/assets/projects/placeholder.png",
      tech: ["React", "Node.js", "Express.js", "Tailwind CSS"],
      category: ["all", "freelance", "web"],
      liveLink: null,
      githubLink: null
    },
    {
      id: 7,
      title: "React Native Style Injector",
      description: "Used by 105+ developers. A lightweight VS Code extension for React Native that automatically scans your file and adds any missing styles to `StyleSheet.create`. Keeps existing styles intact, no setup required. Trigger with Alt + S for quick prototyping. Open source and super lightweight, saving developers time while building React Native apps.",
      image: rn,
      tech: ["JavaScript", "React Native", "VS Code Extension API"],
      category: ["all", "extension", "tool"],
      liveLink: "https://marketplace.visualstudio.com/items?itemName=rahul-dev.rn-style-injector",
      githubLink: "https://github.com/devrahuljourney/rn-style-injector"
    }
  ];
  

  export const social = {
    linkedin: "https://www.linkedin.com/in/devrahuljourney/",
    instagram: "https://www.instagram.com/rhullvrma/",
    github: "https://github.com/devrahuljourney",
    x: "https://x.com/devrahuljourney",
    whatsapp: "https://wa.me/9162988797",
    leetcode: "https://leetcode.com/yourusername"
  };
  