"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Homepage", path: "/dashboard" },
  { label: "Attendance Records", path: "/dashboard/attendance" },
  { label: "Merch", path: "/dashboard/merch" },
  { label: "RSVPED Events", path: "/dashboard/rsvp" },
  { label: "Profile", path: "/dashboard/profile" },
  { label: "Admin", path: "/dashboard/admin" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="bg-white px-6 py-10 font-['Inter'] border-r border-black shadow-sm space-y-6 h-screen">
      <nav className="space-y-4">
        {navItems.map((item, i) => (
          <Link href={item.path} key={i}>
            <span
              className={`block text-left text-base font-medium transition hover:text-primary hover:underline ${
                pathname === item.path ? "font-bold underline" : ""
              }`}
            >
              {item.label}
            </span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
