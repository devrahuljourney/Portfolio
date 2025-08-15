import React from "react";
export default function MiddleSection() {
  const handleContactClick = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    } else {
      alert("Contact section not found. You can add one with id='contact'");
    }
  };

  return (
    <div className="min-h-[450px]  flex flex-col justify-center items-center  px-2 md:px-8 text-center space-y-6 sm:space-y-8 font-body relative">
      <h1 data-aos="fade-down" className="text-primary font-heading text-3xl sm:text-4xl md:text-6xl tracking-wide select-text">
        Rahul Kumar Verma
      </h1>

      <div className="flex items-center gap-3 sm:gap-4 max-w-xs w-full justify-center">
        <div className="flex-grow h-1 bg-primary-fade rounded-full"></div>
        <p data-aos="fade-up" className="text-secondary uppercase tracking-widest font-semibold text-xs sm:text-sm md:text-base select-text">
          Software Engineer
        </p>
        <div className="flex-grow h-1 bg-primary-fade rounded-full"></div>
      </div>

      <p className="text-white max-w-lg font-bold text-base sm:text-lg md:text-xl leading-snug select-text px-2">
        From <span className="text-primary">idea</span> to{" "}
        <span className="text-primary">launch</span>, I build software that’s
        fast, scalable, and tailored to your needs. Let’s work together to turn
        your goals into reality.
      </p>

      <div className="w-20 sm:w-24 h-[3px] bg-primary-fade rounded-full mx-auto"></div>

      <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 w-full sm:w-auto justify-center">
  <a
    href="/assests/Rahul_Kumar_FullStack_RESUME.pdf"
    download
    className="group relative overflow-hidden border-2 border-[#b9fd50] text-[#b9fd50] font-semibold px-6 py-3 sm:px-8 rounded-lg transition-all duration-300 ease-out
      hover:text-black"
  >
    <span className="relative z-10">Download Resume</span>
    <span className="absolute inset-0 bg-[#b9fd50] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></span>
  </a>

  <a href="#contact"
    className="group relative overflow-hidden bg-[#b9fd50] hover:bg-[rgba(185,253,80,0.15)] text-black font-semibold px-6 py-3 sm:px-8 rounded-lg transition-all duration-300 ease-out
      hover:text-[#b9fd50]"
  >
    <span className="relative z-30">Let’s Talk</span>
    <span className="absolute inset-0  -translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></span>
  </a>
</div>

    </div>
  );
}
