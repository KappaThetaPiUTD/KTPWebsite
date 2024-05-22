import React from "react";

const ReactToast = ({ title }) => {
  return (
    <div className={"w-full h-full font-josefinSans"}>
      <div className="px-4 space-y-1 leading-6">
        {title && <div className="font-bold">{title}</div>}
      </div>
    </div>
  );
};
export default ReactToast;
