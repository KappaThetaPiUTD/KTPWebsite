"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { label: "Attendance", href: "/dashboard/admin/attendance" },
  { label: "RSVPs", href: "/dashboard/admin/rsvps" },
  { label: "Create Event", href: "/dashboard/admin/create-event" },
  { label: "Strikes", href: "/dashboard/admin/strikes" },
];

export default function AdminNav() {
  const pathname = usePathname();
  return (
    <div
      role="tablist"
      aria-label="Admin sections"
      className="flex gap-2 border-b border-gray-200"
    >
      {items.map((t) => {
        const active = pathname.startsWith(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            role="tab"
            aria-selected={active}
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
              active
                ? "border-primary text-primary"
                : "border-transparent text-gray-600 hover:text-black"
            }`}
          >
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
