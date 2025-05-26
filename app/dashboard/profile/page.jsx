"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import Sidebar from "../../../components/Sidebar";
import { FiEdit2, FiSave } from "react-icons/fi";

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [gradYear, setGradYear] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: authData } = await supabase.auth.getUser();
      const userId = authData?.user?.id;
      if (!userId) return setLoading(false);

      setUser(authData.user);
      setFullName(authData.user.user_metadata?.full_name || "");
      setGradYear(authData.user.user_metadata?.grad_year || "");

      const { data: profileRow } = await supabase
        .from("users")
        .select("role, phone")
        .eq("uuid", userId)
        .single();

      if (profileRow) {
        setPhone(profileRow.phone || "");
        setRole(profileRow.role || "");
      }

      setLoading(false);
    };

    fetchUserData();
  }, []);

  const handleSave = async () => {
    if (!user) return;

    // Update auth metadata
    const { error: metaError } = await supabase.auth.updateUser({
      data: { full_name: fullName, grad_year: gradYear },
    });

    // Update Supabase "users" table (uuid column is the key)
    const { error: tableError } = await supabase
      .from("users")
      .update({ phone, role })
      .eq("uuid", user.id);

    if (metaError || tableError) {
      console.error("Metadata Error:", metaError);
      console.error("Table Error:", tableError);
      alert("Failed to update profile.");
    } else {
      alert("Profile updated successfully!");
      setIsEditing(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex justify-center items-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white pt-24 text-sm text-black font-['Public_Sans'] grid grid-cols-[220px_1fr]">
      <aside className="bg-white px-6 py-10 font-['Inter'] border-r border-black shadow-sm space-y-6">
        <Sidebar />
      </aside>

      <main className="px-8 py-6 w-full">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-[#1E3D2F]">Profile</h1>
          <button
            className="p-2 rounded-full hover:bg-gray-100 transition"
            title={isEditing ? "Save Profile" : "Edit Profile"}
            onClick={() => {
              if (isEditing) handleSave();
              else setIsEditing(true);
            }}
          >
            {isEditing ? <FiSave className="text-xl text-[#1E3D2F]" /> : <FiEdit2 className="text-xl text-[#1E3D2F]" />}
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm max-w-xl mx-auto p-6 text-center">
          <div className="flex flex-col items-center">
            <img
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.email}`}
              alt="Profile"
              className="w-20 h-20 rounded-full border border-gray-300 mb-4"
            />

            {isEditing ? (
              <>
                <input
                  type="text"
                  className="border rounded px-3 py-1 text-sm mb-2"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full Name"
                />
                <input
                  type="text"
                  className="border rounded px-3 py-1 text-sm mb-2"
                  value={gradYear}
                  onChange={(e) => setGradYear(e.target.value)}
                  placeholder="Graduation Year"
                />
                <input
                  type="text"
                  className="border rounded px-3 py-1 text-sm mb-2"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone Number"
                />
                <select
                  className="border rounded px-3 py-1 text-sm mb-2"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="">Select Role</option>
                  <option value="executive">Executive</option>
                  <option value="brother">Brother</option>
                  <option value="pledge">Pledge</option>
                  <option value="guest">Guest</option>
                </select>
                <button
                  onClick={handleSave}
                  className="bg-primary text-white px-4 py-2 rounded text-sm mt-2 hover:bg-primary/90 transition"
                >
                  Save Profile
                </button>
              </>
            ) : (
              <>
                <h2 className="text-lg font-semibold text-[#1E3D2F]">
                  {fullName || "No Name Provided"}
                </h2>
                <p className="text-sm text-gray-700 mt-2">Email: {user?.email}</p>
                <p className="text-sm text-gray-700">Graduation Year: {gradYear || "Not set"}</p>
                <p className="text-sm text-gray-700">Phone: {phone || "Not set"}</p>
                <p className="text-sm text-gray-700">Role: {role || "Not set"}</p>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
