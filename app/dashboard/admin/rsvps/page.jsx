"use client";

import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { supabase } from "../../../../lib/supabase";

/** Excel‑style header filter (chevron opens a small floating menu) */

function HeaderFilter({
  label,
  value,
  onChange,
  options,
  ariaLabel,
  align = "right",
}) {
  const [open, setOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [pos, setPos] = React.useState({ top: 0, left: 0 });
  const btnRef = React.useRef(null);
  const menuRef = React.useRef(null);

  React.useEffect(() => setMounted(true), []);

  const updatePosition = React.useCallback(() => {
    const el = btnRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const menuW = 192; // Tailwind w-48
    let left = align === "left" ? rect.left : rect.right - menuW;
    const margin = 8;
    left = Math.max(margin, Math.min(left, window.innerWidth - menuW - margin));
    const top = Math.min(rect.bottom + 6, window.innerHeight - margin);
    setPos({ top, left });
  }, [align]);

  React.useEffect(() => {
    if (!open) return;
    updatePosition();

    const handlePointerDown = (e) => {
      const inButton = btnRef.current?.contains(e.target);
      const inMenu = menuRef.current?.contains(e.target);
      if (!inButton && !inMenu) setOpen(false);
    };
    const handleScrollOrResize = () => setOpen(false);

    document.addEventListener("pointerdown", handlePointerDown, true);
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, true);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [open, updatePosition]);

  return (
    <div className="flex items-center gap-1">
      <span className="select-none">{label}</span>

      {/* toggle button */}
      <button
        ref={btnRef}
        type="button"
        className="inline-flex items-center justify-center w-4 h-4 cursor-pointer"
        aria-label={`Filter ${ariaLabel}`}
        onClick={() => {
          if (!open) updatePosition();
          setOpen((v) => !v);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-4 h-4 text-white/90"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* portal menu */}
      {mounted &&
        open &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: "fixed",
              top: pos.top,
              left: pos.left,
              zIndex: 9999,
            }}
            className="w-48 bg-white text-black border border-gray-300 rounded shadow-lg p-2"
            // prevent outside-click handler from firing when interacting inside
            onPointerDown={(e) => e.stopPropagation()}
          >
            <label className="text-xs text-gray-600 block mb-1">
              Filter {label}
            </label>
            <select
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm bg-white text-black max-h-44 overflow-auto"
              value={value}
              onChange={(e) => {
                onChange(e.target.value);
                setOpen(false); // auto-close after selection
              }}
            >
              <option value="all">All</option>
              {options.length === 0 ? (
                <option disabled>(No options)</option>
              ) : (
                options.map((opt) => (
                  <option key={String(opt.value)} value={String(opt.value)}>
                    {opt.label}
                  </option>
                ))
              )}
            </select>

            {value !== "all" && (
              <button
                className="mt-2 text-xs underline text-gray-700 hover:text-black"
                onClick={() => {
                  onChange("all");
                  setOpen(false);
                }}
              >
                Clear
              </button>
            )}
          </div>,
          document.body
        )}
    </div>
  );
}

export default function AdminRsvpsPage() {
  const [rsvpData, setRsvpData] = useState([]);

  // header filters
  const [selectedEventId, setSelectedEventId] = useState("all");
  const [selectedResponse, setSelectedResponse] = useState("all");
  const [nameFilter, setNameFilter] = useState("all");

  useEffect(() => {
    (async () => {
      const { data: rsvps, error } = await supabase.rpc("rsvps_admin_list");
      if (error) {
        console.error("RSVP admin list error:", error);
        setRsvpData([]);
        return;
      }
      setRsvpData(
        (rsvps || []).map((r) => ({
          id: r.id,
          event_id: r.event_id ?? null,
          event_title: r.event_title ?? null,
          response: r.response ?? null,
          response_updated_at: r.response_updated_at ?? null,
          user_name: r.user_name ?? null,
          user_email: r.user_email ?? null,
        }))
      );
    })();
  }, []);

  /** Build Name options from rows (fallback to a nice version of email prefix) */
  const nameOptions = useMemo(() => {
    const toDisplay = (r) => {
      const raw = (r.user_name || "").trim();
      if (raw) return raw;
      const prefix = (r.user_email || "").split("@")[0] || "";
      if (!prefix) return null;
      return prefix
        .replace(/[._-]+/g, " ")
        .split(" ")
        .filter(Boolean)
        .map((s) => s[0]?.toUpperCase() + s.slice(1))
        .join(" ");
    };

    const set = new Set();
    for (const r of rsvpData) {
      const name = toDisplay(r);
      if (name) set.add(name);
    }

    return Array.from(set)
      .sort((a, b) => a.localeCompare(b))
      .map((n) => ({ value: n, label: n }));
  }, [rsvpData]);

  /** Build Event options from rows (use id when present, else title) */
  const eventOptions = useMemo(() => {
    const map = new Map(); // key -> label (key is id if present, else title)
    for (const r of rsvpData) {
      const id = r.event_id != null ? String(r.event_id) : null;
      const title = (r.event_title || (id ? `Event ${id}` : null))?.trim();
      if (!title) continue;
      const key = id ?? title;
      if (!map.has(key)) map.set(key, title);
    }
    return Array.from(map, ([value, label]) => ({ value, label })).sort(
      (a, b) => a.label.localeCompare(b.label)
    );
  }, [rsvpData]);

  /** Build Response options from rows (normalized to 4 buckets) */
  const responseOptions = useMemo(() => {
    const norm = (resp) => {
      const s = (resp || "").toLowerCase().trim();
      if (s === "yes" || s === "going") return "going";
      if (s === "maybe") return "maybe";
      if (s === "no" || s === "not going") return "not going";
      return "unanswered";
    };
    const labels = {
      going: "Going",
      maybe: "Maybe",
      "not going": "No",
      unanswered: "Haven't Responded",
    };
    const set = new Set();
    for (const r of rsvpData) set.add(norm(r.response));
    return Array.from(set)
      .sort((a, b) => labels[a].localeCompare(labels[b]))
      .map((v) => ({ value: v, label: labels[v] }));
  }, [rsvpData]);

  /** Apply stacked filters */
  const filteredRsvps = useMemo(() => {
    const normalizedResponse = (resp) => {
      const s = (resp || "").toLowerCase().trim();
      if (s === "yes" || s === "going") return "going";
      if (s === "maybe") return "maybe";
      if (s === "no" || s === "not going") return "not going";
      return "unanswered";
    };

    return rsvpData.filter((r) => {
      // Event: allow id OR title to match the chosen option
      const eventKey =
        r.event_id != null ? String(r.event_id) : (r.event_title || "").trim();
      const eventOk = selectedEventId === "all" || eventKey === selectedEventId;

      // Response
      const responseOk =
        selectedResponse === "all" ||
        normalizedResponse(r.response) === selectedResponse;

      // Name (exact option from our computed display name)
      const displayRaw =
        (r.user_name || "").trim() || (r.user_email || "").split("@")[0] || "";
      const niceName = displayRaw
        .replace(/[._-]+/g, " ")
        .split(" ")
        .filter(Boolean)
        .map((s) => s[0]?.toUpperCase() + s.slice(1))
        .join(" ");
      const nameOk = nameFilter === "all" || niceName === nameFilter;

      return eventOk && responseOk && nameOk;
    });
  }, [rsvpData, selectedEventId, selectedResponse, nameFilter]);

  const rsvpCount = filteredRsvps.length;

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-primary">RSVP Submissions</h2>
        <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
          Showing {rsvpCount} RSVP{rsvpCount === 1 ? "" : "s"}
        </span>
      </div>

      <div className="overflow-x-auto border border-gray-300 rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-primary text-white">
            <tr>
              <th className="px-4 py-2 text-left">
                <HeaderFilter
                  label="Name"
                  ariaLabel="by name"
                  value={nameFilter}
                  onChange={setNameFilter}
                  options={nameOptions}
                  align="left"
                />
              </th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">
                <HeaderFilter
                  label="Event"
                  ariaLabel="by event"
                  value={selectedEventId}
                  onChange={setSelectedEventId}
                  options={eventOptions}
                />
              </th>
              <th className="px-4 py-2 text-left">
                <HeaderFilter
                  label="Response"
                  ariaLabel="by response"
                  value={selectedResponse}
                  onChange={setSelectedResponse}
                  options={responseOptions}
                />
              </th>
              <th className="px-4 py-2 text-left">Last Updated</th>
            </tr>
          </thead>

          <tbody>
            {filteredRsvps.length ? (
              filteredRsvps.map((entry) => (
                <tr
                  key={entry.id}
                  className="border-t bg-white hover:bg-gray-50 text-black"
                >
                  <td className="px-4 py-2">
                    {entry.user_name ||
                      (() => {
                        // display the same fallback we used to build options
                        const prefix =
                          (entry.user_email || "").split("@")[0] || "";
                        return (
                          prefix
                            .replace(/[._-]+/g, " ")
                            .split(" ")
                            .filter(Boolean)
                            .map((s) => s[0]?.toUpperCase() + s.slice(1))
                            .join(" ") || "N/A"
                        );
                      })()}
                  </td>
                  <td className="px-4 py-2">{entry.user_email || "N/A"}</td>
                  <td className="px-4 py-2">
                    {entry.event_title ||
                      (entry.event_id != null
                        ? `Event ${entry.event_id}`
                        : "N/A")}
                  </td>
                  <td className="px-4 py-2 capitalize">
                    {entry.response || "N/A"}
                  </td>
                  <td className="px-4 py-2">
                    {entry.response_updated_at
                      ? new Date(entry.response_updated_at).toLocaleString()
                      : "N/A"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                  No RSVPs for the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
