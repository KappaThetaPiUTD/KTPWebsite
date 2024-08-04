import React from "react";

export const metadata = {
  title: "Kappa Theta Pi UTD - Blog",
  description:
    "Keep up with our blog to stay updated on our latest events and news",
};

const BlogPage = () => {
  return (
    <div className="min-h-screen bg-[#0F0F0F] flex flex-col items-center justify-start pt-24 px-4 md:px-8">
      <div className="flex flex-col items-center space-y-4 mb-10">
        <div className="text-primary text-[32px] md:text-header1 font-bold font-poppins text-center">
          Blog
        </div>
        <div className="text-white text-[24px] md:text-[45px] text-center">
          We are currently in the works of setting up our Blog!
        </div>
      </div>
      <div className="flex flex-col items-center space-y-8">
        <div className="text-white text-[18px] md:text-header3 text-center">
          Check back here closer to the Fall 2024 rush.
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
