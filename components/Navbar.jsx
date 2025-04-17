"use client";
import React, { useState } from "react";
import Link from "next/link";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const [isHovered, setIsHovered] = useState(null);

  const handleNav = () => {
    setNav(!nav);
  };

  const closeNav = () => {
    setNav(false);
  };

  // Navigation items (single "Home" item)
  const navItems = [
    { id: 1, text: "HOME", path: "/" },
    { id: 2, text: "ABOUT", path: "/about-us" },
    { id: 3, text: "BROTHERS", path: "/brothers" },
    { id: 4, text: "RECRUITMENT", path: "/recruitment" },
    { id: 5, text: "BLOG", path: "/blog" },
    { id: 6, text: "GALLERY", path: "/gallery" },
    { id: 7, text: "CONTACT", path: "/contact-us" },
    { id: 8, text: "DASHBOARD", path: "/dashboard" },
    { id: 9, text: "SIGN IN", path: "/sign-in" },
  ];

  return (
    <div className="fixed bg-[#ffffff] w-full z-50 h-24">
      <div className="flex justify-between items-center h-24 max-w-[1200px] mx-auto px-4 text-black">
        {/* Logo on the left */}
        <div className="text-center">
          <Link href="/">
            <h1 className="text-5xl text-primary text-[#9B1E2E] cursor-pointer">
              𝚱𝚯𝚷
            </h1>
          </Link>
        </div>

        {/* Desktop Navigation - Right Aligned */}
        <div className="hidden md:flex">
          {navItems.map((item) => (
            <li
              key={item.id}
              className="list-none relative p-4 cursor-pointer group"
              onMouseEnter={() => setIsHovered(item.id)}
              onMouseLeave={() => setIsHovered(null)}
            >
              <Link href={item.path}>
                {item.text}
              </Link>
              <div
                className={`absolute bottom-0 left-0 right-0 h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-center`}
                style={{ width: isHovered === item.id ? "100%" : "0" }}
              />
            </li>
          ))}
        </div>

        {/* Mobile Navigation Icon */}
        <div onClick={handleNav} className="md:hidden z-50">
          {nav ? (
            <AiOutlineClose size={20} className="text-[#000000]" />
          ) : (
            <AiOutlineMenu size={20} className="text-[#000000]" />
          )}
        </div>

        {/* Mobile Navigation Menu */}
        <ul
          className={`absolute md:hidden h-screen w-full top-24 bottom-0 right-0 ease-in-out transition-transform transform duration-700 bg-[#FFFFFF] z-50 ${
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
