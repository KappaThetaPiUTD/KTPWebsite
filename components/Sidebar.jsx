'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';

const navItems = [
  { label: "Homepage", href: "/dashboard" },
  { label: "Attendance Records", href: "/dashboard/attendance" },
  { label: "Merch", href: "/dashboard/merch" },
  { label: "RSVPED Events", href: "/dashboard/rsvp" },
  { label: "Admin", href: "/dashboard/admin" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <div className="md:hidden p-4">
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className="bg-white px-6 py-8 text-black font-inter space-y-6 hidden md:block min-w-[200px]">
        {/* Logo */}
        <h2 className="text-2xl font-bold text-[#1E3D2F] tracking-wide">ΚΘΠ</h2>

        {/* Welcome label */}
        <p className="text-sm text-gray-600 font-medium uppercase tracking-wide">Welcome</p>

        {/* Navigation */}
        <nav className="space-y-4">
          {navItems.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={`block text-left text-base font-medium transition duration-150 hover:underline ${
                pathname === href ? 'underline decoration-black font-semibold' : ''
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
