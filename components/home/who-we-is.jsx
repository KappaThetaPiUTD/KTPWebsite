import Image from "next/image";
import React from "react";

const WhoWeIs = () => {
  return (
    <div className="flex flex-col items-center justify-around w-screen h-[75vh] p-8 bg-[#3C3C3C]">
      <div className="font-poppins font-bold text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-[#188C5D]">
        Who are we?
      </div>
      <div className="relative h-3/4 aspect-[1.26/1]">
        <Image
          src="/pictures/computer.png"
          width={700}
          height={700}
          alt="Computer Icon"
          className="bottom-0 absolute"
        />
        <div className="relative z-10 text-white px-24 pt-28 font-poppins">
          Who we is?
        </div>
      </div>
    </div>
  );
};

export default WhoWeIs;
