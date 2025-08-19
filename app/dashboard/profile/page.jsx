"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import Sidebar from "../../../components/Sidebar";
import { FiEdit2, FiSave } from "react-icons/fi";

// Set document title when component mounts
export default function AdminPage() {
  useEffect(() => {
    document.title = "Profile - KTP UTD Dashboard";
  }, []);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [gradYear, setGradYear] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });
  const [fieldErrors, setFieldErrors] = useState({});

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
        if (json.errors) {
          // Handle multiple validation errors
          setFieldErrors(json.errors);
          setStatusMessage({ text: 'Please correct the errors below', type: 'error' });
        } else {
          setStatusMessage({ text: `Failed to update profile: ${json.error || resp.statusText}`, type: 'error' });
        }
        return;
      }
      // Clear any existing field errors on successful save
      setFieldErrors({});
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
        </div>

        {/* Status Message Banner - Outside of profile card */}
        {statusMessage.text && (
          <div className={`mb-6 p-4 rounded-lg border text-sm max-w-2xl mx-auto ${
            statusMessage.type === 'error' 
              ? 'bg-red-50 border-red-200 text-red-700' 
              : 'bg-green-50 border-green-200 text-green-700'
          }`}>
            {statusMessage.text}
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg max-w-2xl mx-auto overflow-hidden relative">
          {/* Edit Button - Floating in top right of card */}
          <button
            className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow border border-gray-200"
            title={isEditing ? "Save Profile" : "Edit Profile"}
            onClick={() => {
              if (isEditing) handleSave();
              else setIsEditing(true);
            }}
          >
            {isEditing ? (
              <FiSave className="text-lg text-[#1E3D2F]" />
            ) : (
              <FiEdit2 className="text-lg text-[#1E3D2F]" />
            )}
          </button>

          {/* Gradient Header */}
          <div className="bg-gradient-to-r from-[#1E3D2F] via-[#2A5A42] to-[#1E3D2F] px-8 py-6 text-white">
            <div className="flex items-center space-x-4">
              <img
                src="/pictures/placeholder.png"
                alt="Profile"
                className="w-16 h-16 rounded-full border-3 border-white shadow-lg object-cover"
              />
              <div className="text-left">
                <h2 className="text-2xl font-bold">
                  {fullName || "No Name Provided"}
                </h2>
                <p className="text-white/80 text-sm">
                  {user?.email}
                </p>
                {role && (
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 ${
                    role === 'admin' ? 'bg-red-500/20 text-red-100 border border-red-400/30' :
                    role === 'member' ? 'bg-blue-500/20 text-blue-100 border border-blue-400/30' :
                    role === 'pledge' ? 'bg-yellow-500/20 text-yellow-100 border border-yellow-400/30' :
                    'bg-gray-500/20 text-gray-100 border border-gray-400/30'
                  }`}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="px-8 py-6">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    className={`w-full border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#1E3D2F] focus:border-transparent transition ${
                      fieldErrors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                  />
                  {fieldErrors.name && (
                    <p className="mt-1 text-sm text-red-600">{fieldErrors.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Graduation Year</label>
                  <input
                    type="text"
                    className={`w-full border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#1E3D2F] focus:border-transparent transition ${
                      fieldErrors.graduation_date ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    value={gradYear}
                    onChange={(e) => setGradYear(e.target.value)}
                    placeholder="e.g., 2025"
                  />
                  {fieldErrors.graduation_date && (
                    <p className="mt-1 text-sm text-red-600">{fieldErrors.graduation_date}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="text"
                    className={`w-full border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#1E3D2F] focus:border-transparent transition ${
                      fieldErrors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone number"
                  />
                  {fieldErrors.phone && (
                    <p className="mt-1 text-sm text-red-600">{fieldErrors.phone}</p>
                  )}
                </div>
                <div className="pt-4">
                  <button
                    onClick={handleSave}
                    className="w-full bg-[#1E3D2F] text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-[#2A5A42] transition-colors duration-200 shadow-md"
                  >
                    Save Profile Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Personal Information</h3>
                    <div className="mt-2 space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">Full Name</span>
                        <span className="text-sm font-medium text-gray-900">{fullName || "Not provided"}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">Email</span>
                        <span className="text-sm font-medium text-gray-900">{user?.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Academic & Contact</h3>
                    <div className="mt-2 space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">Graduation Year</span>
                        <span className="text-sm font-medium text-gray-900">{gradYear || "Not set"}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">Phone</span>
                        <span className="text-sm font-medium text-gray-900">{phone || "Not provided"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
