"use client";

import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";
import { getPortalBrowserClient } from "../../lib/portal/client";

function formatTime(value) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(value));
}

export default function LiveAttendanceMonitor({ events, initialEventId }) {
  const [eventId, setEventId] = useState(initialEventId || "");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(Boolean(initialEventId));
  const [error, setError] = useState("");
  const [realtimeStatus, setRealtimeStatus] = useState("Connecting");
  const [updatingWindow, setUpdatingWindow] = useState(false);
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [showProjection, setShowProjection] = useState(false);
  const [qrPayload, setQrPayload] = useState("");

  const selectedEvent = events.find((event) => event.id === eventId);

  useEffect(() => {
    setCheckInOpen(Boolean(selectedEvent?.is_check_in_open));
  }, [selectedEvent?.id, selectedEvent?.is_check_in_open]);

  useEffect(() => {
    let cancelled = false;
    async function loadRecords() {
      if (!eventId) {
        setRecords([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const response = await fetch(`/api/portal/admin/attendance?eventId=${eventId}`, { cache: "no-store" });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Unable to load attendance.");
        if (!cancelled) setRecords(data.attendance || []);
      } catch (loadError) {
        if (!cancelled) setError(loadError.message || "Unable to load attendance.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadRecords();
    // Realtime remains the primary update path. Polling is a safety net for
    // browsers or Supabase projects where the Realtime connection drops.
    const refreshInterval = setInterval(loadRecords, 5000);
    return () => {
      cancelled = true;
      clearInterval(refreshInterval);
    };
  }, [eventId]);

  useEffect(() => {
    if (!eventId) return undefined;
    const supabase = getPortalBrowserClient();
    if (!supabase) {
      setRealtimeStatus("Unavailable");
      return undefined;
    }
    setRealtimeStatus("Connecting");
    const channel = supabase
      .channel(`portal-attendance-live-${eventId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "portal_attendance", filter: `event_id=eq.${eventId}` }, async () => {
        const response = await fetch(`/api/portal/admin/attendance?eventId=${eventId}`, { cache: "no-store" });
        const data = await response.json();
        if (response.ok) setRecords(data.attendance || []);
      })
      .subscribe((status) => {
        setRealtimeStatus(status === "SUBSCRIBED" ? "Live" : status === "CHANNEL_ERROR" ? "Unavailable" : "Connecting");
      });
    return () => { supabase.removeChannel(channel); };
  }, [eventId]);

  const setCheckInWindow = async (isCheckInOpen) => {
    if (!eventId) return;
    setUpdatingWindow(true);
    setError("");
    try {
      const response = await fetch(`/api/portal/admin/events/${eventId}/check-in`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isCheckInOpen }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to update check-in window.");
      setCheckInOpen(data.event.is_check_in_open);
    } catch (updateError) {
      setError(updateError.message || "Unable to update check-in window.");
    } finally {
      setUpdatingWindow(false);
    }
  };

  const openProjection = async () => {
    if (!eventId) return;
    try {
      const response = await fetch(`/api/portal/admin/events/${eventId}/qr`, { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to prepare QR code.");
      setQrPayload(data.payload);
      setShowProjection(true);
    } catch (projectionError) {
      setError(projectionError.message || "Unable to prepare QR code.");
    }
  };

  return (
    <div className="mt-7 space-y-6">
      {error && <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800" role="alert">{error}</p>}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="w-full lg:max-w-xl">
            <label htmlFor="live-attendance-event" className="block text-sm font-semibold text-gray-800">Event</label>
            <select id="live-attendance-event" value={eventId} onChange={(event) => setEventId(event.target.value)} className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-950 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
              <option value="">Choose an event</option>
              {events.map((event) => <option key={event.id} value={event.id}>{event.title}</option>)}
            </select>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${realtimeStatus === "Live" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>{realtimeStatus} updates</span>
            <button type="button" onClick={openProjection} disabled={!eventId} className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-800 hover:border-primary hover:text-primary disabled:opacity-50">Project QR code</button>
          </div>
        </div>
        {selectedEvent && <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-5"><p className="text-sm text-gray-700">Check-in is <span className="font-semibold">{checkInOpen ? "open" : "closed"}</span>.</p><button type="button" onClick={() => setCheckInWindow(!checkInOpen)} disabled={updatingWindow} className={`rounded-lg px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60 ${checkInOpen ? "bg-red-700 hover:bg-red-800" : "bg-primary hover:opacity-90"}`}>{updatingWindow ? "Saving…" : checkInOpen ? "Close check-in" : "Open check-in"}</button></div>}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-baseline justify-between gap-4"><h2 className="text-xl font-bold text-gray-950">Live check-ins</h2><p className="text-sm text-gray-600">{records.length} total</p></div>
        {loading ? <p className="mt-5 text-sm text-gray-600">Loading check-ins…</p> : records.length === 0 ? <p className="mt-5 text-sm text-gray-600">No members have checked in yet.</p> : <div className="mt-5 divide-y divide-gray-100">{[...records].reverse().map((record) => <div key={record.id} className="flex items-center justify-between gap-4 py-4"><div><p className="font-semibold text-gray-950">{record.full_name || "Member"}</p><p className="mt-1 text-xs text-gray-600">{formatTime(record.checked_in_at)} · {record.method}</p></div><span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${record.status === "late" ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800"}`}>{record.status}</span></div>)}</div>}
      </section>

      {showProjection && <div className="fixed inset-0 z-[100] flex min-h-screen flex-col items-center justify-center bg-white p-8 text-center"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Live check-in</p><h2 className="mt-3 text-3xl font-bold text-gray-950">{selectedEvent?.title}</h2><QRCodeSVG value={qrPayload} size={520} className="mt-8 max-h-[60vh] max-w-[85vw]" title={`QR code for ${selectedEvent?.title}`} /><p className="mt-6 text-lg text-gray-700">Scan this code from the Attendance page.</p><button type="button" onClick={() => setShowProjection(false)} className="mt-8 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white hover:opacity-90">Exit projection</button></div>}
    </div>
  );
}
