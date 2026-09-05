"use client";

import { useMemo, useState } from "react";

const members = [
  { name: "Jiya Khurana", email: "jiya.khurana@utdallas.edu", completed: 18, required: 20 },
  { name: "Pranay Chintakunta", email: "pranay.chintakunta@utdallas.edu", completed: 14.5, required: 20 },
  { name: "Siri Kishore-Dola", email: "siri.kishore@utdallas.edu", completed: 21, required: 20 },
  { name: "Alex Martinez", email: "alex.martinez@utdallas.edu", completed: 9, required: 20 },
];

export default function AdminActivityHoursPage() {
  const [query, setQuery] = useState("");
  const visibleMembers = useMemo(() => members.filter((member) => `${member.name} ${member.email}`.toLowerCase().includes(query.toLowerCase())), [query]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Admin</p>
          <h1 className="mt-2 text-3xl font-bold text-gray-950">Activity Hours</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-700">Review member activity-hour progress and identify members who need follow-up.</p>
        </div>
        <button type="button" className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90">+ Log Hours</button>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"><p className="text-sm font-semibold text-gray-600">Members tracked</p><p className="mt-2 text-3xl font-bold text-gray-950">{members.length}</p></div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"><p className="text-sm font-semibold text-gray-600">Requirement met</p><p className="mt-2 text-3xl font-bold text-gray-950">{members.filter((member) => member.completed >= member.required).length}</p></div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 shadow-sm"><p className="text-sm font-semibold text-amber-800">Need follow-up</p><p className="mt-2 text-3xl font-bold text-amber-950">{members.filter((member) => member.completed < member.required).length}</p></div>
      </div>

      <section className="mt-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><h2 className="text-xl font-bold text-gray-950">Member progress</h2><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search members" className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-primary" /></div>
        <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"><div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left text-sm"><thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500"><tr><th className="px-6 py-4">Member</th><th className="px-6 py-4">Progress</th><th className="px-6 py-4">Status</th><th className="px-6 py-4 text-right">Hours</th></tr></thead><tbody className="divide-y divide-gray-100">{visibleMembers.map((member) => { const progress = Math.min((member.completed / member.required) * 100, 100); const complete = member.completed >= member.required; return <tr key={member.email}><td className="px-6 py-4"><p className="font-semibold text-gray-950">{member.name}</p><p className="mt-1 text-xs text-gray-500">{member.email}</p></td><td className="px-6 py-4"><div className="h-2 w-40 overflow-hidden rounded-full bg-gray-100"><div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} /></div></td><td className="px-6 py-4"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${complete ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>{complete ? "Complete" : "In progress"}</span></td><td className="px-6 py-4 text-right font-bold text-gray-950">{member.completed} / {member.required}</td></tr>; })}</tbody></table></div></div>
      </section>
    </div>
  );
}
