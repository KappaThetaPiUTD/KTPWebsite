"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { getPortalBrowserClient } from "../../lib/portal/client";

const memberNavItems = [
  { label: "Overview", href: "/portal/dashboard" },
  { label: "Profile", href: "/portal/dashboard/profile" },
  { label: "Events", href: "/portal/dashboard/events" },
  { label: "Activity Hours", href: "/portal/dashboard/activity-hours" },
];

const adminNavItems = [
  { label: "Strikes", href: "/portal/dashboard/admin/strikes" },
  { label: "Members", href: "/portal/dashboard/admin/members" },
  { label: "Event Management", href: "/portal/dashboard/admin/events" },
  { label: "Activity Hours", href: "/portal/dashboard/admin/activity-hours" },
];

export default function PortalNav({ displayName, email, isAdmin }) {
  const pathname = usePathname();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState("");
  
  const handleSignOut = async () => {
    setSigningOut(true);
    setError("");

    const supabase = getPortalBrowserClient();
    if (!supabase) {
      setError("Portal configuration is unavailable.");
      setSigningOut(false);
      return;
    }

    const { error: signOutError } = await supabase.auth.signOut();
    setSigningOut(false);

    if (signOutError) {
      setError(signOutError.message || "Unable to sign out.");
      return;
    }

    router.replace("/portal/login");
    router.refresh();
  };

  return (
    <aside className="border-b border-gray-200 bg-white p-4 md:min-h-[calc(100vh-6rem)] md:border-b-0 md:border-r md:p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Member Portal
        </p>
        <p className="mt-2 truncate font-bold text-gray-950">{displayName}</p>
        <p className="truncate text-xs text-gray-600">{email}</p>
      </div>

      <nav className="mt-5" aria-label="Portal navigation">
        <div className="flex gap-2 overflow-x-auto md:flex-col">
          {memberNavItems.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/portal/dashboard" &&
                pathname.startsWith(`${item.href}/`));

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                  active
                    ? "bg-primary text-white"
                    : "text-gray-700 hover:bg-primary/10 hover:text-primary"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {isAdmin && (
          <div className="mt-6 border-t border-primary/20 pt-5">
            <p className="px-1 text-xs font-bold uppercase tracking-[0.18em] text-primary">
              Admin
            </p>
            <div className="mt-2 flex gap-2 overflow-x-auto rounded-xl bg-primary/5 p-2 md:flex-col">
              {adminNavItems.map((item) => {
                const active =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                      active
                        ? "bg-primary text-white shadow-sm"
                        : "text-primary hover:bg-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      <button
        type="button"
        onClick={handleSignOut}
        disabled={signingOut}
        className="mt-5 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-800 hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:text-gray-400 md:w-full"
      >
        {signingOut ? "Signing out..." : "Sign out"}
      </button>

      {error && (
        <p className="mt-3 text-xs font-medium text-red-700" role="alert">
          {error}
        </p>
      )}
    </aside>
  );
}
