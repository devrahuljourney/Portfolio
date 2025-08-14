import { social } from "@/constant/data";


export default function Footer() {
    return (
      <footer className="backdrop-blur-lg md:pb-[5%] pb-[13%] bg-white/5 border-t border-white/10 text-white">
        <div className="max-w-7xl  mx-auto px-6 py-8 sm:py-10">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Left Section */}
            <div className="text-center sm:text-left text-sm text-gray-400">
              © {new Date().getFullYear()} Rahul. Made with ❤️ and lots of coffee.
            </div>
  
            {/* Middle Links */}
            <div className="flex gap-6 text-sm text-gray-300">
              <a
                href="#home"
                className="hover:text-[#B9FD50] transition-colors"
              >
                Home
              </a>
              <a
                href="#experience"
                className="hover:text-[#B9FD50] transition-colors"
              >
                Experience
              </a>
              <a
                href="#skills"
                className="hover:text-[#B9FD50] transition-colors"
              >
                Skill
              </a>
              <a
                href="#projects"
                className="hover:text-[#B9FD50] transition-colors"
              >
                Projects
              </a>
              <a
                href="#contact"
                className="hover:text-[#B9FD50] transition-colors"
              >
                Contact
              </a>
            </div>
  
            {/* Right Section - Social Icons */}
            <div className="flex gap-4">
              <a
                href={social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#B9FD50] transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.94c.58.11.79-.25.79-.56v-2.03c-3.2.7-3.87-1.54-3.87-1.54-.53-1.35-1.29-1.71-1.29-1.71-1.06-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.73 1.27 3.4.97.1-.76.41-1.27.74-1.56-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.43-2.69 5.4-5.25 5.68.42.36.8 1.08.8 2.18v3.23c0 .31.21.68.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
                </svg>
              </a>
              <a
                href={social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#B9FD50] transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 0h-14C2.24 0 0 2.24 0 5v14c0 2.76 2.24 5 5 5h14c2.75 0 5-2.24 5-5V5c0-2.76-2.25-5-5-5zm-11.53 20H3.94V9h3.53v11zM5.75 7.69c-1.12 0-2.03-.91-2.03-2.03S4.63 3.63 5.75 3.63 7.78 4.54 7.78 5.66s-.91 2.03-2.03 2.03zM20.06 20h-3.53v-5.36c0-1.28-.02-2.93-1.78-2.93-1.78 0-2.05 1.39-2.05 2.84V20h-3.53V9h3.39v1.5h.05c.47-.89 1.61-1.83 3.31-1.83 3.54 0 4.19 2.33 4.19 5.37V20z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    );
  }
  