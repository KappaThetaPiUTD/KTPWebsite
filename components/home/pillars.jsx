import React from "react";
import Pillar from "./pillar";

const Pillars = () => {
  return (
    <div className="flex flex-col gap-y-16 items-center justify-around w-screen p-8 bg-black">
      <div className="font-poppins font-bold text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-[#188C5D]">
        Our Pillars
      </div>
      <div className="flex justify-around gap-x-8 gap-y-16 flex-wrap">
        <Pillar
          isGreen
          title="🎓 Academic Support"
          body="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        />
        <Pillar
          title="💻 Tech. Advancement"
          body="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        />
        <Pillar
          title="🤝 Alumni Connections"
          body="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        />
        <Pillar
          title="🌱 Social Growth"
          body="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        />
        <Pillar
          title="📈 Prof. Development"
          body="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        />
      </div>
    </div>
  );
};

export default Pillars;
