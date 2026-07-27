"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

function formatCentralDate(value) {
  return new Date(value).toLocaleString("en-US", {
    timeZone: "America/Chicago",
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function PortalStrikesManager({ members, recentStrikes, error }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");

  const filteredMembers = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return members;
    return members.filter(
      (member) =>
        member.name.toLowerCase().includes(normalized) ||
        member.email.toLowerCase().includes(normalized)
    );
  }, [members, query]);

  const openModal = (member) => {
    setSelectedMember(member);
    setReason("");
    setFeedback("");
  };

  const closeModal = () => {
    if (submitting) return;
    setSelectedMember(null);
    setReason("");
    setFeedback("");
  };

  const submitStrike = async () => {
    const normalizedReason = reason.trim();
    if (!selectedMember || normalizedReason.length < 5) {
      setFeedback("Enter a reason with at least 5 characters.");
      return;
    }

    setSubmitting(true);
    setFeedback("");
    try {
      const response = await fetch("/api/portal/admin/strikes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memberUserId: selectedMember.userId,
          reason: normalizedReason,
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        setFeedback(result.error || "Unable to log the strike.");
        return;
      }

      setSelectedMember(null);
      setReason("");
      router.refresh();
    } catch {
      setFeedback("Unable to log the strike right now.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-7 space-y-8">
      {error && (
        <p
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800"
          role="alert"
        >
          {error}
        </p>
      )}

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-950">Active members</h2>
            <p className="mt-1 text-sm text-gray-600">
              Search for a member, then record a specific factual reason.
            </p>
          </div>
          <div className="w-full sm:max-w-sm">
            <label
              className="mb-2 block text-sm font-semibold text-gray-900"
              htmlFor="strike-member-search"
            >
              Search members
            </label>
            <input
              id="strike-member-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-black outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-primary text-white">
              <tr>
                <th className="px-4 py-3">Member</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Strikes</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => (
                <tr key={member.userId} className="border-b border-gray-200">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-gray-950">{member.name}</p>
                    <p className="text-xs text-gray-600">{member.email}</p>
                  </td>
                  <td className="px-4 py-3 capitalize text-gray-700">
                    {member.role}
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-900">
                    {member.strikeCount}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => openModal(member)}
                      className="rounded-lg bg-red-700 px-4 py-2 font-semibold text-white hover:bg-red-800"
                    >
                      Log strike
                    </button>
                  </td>
                </tr>
              ))}
              {filteredMembers.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-8 text-center text-gray-600"
                  >
                    No active members match that search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-xl font-bold text-gray-950">Recent strike log</h2>
        <div className="mt-4 space-y-3">
          {recentStrikes.map((strike) => (
            <article
              key={strike.id}
              className="rounded-xl border border-gray-200 bg-gray-50 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-gray-950">
                  {strike.memberName}
                </p>
                <time className="text-xs text-gray-600">
                  {formatCentralDate(strike.createdAt)}
                </time>
              </div>
              <p className="mt-2 text-sm leading-6 text-gray-800">
                {strike.reason}
              </p>
              <p className="mt-2 text-xs text-gray-600">
                Logged by {strike.issuerName}
              </p>
            </article>
          ))}
          {recentStrikes.length === 0 && (
            <p className="text-sm text-gray-600">No strikes have been logged.</p>
          )}
        </div>
      </section>

      {selectedMember && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/55 px-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white p-6 text-black shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="strike-dialog-title"
          >
            <h2
              id="strike-dialog-title"
              className="text-2xl font-bold text-gray-950"
            >
              Log strike for {selectedMember.name}
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              The authenticated admin and timestamp are recorded automatically.
              Use a factual reason and do not include unnecessary private data.
            </p>
            <label
              className="mb-2 mt-5 block text-sm font-semibold text-gray-900"
              htmlFor="strike-reason"
            >
              Reason
            </label>
            <textarea
              id="strike-reason"
              rows={5}
              maxLength={500}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              disabled={submitting}
              className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-black outline-none focus:border-red-600 focus:ring-2 focus:ring-red-200"
            />
            <p className="mt-1 text-right text-xs text-gray-500">
              {reason.length}/500
            </p>
            {feedback && (
              <p className="mt-3 text-sm font-medium text-red-700" role="alert">
                {feedback}
              </p>
            )}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeModal}
                disabled={submitting}
                className="rounded-lg border border-gray-300 px-4 py-2.5 font-semibold text-gray-800 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submitStrike}
                disabled={submitting || reason.trim().length < 5}
                className="rounded-lg bg-red-700 px-4 py-2.5 font-semibold text-white hover:bg-red-800 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {submitting ? "Logging..." : "Confirm strike"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
