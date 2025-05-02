"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { IoChevronBack, IoChevronForward, IoTrash } from 'react-icons/io5';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Calendar state
  const [events, setEvents] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventTime, setNewEventTime] = useState("");

  // RSVP state
  const [rsvpStatus, setRsvpStatus] = useState({
    "Python Workshop": null,
    "Internship Workshop": null,
    "Brothers Chapter": null,
    "Pledges Chapter": null
  });

  // Check-in state
  const [checkedIn, setCheckedIn] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!data?.user) router.push('/sign-in');
      else setUser(data.user);
      setLoading(false);
    };
    checkUser();
  }, []);

  // Calendar setup
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

  const handleDeleteEvent = (dateKey, index) => {
    setEvents(prev => {
      const updated = [...prev[dateKey]];
      updated.splice(index, 1);
      return { ...prev, [dateKey]: updated };
    });
  };

  return (
    <div className="min-h-screen bg-white px-8 py-6 font-['Public_Sans']">
      {/* Navbar */}
      <header className="flex justify-between items-center pb-6">
        <h1 className="text-3xl font-bold text-[#1E3D2F]">ΚΘΠ</h1>
        <nav className="flex space-x-6 text-black font-medium items-center">
          {["HOME", "ABOUT", "BROTHERS", "RECRUITMENT", "BLOG", "GALLERY", "CONTACT", "DASHBOARD"].map((item) => (
            <a key={item} href="#" className="hover:text-gray-500">{item}</a>
          ))}
          {!loading && (
            !user ? (
              <a href="/sign-in" className="hover:text-gray-500">SIGN IN</a>
            ) : (
              <button
                onClick={async () => {
                  const { error } = await supabase.auth.signOut();
                  if (!error) router.push('/sign-in');
                }}
                className="px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
              >
                Logout
              </button>
            )
          )}
        </nav>
      </header>

      <div className="grid grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="bg-[#E0E0E0] p-6 rounded-xl shadow text-black">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">{monthName} {year}</h3>
            <div className="flex space-x-2">
              <button onClick={handlePrevMonth}><IoChevronBack /></button>
              <button onClick={handleNextMonth}><IoChevronForward /></button>
            </div>
          </div>
          <div className="grid grid-cols-7 text-center text-sm mb-2">
            {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map(day => (
              <div key={day} className="font-medium">{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 text-sm">
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

          {selectedDate && (
            <div className="mt-4 text-sm">
              <h4 className="font-semibold mb-1">Events on {selectedDate}:</h4>
              <ul className="mb-3 space-y-2">
                {(events[selectedDate] || []).map((event, idx) => (
                  <li key={idx}>
                    <div className="text-xs uppercase text-gray-500">{event.time}</div>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-black">{event.title}</span>
                      <button onClick={() => handleDeleteEvent(selectedDate, idx)} className="text-red-600 text-sm ml-2">
                        <IoTrash />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="Event Title"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  className="text-sm px-2 py-1 border rounded"
                />
                <input
                  type="text"
                  placeholder="Event Time (e.g. 7 PM)"
                  value={newEventTime}
                  onChange={(e) => setNewEventTime(e.target.value)}
                  className="text-sm px-2 py-1 border rounded"
                />
                <button onClick={handleAddEvent} className="bg-[#1E3D2F] text-white px-3 py-1 rounded">
                  Add Event
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RSVP */}
        <div className="bg-[#E0E0E0] p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-black mb-3">RSVP</h3>
          {["Python Workshop", "Internship Workshop", "Brothers Chapter", "Pledges Chapter"].map((event, index) => (
            <div key={index} className="mb-4">
              <p className="text-sm font-medium text-black">7 PM - {event}</p>
              <div className="flex space-x-2 mt-1">
                {["going", "maybe", "not going"].map((status) => (
                  <button
                    key={status}
                    onClick={() =>
                      setRsvpStatus((prev) => ({ ...prev, [event]: status }))
                    }
                    className={`px-3 py-1 text-xs rounded-lg 
                      ${
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

        {/* Check-In */}
        <div className="bg-[#E0E0E0] p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-black mb-3">Check-In for chapter</h3>
          <div className="flex justify-center items-center bg-white p-4 rounded-lg border mb-4">
            <img 
              src="https://via.placeholder.com/100" 
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

        {/* Bottom Info Boxes */}
        <div className="col-span-3 grid grid-cols-3 gap-6 mt-4">
          {["Attendance Record", "Strikes", "Social Quote"].map((label, i) => (
            <div key={i} className="bg-[#E0E0E0] p-6 rounded-xl shadow text-center text-black font-medium">
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
