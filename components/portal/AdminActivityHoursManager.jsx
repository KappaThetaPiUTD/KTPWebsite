"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getPortalBrowserClient } from "../../lib/portal/client";
import { cloudinaryDisplayUrl } from "../../lib/cloudinary/displayUrl";

const fmtDate = (value) => value ? new Date(value).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "—";
const fmtHours = (value) => new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(Number(value || 0));

function Photo({ url, label, onOpen }) {
  return <div><p className="mb-2 text-sm font-semibold text-gray-800">{label}</p><button type="button" onClick={() => onOpen(url, label)} className="block w-full"><img src={cloudinaryDisplayUrl(url)} alt={`${label} evidence`} className="max-h-[430px] w-full rounded-xl border border-gray-200 object-contain" /></button><a href={url} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm font-semibold text-primary underline">View original</a></div>;
}

export default function AdminActivityHoursManager() {
  const [submissions, setSubmissions] = useState([]);
  const [members, setMembers] = useState([]);
  const [semester, setSemester] = useState(null);
  const [reviewerId, setReviewerId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hoursById, setHoursById] = useState({});
  const [rejectingId, setRejectingId] = useState("");
  const [reason, setReason] = useState("");
  const [busyId, setBusyId] = useState("");
  const [eventFilter, setEventFilter] = useState("");
  const [memberFilter, setMemberFilter] = useState("");
  const [summarySort, setSummarySort] = useState("lowest");
  const [photo, setPhoto] = useState(null);
  const [now, setNow] = useState(0);

  const load = useCallback(async () => {
    const supabase = getPortalBrowserClient();
    if (!supabase) { setError("Portal configuration is unavailable."); setLoading(false); return; }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Sign in required."); setLoading(false); return; }
    const [semesterResult, memberResult, profileResult, submissionResult] = await Promise.all([
      supabase.from("portal_semesters").select("id, name, end_date, required_hours").eq("is_active", true).limit(1),
      supabase.from("portal_members").select("id, user_id, email, status"),
      supabase.from("portal_profiles").select("user_id, full_name"),
      supabase.from("portal_hour_submissions").select("id, event_id, user_id, semester_id, start_photo_url, end_photo_url, status, hours_awarded, reviewed_by, reviewed_at, rejection_reason, submitted_at, portal_events(title) ").order("submitted_at", { ascending: false }),
    ]);
    if (semesterResult.error || memberResult.error || profileResult.error || submissionResult.error) { setError("Unable to load activity-hour records."); setLoading(false); return; }
    const profiles = new Map((profileResult.data || []).map((profile) => [profile.user_id, profile.full_name]));
    const memberRows = (memberResult.data || []).map((member) => ({ ...member, name: profiles.get(member.user_id) || member.email }));
    const byUser = new Map(memberRows.map((member) => [member.user_id, member]));
    const byMember = new Map(memberRows.map((member) => [member.id, member]));
    setMembers(memberRows); setReviewerId(byUser.get(user.id)?.id || "");
    setSemester(semesterResult.data?.[0] || null);
    setSubmissions((submissionResult.data || []).map((submission) => ({ ...submission, member: byUser.get(submission.user_id), reviewer: byMember.get(submission.reviewed_by) })));
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);
  useEffect(() => { setNow(Date.now()); }, [semester]);

  const pending = submissions.filter((submission) => submission.status === "pending");
  const history = submissions.filter((submission) => submission.status !== "pending").filter((submission) => (!eventFilter || submission.event_id === eventFilter) && (!memberFilter || submission.user_id === memberFilter));
  const events = [...new Map(submissions.map((submission) => [submission.event_id, submission.portal_events?.title || "Event unavailable"])).entries()];
  const activeApproved = submissions.filter((submission) => submission.semester_id === semester?.id && submission.status === "approved");
  const summary = members.filter((member) => member.status === "active" && member.user_id && member.role === "brother").map((member) => ({ ...member, total: activeApproved.filter((submission) => submission.user_id === member.user_id).reduce((sum, submission) => sum + Number(submission.hours_awarded || 0), 0) })).sort((a, b) => summarySort === "highest" ? b.total - a.total : a.total - b.total);
  const ended = Boolean(semester && new Date(`${semester.end_date}T23:59:59`).getTime() < now);

  async function review(submission, status) {
    const amount = Number(hoursById[submission.id]);
    if (status === "approved" && (!Number.isFinite(amount) || amount < 0)) { setError("Enter a non-negative number of awarded hours before approving."); return; }
    const rejectionReason = reason.trim();
    if (status === "rejected" && rejectionReason.length < 5) { setError("Enter a brief rejection reason (at least 5 characters)."); return; }
    if (status === "rejected" && !window.confirm("Rejecting is final. The brother cannot edit or resubmit for this event. Continue?")) return;
    if (!reviewerId) { setError("Your portal member record could not be found."); return; }
    const supabase = getPortalBrowserClient(); setBusyId(submission.id); setError("");
    const updates = { status, reviewed_by: reviewerId, reviewed_at: new Date().toISOString(), ...(status === "approved" ? { hours_awarded: amount, rejection_reason: null } : { rejection_reason: rejectionReason }) };
    const { data, error: updateError } = await supabase.from("portal_hour_submissions").update(updates).eq("id", submission.id).select("id, event_id, user_id, semester_id, start_photo_url, end_photo_url, status, hours_awarded, reviewed_by, reviewed_at, rejection_reason, submitted_at, portal_events(title)").single();
    setBusyId("");
    if (updateError) { setError("Unable to save the review. Your admin access may have changed; refresh and try again."); return; }
    const reviewer = members.find((member) => member.id === reviewerId);
    setSubmissions((current) => current.map((item) => item.id === submission.id ? { ...data, member: item.member, reviewer } : item));
    setRejectingId(""); setReason("");
  }

  if (loading) return <p className="mt-8 text-sm text-gray-600">Loading activity-hour reviews…</p>;
  return <div className="mt-8 space-y-8">
    {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
    <section><h2 className="text-xl font-bold text-gray-950">Pending submissions</h2><div className="mt-4 space-y-6">{!pending.length ? <p className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-600 shadow-sm">No pending submissions.</p> : pending.map((submission) => <article key={submission.id} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"><div className="flex flex-wrap justify-between gap-3"><div><h3 className="text-lg font-bold text-gray-950">{submission.portal_events?.title || "Event unavailable"}</h3><p className="mt-1 text-sm text-gray-600">{submission.member?.name || "Unknown brother"} · submitted {fmtDate(submission.submitted_at)}</p></div></div><div className="mt-6 grid gap-6 lg:grid-cols-2"><Photo url={submission.start_photo_url} label="Start of event photo" onOpen={(url, label) => setPhoto({ url, label })} /><Photo url={submission.end_photo_url} label="End of event photo" onOpen={(url, label) => setPhoto({ url, label })} /></div><div className="mt-6 border-t border-gray-100 pt-5"><label className="block text-sm font-semibold text-gray-800">Hours awarded</label><input type="number" min="0" step="0.25" value={hoursById[submission.id] ?? ""} onChange={(event) => setHoursById((current) => ({ ...current, [submission.id]: event.target.value }))} className="mt-2 w-full max-w-xs rounded-lg border border-gray-300 px-3 py-2 text-sm" />{Number(hoursById[submission.id]) > 5 && <p className="mt-2 text-xs font-semibold text-amber-700">More than 5 hours: confirm this is intentional before approving.</p>}<div className="mt-4 flex flex-wrap gap-3"><button type="button" disabled={busyId === submission.id} onClick={() => review(submission, "approved")} className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">Approve</button><button type="button" disabled={busyId === submission.id} onClick={() => { setRejectingId(submission.id); setReason(""); }} className="rounded-lg border border-red-300 px-4 py-2.5 text-sm font-semibold text-red-700 disabled:opacity-60">Reject</button></div>{rejectingId === submission.id && <div className="mt-4 rounded-lg bg-red-50 p-4"><label className="block text-sm font-semibold text-red-900">Rejection reason</label><textarea value={reason} onChange={(event) => setReason(event.target.value)} className="mt-2 w-full rounded-lg border border-red-200 p-3 text-sm" rows="3" /><p className="mt-2 text-xs text-red-800">Rejection is final; the brother cannot resubmit for this event.</p><button type="button" onClick={() => review(submission, "rejected")} className="mt-3 rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white">Confirm rejection</button></div>}</div></article>)}</div></section>
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"><h2 className="text-xl font-bold text-gray-950">Review history</h2><div className="mt-4 flex flex-wrap gap-3"><select value={eventFilter} onChange={(event) => setEventFilter(event.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm"><option value="">All events</option>{events.map(([id, title]) => <option key={id} value={id}>{title}</option>)}</select><select value={memberFilter} onChange={(event) => setMemberFilter(event.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm"><option value="">All brothers</option>{members.map((member) => <option key={member.id} value={member.user_id}>{member.name}</option>)}</select></div><div className="mt-4 overflow-x-auto"><table className="w-full min-w-[700px] text-left text-sm"><thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr><th className="p-3">Event</th><th className="p-3">Brother</th><th className="p-3">Outcome</th><th className="p-3">Reviewer</th><th className="p-3">Reviewed</th></tr></thead><tbody>{history.map((submission) => <tr key={submission.id} className="border-t"><td className="p-3">{submission.portal_events?.title}</td><td className="p-3">{submission.member?.name}</td><td className="p-3">{submission.status === "approved" ? `${fmtHours(submission.hours_awarded)} hrs approved` : `Rejected: ${submission.rejection_reason || "—"}`}</td><td className="p-3">{submission.reviewer?.name || "—"}</td><td className="p-3">{fmtDate(submission.reviewed_at)}</td></tr>)}</tbody></table></div></section>
    <section><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-bold text-gray-950">{semester ? `${semester.name} progress` : "Semester progress"}</h2><select value={summarySort} onChange={(event) => setSummarySort(event.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm"><option value="lowest">Lowest hours first</option><option value="highest">Highest hours first</option></select></div>{semester ? <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"><table className="w-full text-left text-sm"><thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr><th className="p-4">Brother</th><th className="p-4">Status</th><th className="p-4 text-right">Approved hours</th></tr></thead><tbody>{summary.map((member) => <tr key={member.id} className={`border-t ${member.total < Number(semester.required_hours) && ended ? "bg-red-50" : ""}`}><td className="p-4 font-semibold">{member.name}</td><td className="p-4">{member.total >= Number(semester.required_hours) ? "Requirement met" : ended ? "Below requirement — semester ended" : "In progress"}</td><td className="p-4 text-right font-bold">{fmtHours(member.total)} / {fmtHours(semester.required_hours)}</td></tr>)}</tbody></table></div> : <p className="mt-4 text-sm text-gray-600">No active semester.</p>}</section>
    {photo && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-5" role="dialog" aria-modal="true"><div className="max-h-full max-w-5xl"><div className="mb-3 flex justify-between gap-4 text-white"><p className="font-semibold">{photo.label}</p><button type="button" onClick={() => setPhoto(null)}>Close</button></div><img src={cloudinaryDisplayUrl(photo.url)} alt={photo.label} className="max-h-[85vh] max-w-full rounded-lg" /><a href={photo.url} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm font-semibold text-white underline">View original</a></div></div>}
  </div>;
}
