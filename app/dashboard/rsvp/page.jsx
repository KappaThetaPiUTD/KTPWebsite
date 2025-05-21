"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import Sidebar from "../../../components/Sidebar";
import { useRouter } from "next/navigation";

export default function RSVPPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rsvpStatus, setRsvpStatus] = useState({
    "Python Workshop": null,
    "Internship Workshop": null,
    "Brothers Chapter": null,
    "Pledges Chapter": null,
  });

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        router.push("/login");
      } else {
        setUser(data.user);
        setLoading(false);
      }
    };
    getUser();
  }, [router]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      
      <div className="flex-1 p-6 overflow-y-auto bg-white">
        <h1 className="text-2xl font-bold mb-6 text-black">Welcome, {user?.email}!</h1>

        <div className="bg-[#E0E0E0] rounded-xl p-6 shadow-md text-black">
          <h2 className="text-xl font-semibold mb-4">RSVP Events</h2>
          <p className="mb-4">Let us know your attendance for upcoming events:</p>

          {Object.keys(rsvpStatus).map((event, idx) => (
            <div key={idx} className="mb-4">
              <p className="text-sm font-medium">{event}</p>
              <div className="flex gap-2 mt-2">
                {["going", "maybe", "not going"].map((status) => (
                  <button
                    key={status}
                    onClick={() =>
                      setRsvpStatus((prev) => ({
                        ...prev,
                        [event]: status,
                      }))
                    }
                    className={`px-3 py-1 text-xs rounded-lg ${
                      rsvpStatus[event] === status
                        ? "bg-green-700 text-white"
                        : "bg-[#1E3D2F] text-white hover:bg-[#163226]"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
