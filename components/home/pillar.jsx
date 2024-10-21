import React from "react";

const Pillar = ({ number, title, body }) => {
  return (
    <div className="flex flex-row items-center gap-x-8 bg-white shadow-lg p-4 rounded-lg">
      <div className="text-5xl font-bold text-gray">
        {number}
      </div>
      <div>
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-gray">
          {body}
        </p>
      </div>
    </div>
  );
};

export default Pillar;
