"use client";

import React from "react";
import Sidebar from "../../../components/Sidebar";
import AdminGuard from "./_components/AdminGuard";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-white pt-24 text-sm text-black font-['Public_Sans'] grid grid-cols-[220px_1fr]">
      <aside className="bg-white px-6 py-10 font-['Inter'] border-r border-black shadow-sm space-y-6">
        <Sidebar />
      </aside>
      <main className="px-8 py-6 w-full space-y-8">
        <h1 className="text-2xl font-bold text-primary">Admin Dashboard</h1>
        <AdminGuard>{children}</AdminGuard>
      </main>
    </div>
  );
}
