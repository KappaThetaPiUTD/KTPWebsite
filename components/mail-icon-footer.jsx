"use client";

import React from "react";
import { CiMail } from "react-icons/ci";

const MailIcon = () => {
  return (
    <button
      onClick={() => (window.location = "mailto:kappathetapiutd@gmail.com")}
    >
      <CiMail className="flex items-center" size={50} />
    </button>
  );
};

export default MailIcon;
