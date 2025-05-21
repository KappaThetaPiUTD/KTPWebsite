"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventTime, setNewEventTime] = useState("");
  const [checkedIn, setCheckedIn] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data?.user) router.push('/sign-in');
      else setUser(data.user);
      setLoading(false);
    };
    checkUser();
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
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

  return (
    <div className="min-h-screen font-['Public_Sans'] uppercase text-sm bg-white grid grid-cols-[200px_1fr]">

      {/* Sidebar */}
      <aside className="bg-white px-6 py-8 text-black space-y-6 font-sans">
  <h2 className="text-2xl font-bold text-[#1E3D2F] tracking-wide">ΚΘΠ</h2>
  <p className="text-sm text-gray-600 font-medium uppercase tracking-wide">Welcome</p>
  <nav className="space-y-4">
    <button className="block text-left text-base font-medium hover:text-[#1E3D2F] hover:underline transition">Homepage</button>
    <button onClick={() => router.push("/dashboard/attendance")} className="block text-left text-base font-medium hover:text-[#1E3D2F] hover:underline transition">Attendance Records</button>
    <button onClick={() => router.push("/dashboard/merch")} className="block text-left text-base font-medium hover:text-[#1E3D2F] hover:underline transition">Merch</button>
    <button onClick={() => router.push("/dashboard/rsvp")} className="block text-left text-base font-medium hover:text-[#1E3D2F] hover:underline transition">RSVPED Events</button>
    <button onClick={() => router.push("/dashboard/admin")} className="block text-left text-base font-medium hover:text-[#1E3D2F] hover:underline transition">Admin</button>
  </nav>
</aside>



      {/* Main Content */}
      <main className="px-8 py-6">
        <div className="grid grid-cols-2 gap-6">
          {/* Calendar */}
          <div className="bg-[#E0E0E0] p-6 rounded-xl shadow text-black">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-base font-semibold">{monthName} {year}</h3>
              <div className="flex space-x-2">
                <button onClick={handlePrevMonth}><IoChevronBack /></button>
                <button onClick={handleNextMonth}><IoChevronForward /></button>
              </div>
            </div>
            <div className="grid grid-cols-7 text-center text-xs mb-2">
              {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map(day => (
                <div key={day} className="font-medium">{day}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 text-xs">
              {getCalendarGrid().map((day, i) => {
                const isToday = day &&
                  today.getDate() === day &&
                  today.getMonth() === month &&
                  today.getFullYear() === year;
                return (
                  <div key={i} className="py-2 text-center">
                    {day && (
                      <button
                        onClick={() => handleDayClick(day)}
                        className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center
                          ${isToday ? "bg-[#1E3D2F] text-white" : "text-black hover:bg-gray-200"}`}
                      >
                        {day}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Check-in Section */}
          <div className="bg-[#E0E0E0] p-6 rounded-xl shadow">
            <h3 className="text-base font-semibold text-black mb-3">Check-In for chapter</h3>
            <div className="flex justify-between items-center bg-white p-4 rounded-lg border mb-4">
              <div className="rounded-full bg-[#1E3D2F] text-white w-8 h-8 flex items-center justify-center text-sm">
                {user?.email?.[0]?.toUpperCase() || "S"}
              </div>
              <img 
                src="https://via.placeholder.com/80" 
                alt="QR Code"
                onError={(e) => e.currentTarget.style.display = 'none'}
              />
            </div>
            <div className="text-center">
              <button
                onClick={() => setCheckedIn(true)}
                className="bg-[#1E3D2F] text-white px-4 py-2 rounded hover:bg-[#163226] transition"
              >
                Check In
              </button>
              {checkedIn && (
                <p className="text-green-700 font-medium mt-2">Checked in successfully!</p>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Info Cards */}
        <div className="grid grid-cols-3 gap-6 mt-6">
          {["Attendance Record", "Strikes", "Social Quote"].map((label, i) => (
            <div key={i} className="bg-[#E0E0E0] p-6 rounded-xl shadow text-center text-black font-semibold">
              {label}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
