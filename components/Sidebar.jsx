// components/Sidebar.jsx
"use client";

import { useRouter } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();

  const navItems = [
    { label: "HOMEPAGE", path: "/dashboard" },
    { label: "ATTENDANCE RECORDS", path: "/dashboard/attendance" },
    { label: "MERCH", path: "/dashboard/merch" },
    { label: "EVENTS AND RSVP", path: "/dashboard/rsvp" },
    { label: "FAMILY TREE", path: "/dashboard/family-tree" },
    { label: "PROFILE", path: "/dashboard/profile" },
    { label: "ADMIN", path: "/dashboard/admin" },
  ];

  return (
    <aside className="bg-white px-6 py-10 font-['Inter'] text-semibold space-y-6">
      <nav className="space-y-4">
        {navItems.map((item, i) => (
          <button
            key={i}
            onClick={() => router.push(item.path)}
            className="block text-left text-base font-medium hover:text-primary hover:underline transition"
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
