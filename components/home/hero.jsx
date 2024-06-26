"use client";

import Image from "next/image";
import React from "react";

const Hero = () => {
  const handleScroll = () => {
    document.getElementById("who-we-are").scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <Image
        src="/pictures/exec-group.jpeg"
        fill
        alt="Group Pic"
        sizes="100vw"
        className="object-cover object-center"
        unoptimized
      />
      <div className="absolute inset-0 bg-black opacity-40"></div>
      <div className="flex flex-col items-center gap-y-4 sm:gap-y-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-georgia text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl tracking-widest">
        <div>Kappa Theta Pi</div>
        <div className="text-lg sm:text-xl md:text-2xl xl:text-3xl">Mu Chapter</div>
      </div>
      <div className="absolute font-georgia text-lg sm:text-xl md:text-3xl lg:text-4xl xl:text-5xl text-[#9B9B9B] left-1/2 transform -translate-x-1/2 bottom-12 sm:bottom-16 whitespace-nowrap">
        The University of Texas at Dallas
      </div>
      <div
        className="absolute left-1/2 transform -translate-x-1/2 bottom-4 cursor-pointer"
        onClick={handleScroll}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 sm:h-10 sm:w-10 text-[#9B9B9B]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
};

export default Hero;
