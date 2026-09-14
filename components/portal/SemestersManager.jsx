"use client";

import { useCallback, useEffect, useState } from "react";
import { getPortalBrowserClient } from "../../lib/portal/client";

const blankForm = { name: "", start_date: "", end_date: "", required_hours: "10" };

export default function SemestersManager() {
  const [semesters, setSemesters] = useState([]);
  const [form, setForm] = useState(blankForm);
  const [editing, setEditing] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const supabase = getPortalBrowserClient();
    if (!supabase) { setError("Portal configuration is unavailable."); setLoading(false); return; }
    const [semesterResult, submissionResult] = await Promise.all([
      supabase.from("portal_semesters").select("id, name, start_date, end_date, required_hours, is_active").order("start_date", { ascending: false }),
      supabase.from("portal_hour_submissions").select("semester_id"),
    ]);
    if (semesterResult.error || submissionResult.error) { setError("Unable to load semesters."); setLoading(false); return; }
    const submissionCounts = (submissionResult.data || []).reduce((counts, submission) => ({ ...counts, [submission.semester_id]: (counts[submission.semester_id] || 0) + 1 }), {});
    const rows = (semesterResult.data || []).map((semester) => ({ ...semester, submissionCount: submissionCounts[semester.id] || 0 }));
    setSemesters(rows);
    setEditing(Object.fromEntries(rows.map((semester) => [semester.id, { start_date: semester.start_date, end_date: semester.end_date, required_hours: semester.required_hours }])));
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  function updateForm(event) { setForm((current) => ({ ...current, [event.target.name]: event.target.value })); }
  function updateEdit(id, field, value) { setEditing((current) => ({ ...current, [id]: { ...current[id], [field]: value } })); }

  async function createSemester(event) {
    event.preventDefault();
    const required = Number(form.required_hours);
    if (!form.name.trim() || !form.start_date || !form.end_date || !Number.isFinite(required) || required < 0) { setError("Enter a name, valid dates, and non-negative required hours."); return; }
    if (form.end_date < form.start_date) { setError("The end date must be on or after the start date."); return; }
    const supabase = getPortalBrowserClient(); setSaving(true); setError("");
    const { data, error: insertError } = await supabase.from("portal_semesters").insert({ name: form.name.trim(), start_date: form.start_date, end_date: form.end_date, required_hours: required }).select("id, name, start_date, end_date, required_hours, is_active").single();
    setSaving(false);
    if (insertError) { setError("Unable to create the semester."); return; }
    const row = { ...data, submissionCount: 0 };
    setSemesters((current) => [row, ...current].sort((a, b) => b.start_date.localeCompare(a.start_date)));
    setEditing((current) => ({ ...current, [row.id]: { start_date: row.start_date, end_date: row.end_date, required_hours: row.required_hours } }));
    setForm(blankForm);
  }

  async function saveSemester(semester) {
    const values = editing[semester.id]; const required = Number(values.required_hours);
    if (!values.start_date || !values.end_date || !Number.isFinite(required) || required < 0 || values.end_date < values.start_date) { setError("Use valid dates and non-negative required hours."); return; }
    const supabase = getPortalBrowserClient(); setBusyId(semester.id); setError("");
    const { data, error: updateError } = await supabase.from("portal_semesters").update({ start_date: values.start_date, end_date: values.end_date, required_hours: required }).eq("id", semester.id).select("id, name, start_date, end_date, required_hours, is_active").single();
    setBusyId("");
    if (updateError) { setError("Unable to save this semester."); return; }
    setSemesters((current) => current.map((item) => item.id === semester.id ? { ...data, submissionCount: item.submissionCount } : item));
  }

  async function activateSemester(semester) {
    if (semester.is_active || !window.confirm(`Make ${semester.name} the active semester? This will deactivate every other semester.`)) return;
    const supabase = getPortalBrowserClient(); setBusyId(semester.id); setError("");
    const { error: deactivateError } = await supabase.from("portal_semesters").update({ is_active: false }).eq("is_active", true);
    if (deactivateError) { setBusyId(""); setError("Unable to deactivate the current active semester."); return; }
    const { error: activateError } = await supabase.from("portal_semesters").update({ is_active: true }).eq("id", semester.id);
    setBusyId("");
    if (activateError) { setError("The prior semester was deactivated, but the new semester could not be activated. Please retry immediately."); await load(); return; }
    setSemesters((current) => current.map((item) => ({ ...item, is_active: item.id === semester.id })));
  }

  async function deleteSemester(semester) {
    if (semester.submissionCount || !window.confirm(`Delete ${semester.name}? This cannot be undone.`)) return;
    const supabase = getPortalBrowserClient(); setBusyId(semester.id); setError("");
    const { error: deleteError } = await supabase.from("portal_semesters").delete().eq("id", semester.id);
    setBusyId("");
    if (deleteError) { setError("Unable to delete this semester. It may now have linked submissions."); await load(); return; }
    setSemesters((current) => current.filter((item) => item.id !== semester.id));
  }

  if (loading) return <p className="mt-8 text-sm text-gray-600">Loading semesters…</p>;
  return <div className="mt-8 space-y-8">
    {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
    <form onSubmit={createSemester} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"><h2 className="text-xl font-bold text-gray-950">Create semester</h2><div className="mt-5 grid gap-4 md:grid-cols-2"><label className="text-sm font-semibold">Name<input name="name" value={form.name} onChange={updateForm} placeholder="Fall 2026" className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2" /></label><label className="text-sm font-semibold">Required hours<input name="required_hours" type="number" min="0" step="0.25" value={form.required_hours} onChange={updateForm} className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2" /></label><label className="text-sm font-semibold">Start date<input name="start_date" type="date" value={form.start_date} onChange={updateForm} className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2" /></label><label className="text-sm font-semibold">End date<input name="end_date" type="date" value={form.end_date} onChange={updateForm} className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2" /></label></div><button disabled={saving} className="mt-5 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">{saving ? "Creating…" : "Create semester"}</button></form>
    <section><h2 className="text-xl font-bold text-gray-950">All semesters</h2><div className="mt-4 space-y-4">{!semesters.length ? <p className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-600">No semesters yet.</p> : semesters.map((semester) => { const locked = semester.submissionCount > 0; const values = editing[semester.id] || {}; return <article key={semester.id} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="text-lg font-bold text-gray-950">{semester.name}</h3><p className="mt-1 text-sm text-gray-600">{semester.is_active ? "Active semester" : "Inactive"} · {semester.submissionCount} linked submission{semester.submissionCount === 1 ? "" : "s"}</p></div><button type="button" disabled={semester.is_active || busyId === semester.id} onClick={() => activateSemester(semester)} className="rounded-lg border border-primary px-4 py-2 text-sm font-semibold text-primary disabled:opacity-50">{semester.is_active ? "Active" : "Make active"}</button></div><div className="mt-5 grid gap-4 md:grid-cols-3"><label className="text-sm font-semibold">Start date<input type="date" disabled={locked} value={values.start_date ?? ""} onChange={(event) => updateEdit(semester.id, "start_date", event.target.value)} className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 disabled:bg-gray-100" /></label><label className="text-sm font-semibold">End date<input type="date" disabled={locked} value={values.end_date ?? ""} onChange={(event) => updateEdit(semester.id, "end_date", event.target.value)} className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 disabled:bg-gray-100" /></label><label className="text-sm font-semibold">Required hours<input type="number" min="0" step="0.25" disabled={locked} value={values.required_hours ?? ""} onChange={(event) => updateEdit(semester.id, "required_hours", event.target.value)} className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 disabled:bg-gray-100" /></label></div>{locked ? <p className="mt-4 text-sm text-amber-800">Dates and required hours are locked because this semester has linked hour submissions. It also cannot be deleted.</p> : <div className="mt-5 flex gap-3"><button type="button" disabled={busyId === semester.id} onClick={() => saveSemester(semester)} className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">Save changes</button><button type="button" disabled={busyId === semester.id} onClick={() => deleteSemester(semester)} className="rounded-lg border border-red-300 px-4 py-2.5 text-sm font-semibold text-red-700 disabled:opacity-60">Delete</button></div>}</article>; })}</div></section>
  </div>;
}
