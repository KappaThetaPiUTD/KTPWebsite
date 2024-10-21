"use client";

import Image from "next/image";
import React from "react";

const Hero = () => {
  const handleScroll = () => {
    document.getElementById("who-we-are").scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">

      <div className="absolute inset-0 bg-white"></div>
      <div className="flex flex-col items-center text-bold gap-y-4 sm:gap-y-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-poppins text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl tracking--2 text-accent">
        <div>Kappa Theta Pi - Mu Chapter</div>
        <div className="text-lg sm:text-xl md:text-2xl xl:text-3xl">at The University of Texas at Dallas</div>
      </div>
      <div className="absolute font-poppins text-lg sm:text-xl md:text-3xl lg:text-4xl xl:text-5xl text-accent left-1/2 transform -translate-x-1/2 bottom-12 sm:bottom-16 whitespace-nowrap">
        Learn more about us
      </div>
    </div>
  );
};

export default Hero;
