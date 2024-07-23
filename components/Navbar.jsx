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

  // Function to close the navbar
  const closeNav = () => {
    setNav(false);
  };

  // Array containing navigation items
  const navItems = [
    { id: 1, text: "Home", path: "/" },
    { id: 2, text: "About", path: "/about-us" },
    { id: 3, text: "Brothers", path: "/brothers" },
    { id: 4, text: "Recruitment", path: "/recruitment" },
    { id: 5, text: "Blog", path: "/blog" },
    { id: 6, text: "Gallery", path: "/gallery" },
    { id: 7, text: "Contact Us", path: "/contact-us" },
  ];

  return (
    <div className="fixed bg-[#0F0F0F] w-full z-50 h-24">
      <div className="bg-[#0F0F0F] flex justify-between items-center h-24 max-w-[1200px] mx-auto px-4 text-white">
        {/* Desktop Navigation - Hidden on Mobile */}
        <div className="hidden md:flex space-x-6">
          {navItems.slice(1, 4).map((item) => (
            <li
              key={item.id}
              className="list-none relative p-4 cursor-pointer group"
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
        </div>

        {/* Logo - Centered */}
        <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
          <Link href={navItems[0].path}>
            <h1 className="text-5xl font-bold font-[Greek] text-primary">
              KΘΠ
            </h1>
          </Link>
        </div>

        {/* Right Navigation - Hidden on Mobile */}
        <div className="hidden md:flex space-x-6">
          {navItems.slice(4).map((item) => (
            <li
              key={item.id}
              className="list-none relative p-4 cursor-pointer group"
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
        </div>

        {/* Mobile Navigation Icon */}
        <div onClick={handleNav} className="md:hidden z-50 absolute right-4">
          {nav ? (
            <AiOutlineClose size={20} className="text-white" />
          ) : (
            <AiOutlineMenu size={20} className="text-white" />
          )}
        </div>

        {/* Mobile Navigation Menu */}
        <ul
          className={`absolute md:hidden h-screen w-full top-24 bottom-0 right-0 ease-in-out transition-transform transform duration-700 bg-[#0F0F0F] z-50 ${
            nav ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {navItems.map((item) => (
            <li key={item.id} className="p-4 text-center text-white">
              <Link href={item.path} onClick={closeNav}>
                {item.text}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
