import Image from "next/image";
import React from "react";

const Hero = () => {
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
      <div className="flex flex-col items-center gap-y-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-georgia text-4xl md:text-6xl lg:text-7xl xl:text-8xl tracking-widest text-shadow">
        <div>Kappa Theta Pi</div>
        <div className="text-xl md:text-2xl xl:text-3xl">Mu Chapter</div>
      </div>
      <div className="absolute font-georgia text-xl md:text-3xl lg:text-4xl xl:text-5xl text-[#9B9B9B] left-1/2 transform -translate-x-1/2 bottom-6 whitespace-nowrap">
        The University of Texas at Dallas
      </div>
    </div>
  );
};

export default Hero;