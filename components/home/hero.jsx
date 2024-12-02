"use client";

import Image from "next/image";
import React from "react";
import { FaArrowDown } from "react-icons/fa";

const Hero = () => {
  const handleScroll = () => {
    document.getElementById("who-we-are").scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-white"></div>

      {/* Title Section */}
      <div className="flex flex-col items-center gap-y-2 sm:gap-y-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center font-poppins text-black px-4">
        <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold">
          Kappa Theta Pi - Mu Chapter
        </div>
        <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-medium">
          at The University of Texas at Dallas
        </div>
      </div>

      {/* Learn More Section */}
      <div
        className="absolute text-lg sm:text-xl md:text-2xl text-accent font-poppins left-1/2 transform -translate-x-1/2 bottom-8 sm:bottom-12 lg:bottom-16 flex items-center gap-x-2 cursor-pointer"
        onClick={handleScroll}
      >
        <span>Learn more about us</span>
        <FaArrowDown className="text-accent text-lg sm:text-xl md:text-2xl" />
      </div>
    </div>
  );
};

export default Hero;
