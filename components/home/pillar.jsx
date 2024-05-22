import React from "react";

const Pillar = ({ isGreen, title, body }) => {
  return (
    <div
      className="flex flex-col p-12 gap-y-8 w-[90%] xl:w-1/3 aspect-[1.5/1] rounded-xl font-poppins"
      style={{
        backgroundColor: isGreen ? "#008234" : "white",
        color: isGreen ? "white" : "black",
      }}
    >
      <div className="font-medium text-2xl md:text-4xl">{title}</div>
      <div className="font-normal text-base md:text-2xl">{body}</div>
    </div>
  );
};

export default Pillar;
