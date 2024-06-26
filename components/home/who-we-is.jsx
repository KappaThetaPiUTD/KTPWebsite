import Image from "next/image";
import React from "react";

const WhoWeIs = () => {
  return (
    <div
      id="who-we-are"
      className="flex flex-col items-center justify-around w-screen h-[75vh] p-8 bg-[#3C3C3C]"
    >
      <div className="font-poppins font-bold text-header1 text-[#188C5D] text-center">
        Who are we?
      </div>
      <div className="relative w-full max-w-4xl h-[50vh] md:h-[60vh] lg:h-[70vh]">
        <Image
          src="/pictures/computer1.png"
          layout="fill"
          objectFit="contain"
          alt="Computer Icon"
          className="absolute"
        />
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-white px-4 sm:px-6 md:px-12 lg:px-16 xl:px-20 max-w-[70%] font-poppins text-center leading-relaxed text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl">
            Welcome to Kappa Theta Pi Mu Chapter at UT Dallas! We&apos;re all
            about fostering tech skills, creativity, and community. Join us for
            workshops, activities, and vibrant social events to grow
            professionally, make connections, and shape the future of tech.
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhoWeIs;
