// components/Sidebar.jsx
"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useMemo } from "react";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { label: "HOMEPAGE", path: "/dashboard" },
    { label: "ATTENDANCE RECORDS", path: "/dashboard/attendance" },
    { label: "MERCH", path: "/dashboard/merch" },
    { label: "EVENTS AND RSVP", path: "/dashboard/rsvp" },
    { label: "PROFILE", path: "/dashboard/profile" },
  ];

  // --- Admin submenu config
  const adminItems = useMemo(
    () => [
      {
        label: "Attendance",
        href: "/dashboard/admin/attendance",
        icon: AttendanceIcon,
      },
      { label: "RSVPs", href: "/dashboard/admin/rsvps", icon: RsvpIcon },
      {
        label: "Create Event",
        href: "/dashboard/admin/create-event",
        icon: CalendarPlusIcon,
      },
      { label: "Strikes", href: "/dashboard/admin/strikes", icon: FlagIcon },
    ],
    []
  );

  const onAdminPage = pathname?.startsWith("/dashboard/admin");
  const [openAdmin, setOpenAdmin] = useState(onAdminPage);

  // Auto-open when you navigate into any admin subpage
  useEffect(() => {
    if (onAdminPage) setOpenAdmin(true);
  }, [onAdminPage]);

  const isActive = (path) =>
    pathname === path || pathname?.startsWith(path + "/");

  return (
    <aside className="bg-white px-6 py-10 font-['Inter'] space-y-6">
      <nav className="space-y-4">
        {navItems.map((item, i) => (
          <button
            key={i}
            onClick={() => router.push(item.path)}
            className={`block w-full text-left text-base font-medium transition ${
              isActive(item.path)
                ? "text-primary"
                : "text-gray-800 hover:text-primary"
            }`}
          >
            {item.label}
          </button>
        ))}

        {/* Admin Section */}
        <div className="pt-2">
          <button
            onClick={() => {
              setOpenAdmin((v) => !v);
              // route to /dashboard/admin root (it will redirect to first tab if you kept that)
              if (!onAdminPage) router.push("/dashboard/admin");
            }}
            className="group flex w-full items-center justify-between text-left text-sm font-semibold tracking-wide text-gray-900"
          >
            <span>ADMIN</span>
            <ChevronIcon
              className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
                openAdmin ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>

          {/* Submenu container */}
          {openAdmin && (
            <div className="mt-2 rounded-xl border border-gray-200 bg-gray-50/60 p-2 shadow-sm">
              {adminItems.map(({ label, href, icon: Icon }) => {
                const active = isActive(href);
                return (
                  <button
                    key={href}
                    onClick={() => router.push(href)}
                    aria-current={active ? "page" : undefined}
                    className={`mb-1 last:mb-0 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition
                      ${
                        active
                          ? "bg-primary text-white shadow-sm"
                          : "text-gray-700 hover:bg-primary/10 hover:text-primary"
                      } focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40`}
                  >
                    <Icon
                      className={`h-4 w-4 ${
                        active ? "opacity-90" : "opacity-70"
                      }`}
                    />
                    <span className="truncate">{label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
}

/* ---- Tiny inline icons (no extra deps) ---- */
function AttendanceIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M7 3a2 2 0 0 0-2 2v2h14V5a2 2 0 0 0-2-2H7zm12 6H5v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9zM9 12h6v2H9v-2z" />
    </svg>
  );
}
function RsvpIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20 4H4a2 2 0 0 0-2 2v11.5A2.5 2.5 0 0 0 4.5 20H20a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm-2 6H6V8h12v2zM6 12h7v2H6v-2z" />
    </svg>
  );
}
function CalendarPlusIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M7 2h2v2h6V2h2v2h2a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2V2zm13 8H4v9h16v-9zM12 11h2v3h3v2h-3v3h-2v-3H9v-2h3v-3z" />
    </svg>
  );
}
function FlagIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M6 3v18H4V3h2zm2 0h10l-1.5 4L20 11H8V3z" />
    </svg>
  );
}
function ChevronIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
        clipRule="evenodd"
      />
    </svg>
  );
}
