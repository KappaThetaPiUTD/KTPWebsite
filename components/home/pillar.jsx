import React from "react";

const Pillar = ({ isGreen, title, body }) => {
  return (
    <div
      className={`flex flex-col justify-center items-center p-8 gap-y-4 w-[80%] xl:w-1/4 aspect-w-1 aspect-h-1 rounded-xl font-poppins transition-transform transform hover:scale-105 hover:shadow-lg ${
        isGreen ? "bg-[#008234] text-white" : "bg-white text-black"
      }`}
    >
      <div className="font-medium text-header4 text-center">{title}</div>
      <div className="font-normal text-paragraph text-center">{body}</div>
    </div>
  );
};

export default Pillar;