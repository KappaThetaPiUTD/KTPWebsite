import Image from "next/image";
import React from "react";

const WhoWeIs = () => {
  return (
    <div className="flex flex-col items-center justify-around w-screen h-[75vh] p-8 bg-[#3C3C3C]">
      <div className="font-poppins font-bold text-header1 text-[#188C5D]">
        Who are we?
      </div>
      <div className="relative h-3/5 aspect-[1.4/1]">
        <Image
          src="/pictures/computer1.png"
          width={700}
          height={700}
          alt="Computer Icon"
          className="bottom-0 absolute"
        />
        <div className="relative z-10 text-white px-[15%] top-1/4 font-poppins ">
          Welcome to Kappa Theta Pi Mu Chapter at UT Dallas! We&apos;re all
          about fostering tech skills, creativity, and community. Join us for
          workshops, activities, and vibrant social events to grow
          professionally, make connections, and shape the future of tech.{" "}
        </div>
      </div>
    </div>
  );
};

export default WhoWeIs;
