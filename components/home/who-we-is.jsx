import Image from "next/image";
import React from "react";

const WhoWeIs = () => {
  return (
    <div
      id="who-we-are"
      className="flex flex-col md:flex-row items-center justify-center w-screen h-1000 p-8 bg-primary"
      style={{ scrollMarginTop: "6rem" }}
    >
      {/* Left Side: Image */}
      <div className="flex-shrink-0 w-[90%] md:w-1/3 max-w-sm bg-white rounded-lg overflow-hidden border-[5px] border-white md:mr-6">
        <Image
          src="https://res.cloudinary.com/dha44tosd/image/upload/v1732829630/Assets%20for%20website/IMG_7602_1_xih7px.jpg" // Replace with your Cloudinary URL
          alt="KTP Members"
          layout="responsive"
          width={300}
          height={300}
          className="rounded-lg object-cover"
        />
      </div>

      {/* Right Side: Text */}
      <div className="flex flex-col items-start text-left w-[90%] md:w-1/2 text-white">
        <h2 className="font-poppins font-bold text-header1 mb-4">Who Are We?</h2>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed">
          Welcome to Kappa Theta Pi Mu Chapter at UT Dallas! We&apos;re all
          about fostering tech skills, creativity, and community. Join us for
          workshops, activities, and vibrant social events to grow
          professionally, make connections, and shape the future of tech.
        </p>
      </div>
    </div>
  );
};

export default WhoWeIs;
