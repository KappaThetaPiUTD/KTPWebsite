"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const [isHovered, setIsHovered] = useState(null);
  const pathname = usePathname();

  const handleNav = () => {
    setNav(!nav);
  };

  const closeNav = () => {
    setNav(false);
  };

  const navItems = [
    { id: 1, text: "HOME", path: "/" },
    { id: 2, text: "ABOUT", path: "/about-us" },
    { id: 3, text: "BROTHERS", path: "/brothers" },
    { id: 4, text: "RECRUITMENT", path: "/recruitment" },
    { id: 5, text: "BLOG", path: "/blog" },
    { id: 6, text: "GALLERY", path: "/gallery" },
    { id: 7, text: "CONTACT", path: "/contact-us" },
  ];

  return (
    <div className="fixed bg-[#ffffff] w-full z-50 h-24">
      <div className="flex justify-between items-center h-24 max-w-[1200px] mx-auto px-4 text-black">
        {/* Logo */}
        <div className="text-center">
          <Link href="/">
            <h1 className="text-5xl text-primary cursor-pointer">𝚱𝚯𝚷</h1>
          </Link>
        </div>

        {/* Desktop Nav */}
        <ul className="hidden md:flex">
          {navItems.map((item) => (
            <Link key={item.id} href={item.path}>
              <li
                className={`list-none relative p-4 cursor-pointer group ${
                  pathname === item.path ? "font-semibold text-primary" : ""
                }`}
                onMouseEnter={() => setIsHovered(item.id)}
                onMouseLeave={() => setIsHovered(null)}
              >
                {item.text}
                <div
                  className={`absolute bottom-0 left-0 right-0 h-0.5 bg-primary transition-transform duration-500 origin-center ${
                    pathname === item.path || isHovered === item.id
                      ? "scale-x-100"
                      : "scale-x-0"
                  }`}
                />
              </li>
            </Link>
          ))}
        </ul>

        {/* Mobile Icon */}
        <div onClick={handleNav} className="md:hidden z-50">
          {nav ? (
            <AiOutlineClose size={20} className="text-black" />
          ) : (
            <AiOutlineMenu size={20} className="text-black" />
          )}
        </div>

        {/* Mobile Nav */}
        <ul
          className={`absolute md:hidden h-screen w-full top-24 bottom-0 right-0 ease-in-out transition-transform transform duration-700 bg-white z-50 ${
            nav ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {navItems.map((item) => (
            <Link key={item.id} href={item.path}>
              <li
                onClick={closeNav}
                className={`p-4 text-center ${
                  pathname === item.path
                    ? "text-primary font-semibold"
                    : "text-black"
                }`}
              >
                {item.text}
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
