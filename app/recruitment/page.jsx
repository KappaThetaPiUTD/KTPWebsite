"use client";

import React, { useState } from "react";
import Image from "next/image";
import FormPage from "./form";

const events = [
  {
    date: "9/3",
    event: "Info Session",
    location: "GR.428",
    time: "7PM",
    rsvpLink: "https://tally.so/r/wooqbO", // Replace with actual RSVP link when available
  },
  {
    date: "9/4",
    event: "Info Session",
    location: "ECSW 1.365",
    time: "7PM",
    rsvpLink: "https://tally.so/r/mD5jqN", // Replace with actual RSVP link when available
  },
  {
    date: "9/5",
    event: "Meet the Bros",
    location: "Science Courtyard",
    time: "7PM",
    rsvpLink: "https://tally.so/r/wooq9O", // Replace with actual RSVP link when available
  },
  {
    date: "9/9",
    event: "Game Night",
    location: "NS Skylounge",
    time: "7PM",
    rsvpLink: "https://tally.so/r/3x2AVv", // Replace with actual RSVP link when available
  },
  {
    date: "9/10",
    event: "KTP Speed Dating",
    location: "GR 3.420",
    time: "7PM",
    rsvpLink: "https://tally.so/r/wQdboX", // Replace with actual RSVP link when available
  },
  {
    date: "9/11",
    event: "Professional Event (Invite Only)",
    location: "Location will be sent with invite",
    time: "7PM",
    rsvpLink: "", // Replace with actual RSVP link when available
  },
];

const RecruitmentPage = () => {
  const handleRSVPClick = (link) => {
    if (!link) {
      alert(
        "You will be reached out personally for the Profressional Event if you are invited. Be sure to check your email or instgram closer to the date."
      );
    } else {
      window.open(link, "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-start pt-24 px-4 md:px-8 text-black">
      {/* Page Titles */}
      <div className="text-primary text-[28px] sm:text-[36px] md:text-header1 font-bold font-poppins text-center mb-4">
        Recruitment
      </div>
      <div className="text-black text-paragraph sm:text-[36px] md:text-header1 font-poppins text-center mb-4">
        We will release more information closer to Spring 2025.
      </div>
    </div>
  );
};

export default RecruitmentPage;