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
  const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: authData, error: authError } =
          await supabase.auth.getUser();
        const userId = authData?.user?.id;

        if (!userId || authError) {
          console.error("Auth error or user not found", authError);
          return setLoading(false);
        }

        setUser(authData.user);
        setFullName(authData.user.user_metadata?.full_name || "");
        setGradYear(authData.user.user_metadata?.grad_year || "");

        const { data: profileRow, error: profileError } = await supabase
          .from("users")
          .select("name, graduation_date, role, phone")
          .eq("id", userId)
          .single();

        if (profileError) {
          console.error("Error fetching profile row:", profileError);
        }

        if (!profileRow) {
          console.warn("No profile found for user ID:", userId);
          // Auto-create blank profile row for this user
          const { error: insertError } = await supabase
            .from("users")
            .insert({ id: userId, phone: "", role: "guest" });
          if (insertError) {
            console.error("Error inserting new profile row:", insertError);
          } else {
            setPhone("");
            setRole("guest");
          }
        } else {
          setPhone(profileRow.phone || "");
          setRole(profileRow.role || "");
          setFullName(profileRow.name || "");
          setGradYear(profileRow.graduation_date || "");
        }
      } catch (err) {
        console.error("Unexpected error in fetchUserData:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSave = async () => {
    const userId = user?.id;
    if (!user || !userId) {
      console.error("No user or user id found, cannot update profile.");
      setStatusMessage({ text: "Failed to update profile: missing user id.", type: "error" });
      return;
    }
    console.log("Updating user with id:", userId);

    // Use server-side API to update users table (service role key)
    // Note: We're not updating auth metadata to avoid triggering role reset
    const gradYearNum = gradYear ? Number(gradYear) : null;
    try {
      const resp = await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, name: fullName, graduation_date: gradYearNum, phone }),
      });
      const json = await resp.json();
      console.log('Server profile update response:', json);
      if (!resp.ok) {
        setStatusMessage({ text: `Failed to update profile: ${json.error || resp.statusText}`, type: 'error' });
        return;
      }
    } catch (err) {
      console.error('Network error calling profile update API:', err);
      setStatusMessage({ text: 'Failed to update profile: network error', type: 'error' });
      return;
    }

    // Re-fetch user and profile data to update UI
    try {
      setLoading(true);
      const { data: authData, error: authFetchError } = await supabase.auth.getUser();
      const refreshedUserId = authData?.user?.id;
      if (!refreshedUserId) {
        console.error("No user id found after update, cannot refresh profile.");
        setLoading(false);
        setIsEditing(false);
        setStatusMessage({ text: "Profile updated, but could not refresh view.", type: "error" });
        return;
      }
      setUser(authData.user);
      
      // Get updated data from users table (this is the source of truth)
      const { data: profileRow, error: fetchError } = await supabase
        .from("users")
        .select("name, graduation_date, role, phone")
        .eq("id", refreshedUserId)
        .single();
      console.log("Fetched profile after update:", profileRow, fetchError);
      
      // Update state with database values
      setPhone(profileRow?.phone || "");
      setRole(profileRow?.role || "");
      setFullName(profileRow?.name || "");
      setGradYear(profileRow?.graduation_date || "");
    } catch (err) {
      console.error("Error refreshing profile after save", err);
    } finally {
      setLoading(false);
      setIsEditing(false);
      setStatusMessage({ text: "Profile updated successfully!", type: "success" });
      // Scroll to profile view for immediate feedback
      setTimeout(() => {
        const profileSection = document.querySelector('.bg-white.border.rounded-xl.shadow-sm.max-w-xl');
        if (profileSection) profileSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <svg
          className="animate-spin h-5 w-5 text-primary"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4.293 12.293a1 1 0 011.414 0L12 18.586l6.293-6.293a1 1 0 011.414 1.414l-7 7a1 1 0 01-1.414 0l-7-7a1 1 0 010-1.414z"
          ></path>
        </svg>
      </div>
    );
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
            {isEditing ? (
              <FiSave className="text-xl text-[#1E3D2F]" />
            ) : (
              <FiEdit2 className="text-xl text-[#1E3D2F]" />
            )}
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm max-w-xl mx-auto p-6 text-center">
          <div className="flex flex-col items-center">
            <img
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.email}`}
              alt="Profile"
              className="w-20 h-20 rounded-full border border-gray-300 mb-4"
            />

            {statusMessage.text && (
              <div className={`mb-2 text-sm ${statusMessage.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>{statusMessage.text}</div>
            )}

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
                {/* Role is not editable by users to prevent privilege escalation */}
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
                <p className="text-sm text-gray-700 mt-2">
                  Email: {user?.email}
                </p>
                <p className="text-sm text-gray-700">
                  Graduation Year: {gradYear || "Not set"}
                </p>
                <p className="text-sm text-gray-700">
                  Phone: {phone || "Not set"}
                </p>
                <p className="text-sm text-gray-700">
                  Role: {role || "Not set"}
                </p>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
