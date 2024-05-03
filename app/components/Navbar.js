"use client";
import React, { useState } from "react";
import Link from "next/link";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";

const Navbar = () => {
  // State to manage the navbar's visibility
  const [nav, setNav] = useState(false);
  const [isHovered, setIsHovered] = useState(null);

  // Toggle function to handle the navbar's display
  const handleNav = () => {
    setNav(!nav);
  };

  // Array containing navigation items
  const navItems = [
    { id: 1, text: "Home", path: "/" },
    { id: 2, text: "About", path: "/about" },
    { id: 3, text: "Brothers", path: "/brothers" },
    { id: 4, text: "Recruitment", path: "/recruitment" },
    { id: 5, text: "Blog", path: "/blog" },
    { id: 6, text: "Gallery", path: "/gallery" },
    { id: 7, text: "Contact Us", path: "/contact" },
  ];

  return (
    <div className="bg-[#0F0F0F] flex justify-around items-center h-24 max-w-[950px] mx-auto px-4 text-white">
      {/* Desktop Navigation - Hidden on Mobile */}

      <div className="flex-grow flex justify-start transition duration-500">
        <ul className="hidden md:flex">
          {navItems.slice(1, 4).map((item) => (
            <li
              key={item.id}
              className="relative p-4 m-2 cursor-pointer group"
              onMouseEnter={() => setIsHovered(item.id)}
              onMouseLeave={() => setIsHovered(null)}
            >
              <Link href={item.path}>{item.text}</Link>
              <div
                className={`absolute bottom-0 left-0 right-0 h-0.5 bg-[#00df9a] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-center`}
                style={{ width: isHovered === item.id ? "100%" : "0" }}
              />
            </li>
          ))}
        </ul>
      </div>

      {/* Logo - Centered on Desktop, Left on Mobile */}
      <div className="mx-auto absolute left-0 right-0 text-center w-[100px]">
        <Link href={navItems[0].path}>
            <h1 className="text-5xl font-bold font-[Greek] text-[#00df9a]">
              KΘΠ
            </h1>
        </Link>
      </div>

      {/* Right Navigation - Hidden on Mobile */}
      <div className="flex-grow flex justify-end transition duration-500">
        <ul className="hidden md:flex">
          {navItems.slice(4).map((item) => (
            <li
              key={item.id}
              className="relative p-4 m-2 cursor-pointer group"
              onMouseEnter={() => setIsHovered(item.id)}
              onMouseLeave={() => setIsHovered(null)}
            >
              <Link href={item.path}>{item.text}</Link>
              <div
                className={`absolute bottom-0 left-0 right-0 h-0.5 bg-[#00df9a] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-center`}
                style={{ width: isHovered === item.id ? "100%" : "0" }}
              />
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile Navigation Icon */}
      <div onClick={handleNav} className="md:hidden z-100">
        {nav ? (
          <AiOutlineClose size={20} className="text-white" />
        ) : (
          <AiOutlineMenu size={20} className="text-white" />
        )}
      </div>

      {/* Mobile Navigation Menu */}
      <ul
        className={`absolute md:hidden w-full bg-[#0F0F0F] top-24 bottom-0 ease-in-out duration-700 ${
          nav ? "left-0" : "left-[-100%]"
        }`}
      >
        {navItems.map((item) => (
          <li key={item.id} className="p-4 border-b border-black-600">
            <Link href={item.path}>{item.text}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Navbar;
