"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";

export default function AdminStrikesPage() {
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("users")
        .select("id, name, email");
      if (error) console.error("Users fetch error:", error);
      setAllUsers(data || []);
    })();
  }, []);

  return (
    <section>
      <h2 className="text-lg font-semibold mb-3 text-primary">
        Log Strikes for Users
      </h2>
      <div className="overflow-x-auto border border-gray-300 rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-primary text-white">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {allUsers.map((u) => (
              <tr
                key={u.id}
                className="border-t bg-white hover:bg-gray-50 text-black"
              >
                <td className="px-4 py-2">{u.name || "N/A"}</td>
                <td className="px-4 py-2">{u.email || "N/A"}</td>
                <td className="px-4 py-2">
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                    onClick={async () => {
                      const reason = prompt("Enter reason for strike:");
                      if (!reason) return;
                      const { error } = await supabase
                        .from("strikes_log")
                        .insert([{ user_id: u.id, reason }]);
                      if (error)
                        alert("Error logging strike: " + error.message);
                      else alert("Strike logged successfully!");
                    }}
                  >
                    Log Strike
                  </button>
                </td>
              </tr>
            ))}
            {!allUsers.length && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
