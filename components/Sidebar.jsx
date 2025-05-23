// components/Sidebar.jsx
"use client";

import { useRouter } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();

  const navItems = [
    { label: "Homepage", path: "/dashboard" },
    { label: "Attendance Records", path: "/dashboard/attendance" },
    { label: "Merch", path: "/dashboard/merch" },
    { label: "RSVPED Events", path: "/dashboard/rsvp" },
    { label: "Profile", path: "/dashboard/profile" },
    { label: "Admin", path: "/dashboard/admin" },
  ];

  return (
    <aside className="bg-white px-6 py-10 font-['Inter'] shadow-sm space-y-6">
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
