// components/Sidebar.jsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Sidebar() {
  const router = useRouter();
  const [openAdmin, setOpenAdmin] = useState(false);

  const navItems = [
    { label: "HOMEPAGE", path: "/dashboard" },
    { label: "ATTENDANCE RECORDS", path: "/dashboard/attendance" },
    { label: "MERCH", path: "/dashboard/merch" },
    { label: "EVENTS AND RSVP", path: "/dashboard/rsvp" },
    { label: "FAMILY TREE", path: "/dashboard/family-tree" },
    { label: "PROFILE", path: "/dashboard/profile" },
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

        {/* ADMIN parent */}
        <div className="space-y-2">
          <button
            onClick={() => {
              setOpenAdmin((v) => !v);
              router.push("/dashboard/admin");
            }}
            className="block text-left text-base font-medium hover:text-primary hover:underline transition w-full"
          >
            ADMIN
          </button>

          {openAdmin && (
            <div className="ml-3 space-y-2">
              <button
                onClick={() => router.push("/dashboard/admin/attendance")}
                className="block text-left text-sm hover:text-primary transition"
              >
                • Attendance
              </button>
              <button
                onClick={() => router.push("/dashboard/admin/rsvps")}
                className="block text-left text-sm hover:text-primary transition"
              >
                • RSVPs
              </button>
              <button
                onClick={() => router.push("/dashboard/admin/create-event")}
                className="block text-left text-sm hover:text-primary transition"
              >
                • Create Event
              </button>
              <button
                onClick={() => router.push("/dashboard/admin/strikes")}
                className="block text-left text-sm hover:text-primary transition"
              >
                • Strikes
              </button>
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
}
