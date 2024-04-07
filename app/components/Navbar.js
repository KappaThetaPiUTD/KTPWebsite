"use client";
import React, { useState } from 'react';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';

const Navbar = () => {
  // State to manage the navbar's visibility
  const [nav, setNav] = useState(false);

  // Toggle function to handle the navbar's display
  const handleNav = () => {
    setNav(!nav);
  };

  // Array containing navigation items
  const navItems = [
    { id: 1, text: 'About' },
    { id: 2, text: 'Brothers' },
    { id: 3, text: 'Recruitment' },
    { id: 4, text: 'Blog' },
    { id: 5, text: 'Gallery' },
    { id: 6, text: 'Contact Us' },
  ];

  return (
    <div className='bg-black flex justify-around items-center h-24 max-w-auto mx-auto px-4 text-white'>
    {/* Desktop Navigation - Hidden on Mobile */}
    <div className="flex-grow flex justify-start">
    <ul className='hidden md:flex'>
      {navItems.slice(0, 3).map(item => (
        <li
          key={item.id}
          className={`p-4 m-2 cursor-pointer hover:underline-custom`}
        >
          {item.text}
        </li>
      ))}
    </ul>
    </div>

    {/* Logo - Centered on Desktop, Left on Mobile */}
    <div className='flex-grow-0 flex justify-center px-4 max-w-[100px] mx-auto'>
    <h1 className='text-3xl font-bold text-[#00df9a]'>KΘΠ</h1>
    </div>

    {/* Right Navigation - Hidden on Mobile */}
    <div className="flex-grow flex justify-end">
    <ul className='hidden md:flex'>
      {navItems.slice(3).map(item => (
        <li
          key={item.id}
          className='p-4 m-2 cursor-pointer hover:underline-custom'
        >
          {item.text}
        </li>
        ))}
      </ul>
      </div>

   

      {/* Mobile Navigation Icon */}
      <div onClick={handleNav} className='md:hidden z-50'>
        {nav ? <AiOutlineClose size={20} className="text-white" /> : <AiOutlineMenu size={20} className="text-white" />}
      </div>

      {/* Mobile Navigation Menu */}
      <ul
        className={
          `absolute md:hidden w-full bg-black top-24 bottom-0 ease-in-out duration-500 ${nav ? "left-0" : "left-[-100%]" }`
        }
      >
        {navItems.map(item => (
          <li
            key={item.id}
            className='p-4 border-b border-gray-600'
          >
            {item.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Navbar;
