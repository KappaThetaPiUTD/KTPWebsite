import React from "react";
import Pillar from "./pillar";

const Pillars = () => {
  return (
    <div className="flex flex-col gap-y-16 items-center justify-around w-screen p-8 bg-[#0f0f0f]">
      <div className="font-poppins font-bold text-header1 text-[#188C5D]">
        Our Pillars
      </div>
      <div className="flex justify-around gap-x-8 gap-y-16 flex-wrap">
        <Pillar
          isGreen
          title="🎓 Academic Support"
          body="We offer a supportive network of peers and mentors, providing invaluable guidance and assistance to help members excel academically in their tech-related studies."
        />
        <Pillar
          title="💻 Tech. Advancement"
          body="Our focus on continuous learning and hands-on experience empowers members to expand their technical expertise and stay at the forefront of industry advancements."
        />
        <Pillar
          isGreen
          title="🤝 Alumni Connections"
          body="With pride, we cultivate tomorrow's tech leaders by connecting current members with accomplished alumni, offering valuable insights and mentorship for their journey ahead."
        />
        <Pillar
          title="🌱 Social Growth"
          body="Through our diverse range of social events and activities, we create opportunities for members to connect, bond, and forge lasting friendships within our community and brotherhood."
        />
        <Pillar
          isGreen
          title="📈 Prof. Development"
          body="We're committed to nurturing the future leaders of tech through tailored programs and mentorship, ensuring our members are equipped for success."
        />
      </div>
    </div>
  );
};

export default Pillars;
