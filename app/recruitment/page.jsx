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
    location: "NS Skylounge",
    time: "7PM",
    rsvpLink: "https://tally.so/r/wooq9O", // Replace with actual RSVP link when available
  },
  {
    date: "9/9",
    event: "Game Night",
    location: "TBA",
    time: "7PM",
    rsvpLink: "https://tally.so/r/3x2AVv", // Replace with actual RSVP link when available
  },
  {
    date: "9/10",
    event: "KTP Speed Dating",
    location: "TBA",
    time: "7PM",
    rsvpLink: "https://tally.so/r/wQdboX", // Replace with actual RSVP link when available
  },
  {
    date: "9/11",
    event: "Professional Event (Invite Only)",
    location: "TBA",
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
    <div className="min-h-screen bg-[#0F0F0F] flex flex-col items-center justify-start pt-24 px-4 md:px-8 text-white">
      {/* Page Titles */}
      <div className="text-[#9B1E2E] text-[28px] sm:text-[36px] md:text-header1 font-bold font-poppins text-center mb-4">
        Recruitment
      </div>

      <div className="text-white text-[22px] sm:text-[28px] md:text-header2 font-bold font-poppins text-center mb-8">
        Fall 2024 Rush
      </div>

      {/* Logo */}
      <div className="mb-10">
        <Image
          src="/pictures/fall 2024 rush logo.jpg"
          alt="Fall 2024 Rush Logo"
          width={150}
          height={150}
          className="object-contain sm:w-[200px] sm:h-[200px]"
        />
      </div>

      {/* Events Grid */}
      <div className="flex flex-col items-center w-full mb-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          {events.map((event, index) => (
            <div
              key={index}
              className="bg-[#1a1a1a] p-6 rounded-md shadow-lg flex flex-col items-center text-center"
            >
              <div className="text-xl sm:text-2xl font-bold mb-2">
                {event.date}
              </div>
              <div className="text-lg sm:text-xl mb-2">{event.event}</div>
              <div className="text-md sm:text-lg mb-2">{event.location}</div>
              <div className="text-md sm:text-lg mb-2">{event.time}</div>
              <button
                onClick={() => handleRSVPClick(event.rsvpLink)}
                className="mt-4 px-4 py-2 bg-[#5d6b79] text-white rounded hover:bg-secondary transition"
              >
                RSVP
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Interest Form Section */}
      <div className="text-white text-[24px] sm:text-[28px] md:text-header2 font-bold font-poppins text-center mb-4">
        Interest Form
      </div>

      <FormPage />
    </div>
  );
};

export default RecruitmentPage;