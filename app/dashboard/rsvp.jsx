"use client";

import React, { useState } from "react";

export default function RSVPPage() {
  const [rsvpStatus, setRsvpStatus] = useState({
    "Python Workshop": null,
    "Internship Workshop": null,
    "Brothers Chapter": null,
    "Pledges Chapter": null,
  });

  return (
    <div className="min-h-screen p-8 bg-white font-['Public_Sans'] uppercase text-sm">
      <h1 className="text-2xl font-bold text-[#1E3D2F] mb-6">RSVPED Events</h1>

      <div className="bg-[#E0E0E0] p-6 rounded-xl shadow max-w-2xl">
        <h3 className="text-base font-semibold text-black mb-3">RSVP</h3>
        {Object.keys(rsvpStatus).map((event, index) => (
          <div key={index} className="mb-4">
            <p className="text-xs font-medium text-black">7 PM - {event}</p>
            <div className="flex space-x-2 mt-1">
              {["going", "maybe", "not going"].map((status) => (
                <button
                  key={status}
                  onClick={() =>
                    setRsvpStatus((prev) => ({ ...prev, [event]: status }))
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
  );
}
