// Dashboard.jsx — Interactive Calendar with Event View Only
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState({
    "2025-05-21": [
      { title: "Brothers Chapter", time: "7 PM" },
      { title: "Pledges Chapter", time: "8:30 PM" },
    ],
    "2025-05-25": [
      { title: "Service Event", time: "2 PM" },
    ],
    "2025-06-03": [
      { title: "Summer Kickoff", time: "5 PM" },
    ],
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const [checkedIn, setCheckedIn] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data?.user) router.push("/sign-in");
      else setUser(data.user);
      setLoading(false);
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth error:', error);
          router.push('/login');
          return;
        }

        if (!session || !session.user) {
          // No valid session, redirect to login
          router.push('/login');
          return;
        }

        // User is authenticated
        setUser(session.user);
        setLoading(false);
      } catch (error) {
        console.error('Error checking auth:', error);
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString("default", { month: "long" });
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const getCalendarGrid = () => {
    const grid = [];
    const offset = (firstDay + 6) % 7;
    for (let i = 0; i < offset; i++) grid.push(null);
    for (let day = 1; day <= daysInMonth; day++) grid.push(day);
    return grid;
  };

  const formatDateKey = (y, m, d) => `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  const handleDayClick = (day) => {
    const key = formatDateKey(year, month, day);
    setSelectedDate(key);
  };
  const handleAddEvent = () => {
    if (!newEventTitle.trim() || !newEventTime.trim()) return;
    const event = { title: newEventTitle.trim(), time: newEventTime.trim() };
    setEvents(prev => ({
      ...prev,
      [selectedDate]: [...(prev[selectedDate] || []), event]
    }));
    setNewEventTitle("");
    setNewEventTime("");
  };

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-lg text-black">Loading...</div>
      </div>
    );
  }

  // If we get here, user is authenticated
  return (
    <div className="min-h-screen bg-white pt-24 text-sm text-black font-['Public_Sans'] grid grid-cols-[220px_1fr]">
      <aside className="bg-white px-6 py-10 font-['Inter'] border-r border-black shadow-sm space-y-6">
        <nav className="space-y-4">
          {["Homepage", "Attendance Records", "Merch", "RSVPED Events", "Profile", "Admin"].map((label, i) => (
            <button key={i} className="block text-left text-base font-medium hover:text-primary hover:underline transition">
              {label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="px-8 py-6 w-full">
        <h1 className="text-xl font-bold mb-6">Welcome, {user?.user_metadata?.full_name || "Member"}</h1>
      {/* Main Content */}
      <main className="px-8 py-6">
        <header className="flex justify-between items-center mb-6">
          <nav className="flex space-x-6 text-black font-semibold items-center text-xs">
            {["Home", "About", "Brothers", "Recruitment", "Blog", "Gallery", "Contact", "Dashboard"].map((item) => (
              <a key={item} href="#" className="hover:text-gray-500">{item}</a>
            ))}
            {!loading && (
              !user ? (
                <a href="/sign-in" className="hover:text-gray-500">Sign In</a>
              ) : (
                <button
                  onClick={async () => {
                    const { error } = await supabase.auth.signOut();
                    if (!error) router.push('/login');
                  }}
                  className="px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
                >
                  Logout
                </button>
              )
            )}
          </nav>
        </header>
        <div className="grid grid-cols-2 gap-6">
          {/* Calendar */}
          <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-base font-semibold">{monthName} {year}</h3>
              <div className="flex space-x-2">
                <button aria-label="Previous Month" onClick={handlePrevMonth}><IoChevronBack /></button>
                <button aria-label="Next Month" onClick={handleNextMonth}><IoChevronForward /></button>
              </div>
            </div>
            <div className="grid grid-cols-7 text-center text-xs mb-2">
              {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
                <div key={d} className="font-medium">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 text-xs">
              {getCalendarGrid().map((day, i) => {
                const dateKey = formatDateKey(year, month, day);
                const isToday = day && today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
                const hasEvent = events[dateKey]?.length;
                return (
                  <div key={i} className="py-2 text-center">
                    {day && (
                      <button
                        onClick={() => handleDayClick(day)}
                        className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center relative transition ${isToday ? "bg-primary text-white" : "hover:bg-gray-200 text-black"}`}
                      >
                        {day}
                        {hasEvent && <span className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-red-500 rounded-full" />}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
            {selectedDate && events[selectedDate]?.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold mb-2 text-primary">Events on {selectedDate}:</h4>
                <ul className="list-disc list-inside text-xs space-y-1">
                  {events[selectedDate].map((evt, idx) => (
                    <li key={idx}>{evt.time} - <strong>{evt.title}</strong></li>
                  ))}
                </ul>
              </div>
            )}
            {selectedDate && !events[selectedDate] && (
              <p className="text-xs mt-4 text-gray-500">No events scheduled for {selectedDate}.</p>
            )}
          </div>

          {/* Check-in */}
          <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
            <h3 className="text-base font-semibold mb-3">Check-In for Chapter</h3>
            <div className="flex justify-between items-center bg-white p-4 border rounded-lg mb-4">
              <div className="rounded-full bg-primary text-white w-8 h-8 flex items-center justify-center text-sm">
                {user?.email?.[0]?.toUpperCase() || "S"}
              </div>
              <img src="https://via.placeholder.com/80" alt="QR Code" onError={(e) => (e.currentTarget.style.display = "none")} />
            </div>
            <div className="text-center">
              <button onClick={() => setCheckedIn(true)} className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition">
                Check In
              </button>
              {checkedIn && (
                <p className="text-green-700 font-medium mt-2">Checked in successfully!</p>
              )}
            </div>
          </div>
        </div>

        {/* Info Boxes */}
        <div className="grid grid-cols-3 gap-6 mt-6">
          {["Attendance Record", "Strikes", "Social Quote"].map((text, idx) => (
            <div key={idx} className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm text-center font-semibold">
              {text}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}