"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import PhotoUpload from "../../../../components/portal/PhotoUpload";
import { getPortalBrowserClient } from "../../../../lib/portal/client";

const date = (value) => value ? new Date(value.length === 10 ? `${value}T00:00:00` : value).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" }) : "—";
const hours = (value) => new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(Number(value || 0));

function friendlyError(error) {
  const message = String(error?.message || "").toLowerCase();
  if (error?.code === "23505") return "A submission already exists for this event. Each event can only be submitted once.";
  if (message.includes("until the event has ended")) return "This event has not ended yet, so activity hours cannot be submitted.";
  if (message.includes("going rsvp")) return "A confirmed Going RSVP is required before you can submit hours for this event.";
  if (error?.code === "42501" || message.includes("row-level security")) return "You do not have permission to submit activity hours for this event.";
  return "Your submission could not be saved. Refresh the page and verify that the event is eligible before trying again.";
}

function Status({ value }) {
  const colors = { approved: "bg-green-50 text-green-700", rejected: "bg-red-50 text-red-700", pending: "bg-amber-50 text-amber-700" };
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${colors[value] || "bg-gray-100 text-gray-700"}`}>{value ? `${value[0].toUpperCase()}${value.slice(1)}` : "Unknown"}</span>;
}

export default function ActivityHoursPage() {
  const [semester, setSemester] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [eligibleEvents, setEligibleEvents] = useState([]);
  const [userId, setUserId] = useState("");
  const [eventId, setEventId] = useState("");
  const [startPhotoUrl, setStartPhotoUrl] = useState("");
  const [endPhotoUrl, setEndPhotoUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [now, setNow] = useState(0);

  const load = useCallback(async () => {
    const supabase = getPortalBrowserClient();
    if (!supabase) { setLoadingError("Portal configuration is unavailable."); setLoading(false); return; }
    setLoading(true); setLoadingError("");
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) { setLoadingError("Sign in is required to view activity hours."); setLoading(false); return; }
    setUserId(user.id);
    const { data: semesters, error: semesterError } = await supabase.from("portal_semesters").select("id, name, start_date, end_date, required_hours, is_active").eq("is_active", true).limit(1);
    if (semesterError) { setLoadingError("Unable to load the active semester. Please try again later."); setLoading(false); return; }
    const active = semesters?.[0] || null;
    setSemester(active);
    if (!active) { setSubmissions([]); setEligibleEvents([]); setLoading(false); return; }

    const [submissionResult, rsvpResult] = await Promise.all([
      supabase.from("portal_hour_submissions").select("id, event_id, semester_id, status, hours_awarded, rejection_reason, submitted_at, portal_events(title)").eq("user_id", user.id).order("submitted_at", { ascending: false }),
      supabase.from("portal_rsvps").select("event_id").eq("user_id", user.id).eq("status", "going"),
    ]);
    if (submissionResult.error || rsvpResult.error) { setLoadingError("Unable to load activity-hour records. Please try again later."); setLoading(false); return; }
    const allSubmissions = submissionResult.data || [];
    setSubmissions(allSubmissions.filter((submission) => submission.semester_id === active.id));
    const submittedIds = new Set(allSubmissions.map((submission) => submission.event_id));
    const goingIds = (rsvpResult.data || []).map((rsvp) => rsvp.event_id).filter((id) => !submittedIds.has(id));
    if (!goingIds.length) { setEligibleEvents([]); setLoading(false); return; }
    const { data: events, error: eventsError } = await supabase.from("portal_events").select("id, title, end_time").in("id", goingIds).lte("end_time", new Date().toISOString()).order("end_time", { ascending: false });
    if (eventsError) setLoadingError("Unable to load eligible events. Please try again later.");
    else setEligibleEvents(events || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setNow(Date.now()); }, [semester]);

  const selectedEvent = eligibleEvents.find((event) => event.id === eventId);
  const earned = useMemo(() => submissions.filter((submission) => submission.status === "approved").reduce((total, submission) => total + Number(submission.hours_awarded || 0), 0), [submissions]);
  const required = Number(semester?.required_hours || 0);
  const progress = required > 0 ? Math.min((earned / required) * 100, 100) : 0;
  const semesterEnded = Boolean(semester && new Date(`${semester.end_date}T23:59:59`).getTime() < now);

  function chooseEvent({ target }) { setEventId(target.value); setStartPhotoUrl(""); setEndPhotoUrl(""); setSubmitError(""); setSuccess(""); }

  async function submit() {
    if (!semester || !selectedEvent || !startPhotoUrl || !endPhotoUrl || !userId) { setSubmitError("Choose an eligible event and upload both photos before submitting."); return; }
    if (!window.confirm("You can only submit once for this event and cannot edit or resubmit after this — make sure both photos are correct. Submit now?")) return;
    const supabase = getPortalBrowserClient();
    if (!supabase) { setSubmitError("Portal configuration is unavailable."); return; }
    setSubmitting(true); setSubmitError(""); setSuccess("");
    const { data, error } = await supabase.from("portal_hour_submissions").insert({ event_id: selectedEvent.id, user_id: userId, semester_id: semester.id, start_photo_url: startPhotoUrl, end_photo_url: endPhotoUrl }).select("id, event_id, semester_id, status, hours_awarded, rejection_reason, submitted_at, portal_events(title)").single();
    setSubmitting(false);
    if (error) { setSubmitError(friendlyError(error)); return; }
    setSubmissions((current) => [data, ...current]);
    setEligibleEvents((current) => current.filter((event) => event.id !== selectedEvent.id));
    setEventId(""); setStartPhotoUrl(""); setEndPhotoUrl("");
    setSuccess("Your activity-hours submission was sent to exec for review.");
  }

  if (loading) return <p className="text-sm text-gray-600">Loading activity hours…</p>;
  if (loadingError) return <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-800">{loadingError}</div>;
  if (!semester) return <div><h1 className="mt-2 text-3xl font-bold text-gray-950">Activity Hours</h1><div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm font-semibold text-amber-900">No active semester — contact exec.</div></div>;

  return <div>
    <h1 className="mt-2 text-3xl font-bold text-gray-950">Activity Hours</h1>
    <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-700">Track your chapter involvement and progress toward this semester&apos;s activity-hour requirement.</p>
    <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-semibold text-gray-600">{semester.name} progress</p><p className="mt-1 text-3xl font-bold text-gray-950">{hours(earned)} <span className="text-lg font-semibold text-gray-500">/ {hours(required)} hrs</span></p></div><div className="text-sm font-semibold text-primary sm:text-right"><p>{hours(Math.max(required - earned, 0))} hours remaining</p><p className="mt-1 text-xs font-medium text-gray-500">Semester ends {date(semester.end_date)}</p></div></div>
      <div className="mt-5 h-3 overflow-hidden rounded-full bg-gray-100" aria-label={`${hours(earned)} of ${hours(required)} hours complete`}><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} /></div>
    </section>
    {semesterEnded && earned < required && <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-800">This semester has ended and you are {hours(required - earned)} hours below the {hours(required)}-hour requirement. Contact exec for guidance.</div>}
    <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-gray-950">Submit activity hours</h2><p className="mt-2 text-sm leading-6 text-gray-700">Only completed events with your confirmed Going RSVP are available below.</p>
      {!eligibleEvents.length ? <p className="mt-5 rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-600">No eligible events right now.</p> : <><label className="mt-5 block text-sm font-semibold text-gray-800" htmlFor="eligible-event">Choose an event</label><select id="eligible-event" value={eventId} onChange={chooseEvent} className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-primary"><option value="">Select an eligible event</option>{eligibleEvents.map((event) => <option key={event.id} value={event.id}>{event.title} — ended {date(event.end_time)}</option>)}</select></>}
      {selectedEvent && <div className="mt-6 space-y-6 border-t border-gray-100 pt-6"><PhotoUpload key={`${selectedEvent.id}-start`} eventId={selectedEvent.id} label="Start of event photo" onUploadComplete={setStartPhotoUrl} disabled={submitting} /><PhotoUpload key={`${selectedEvent.id}-end`} eventId={selectedEvent.id} label="End of event photo" onUploadComplete={setEndPhotoUrl} disabled={submitting} /><div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">You can only submit once for this event and cannot edit or resubmit after this — make sure both photos are correct.</div>{submitError && <p role="alert" className="text-sm text-red-600">{submitError}</p>}{success && <p role="status" className="text-sm text-green-700">{success}</p>}<button type="button" onClick={submit} disabled={submitting || !startPhotoUrl || !endPhotoUrl} className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">{submitting ? "Submitting…" : "Submit for review"}</button></div>}
    </section>
    <section className="mt-8"><h2 className="text-xl font-bold text-gray-950">Your submissions</h2><div className="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"><div className="overflow-x-auto"><table className="w-full min-w-[640px] text-left text-sm"><thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500"><tr><th className="px-6 py-4">Activity</th><th className="px-6 py-4">Submitted</th><th className="px-6 py-4">Status</th><th className="px-6 py-4 text-right">Hours</th></tr></thead><tbody className="divide-y divide-gray-100">{!submissions.length ? <tr><td colSpan="4" className="px-6 py-6 text-center text-gray-600">No submissions for this semester yet.</td></tr> : submissions.map((submission) => <tr key={submission.id} className="text-gray-700"><td className="px-6 py-4 font-semibold text-gray-950">{submission.portal_events?.title || "Event unavailable"}{submission.status === "rejected" && submission.rejection_reason && <p className="mt-1 max-w-md text-xs font-normal text-red-700">Reason: {submission.rejection_reason}</p>}</td><td className="px-6 py-4">{date(submission.submitted_at)}</td><td className="px-6 py-4"><Status value={submission.status} /></td><td className="px-6 py-4 text-right font-bold text-gray-950">{submission.status === "approved" ? `${hours(submission.hours_awarded)} hrs` : "—"}</td></tr>)}</tbody></table></div></div></section>
  </div>;
}
