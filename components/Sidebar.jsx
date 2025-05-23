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
  { label: "Profile", href: "/dashboard/profile" },
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
      <aside className="bg-white px-6 py-10 text-black space-y-6 font-sans">
      <nav className="space-y-4">
    {navItems.map(({ label, href }) => (
      <Link
        key={label}
        href={href}
        className={`block text-left text-base font-medium hover:text-[#1E3D2F] hover:underline transition ${
          pathname === href ? "underline text-black" : ""
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
