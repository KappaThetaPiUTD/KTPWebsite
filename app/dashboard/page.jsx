import React from 'react';
import { FaEnvelope, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-white px-8 py-6 font-['Public_Sans']">
      {/* Navbar */}
      <header className="flex justify-between items-center pb-6">
        <h1 className="text-3xl font-bold text-[#1E3D2F]">ΚΘΠ</h1>
        <nav className="flex space-x-6 text-black font-medium">
          <a href="#" className="hover:text-gray-500">HOME</a>
          <a href="#" className="hover:text-gray-500">ABOUT</a>
          <a href="#" className="hover:text-gray-500">RECRUITMENT</a>
          <a href="#" className="hover:text-gray-500">BLOG</a>
          <a href="#" className="hover:text-gray-500">CONTACT</a>
        </nav>
      </header>

      {/* Main Dashboard */}
      <div className="grid grid-cols-3 gap-6">
        {/* Calendar (Lighter Gray) */}
        <div className="bg-[#E0E0E0] p-6 rounded-xl shadow text-black">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">March 2025</h3>
            <div className="flex space-x-2">
              <button className="text-gray-700 hover:text-black"><IoChevronBack /></button>
              <button className="text-gray-700 hover:text-black"><IoChevronForward /></button>
            </div>
          </div>
          <div className="grid grid-cols-7 text-center text-gray-800 text-sm">
            {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map(day => (
              <div key={day} className="font-medium">{day}</div>
            ))}
            {Array(31).fill(0).map((_, i) => (
              <div key={i} className={`py-2 ${i + 1 === 8 ? "bg-[#1E3D2F] text-white rounded-full" : ""}`}>
                {i + 1}
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-gray-700">📅 7 PM - Brothers Chapter</p>
          <p className="text-sm text-gray-700">📅 8:30 PM - Pledges Chapter</p>
        </div>

        {/* RSVP Section (Text in Black) */}
        <div className="bg-[#E0E0E0] p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-black mb-3">RSVP</h3>
          {["Python Workshop", "Internship Workshop", "Brothers Chapter", "Pledges Chapter"].map((event, index) => (
            <div key={index} className="mb-2">
              <p className="text-sm font-medium text-black">7 PM - {event}</p> {/* Changed to black */}
              <div className="flex space-x-2 mt-1">
                {["going", "maybe", "not going"].map(status => (
                  <button key={status} className="bg-[#1E3D2F] text-white px-3 py-1 text-xs rounded-lg hover:bg-[#163226]">
                    {status}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Check-In Section */}
        <div className="bg-[#E0E0E0] p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-black mb-3">Check-In for chapter</h3>
          <div className="flex justify-center items-center bg-white p-4 rounded-lg border">
            {/* Placeholder QR Code */}
            <img src="https://via.placeholder.com/100" alt="QR Code" />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="col-span-3 grid grid-cols-3 gap-6 mt-4">
          <div className="bg-[#E0E0E0] p-6 rounded-xl shadow text-center text-black font-medium">
            Attendance Record
          </div>
          <div className="bg-[#E0E0E0] p-6 rounded-xl shadow text-center text-black font-medium">
            Strikes
          </div>
          <div className="bg-[#E0E0E0] p-6 rounded-xl shadow text-center text-black font-medium">
            Social Quote
          </div>
        </div>
      </div>

    </div>
  );
}
