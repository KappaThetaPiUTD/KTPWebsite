"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const ROLES = ["admin", "exec", "director", "brother", "pledge"];

function formatCentralDate(value) {
  return new Date(value).toLocaleString("en-US", {
    timeZone: "America/Chicago",
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function PortalMembersManager({ members, recentStrikes, error }) {
  const router = useRouter();
  const [memberList, setMemberList] = useState(members);
  const [strikeList, setStrikeList] = useState(recentStrikes);
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [rowError, setRowError] = useState("");
  const [notice, setNotice] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("brother");
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const [strikeReason, setStrikeReason] = useState("");
  const [loggingStrike, setLoggingStrike] = useState(false);
  const [strikeError, setStrikeError] = useState("");

  useEffect(() => {
    setMemberList(members);
  }, [members]);

  useEffect(() => {
    setStrikeList(recentStrikes);
  }, [recentStrikes]);

  const filteredMembers = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return memberList;
    return memberList.filter(
      (member) =>
        member.email.toLowerCase().includes(normalized) ||
        member.name.toLowerCase().includes(normalized)
    );
  }, [memberList, query]);

  const patchMember = async (memberId, updates) => {
    setBusyId(memberId);
    setRowError("");
    try {
      const response = await fetch("/api/portal/admin/members", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId, ...updates }),
      });
      const result = await response.json();

      if (!response.ok) {
        setRowError(result.error || "Unable to update member.");
        return;
      }

      setMemberList((previousMembers) =>
        previousMembers.map((member) =>
          member.id === memberId
            ? { ...member, ...(result.member || updates) }
            : member
        )
      );
      router.refresh();
    } catch {
      setRowError("Unable to update member right now.");
    } finally {
      setBusyId(null);
    }
  };

  const handleRoleChange = (member, role) => {
    if (role === member.role) return;
    patchMember(member.id, { role });
  };

  const handleStatusToggle = (member) => {
    const status = member.status === "active" ? "inactive" : "active";
    patchMember(member.id, { status });
  };

  const openStrikeModal = (member) => {
    setSelectedMember(member);
    setStrikeReason("");
    setStrikeError("");
  };

  const closeStrikeModal = () => {
    if (loggingStrike) return;
    setSelectedMember(null);
    setStrikeReason("");
    setStrikeError("");
  };

  const submitStrike = async () => {
    const reason = strikeReason.trim();
    if (!selectedMember || reason.length < 5) {
      setStrikeError("Enter a reason with at least 5 characters.");
      return;
    }

    setLoggingStrike(true);
    setStrikeError("");
    try {
      const response = await fetch("/api/portal/admin/strikes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberUserId: selectedMember.userId, reason }),
      });
      const result = await response.json();
      if (!response.ok) {
        setStrikeError(result.error || "Unable to log the strike.");
        return;
      }

      setMemberList((current) =>
        current.map((member) =>
          member.id === selectedMember.id
            ? { ...member, strikeCount: member.strikeCount + 1 }
            : member
        )
      );
      setSelectedMember(null);
      setStrikeReason("");
      router.refresh();
    } catch {
      setStrikeError("Unable to log the strike right now.");
    } finally {
      setLoggingStrike(false);
    }
  };

  const openAddModal = () => {
    setNewEmail("");
    setNewRole("brother");
    setAddError("");
    setShowAddModal(true);
  };

  const closeAddModal = useCallback(() => {
    if (adding) return;
    setShowAddModal(false);
  }, [adding]);

  useEffect(() => {
    if (!showAddModal) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeAddModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showAddModal, closeAddModal]);

  const submitAdd = async () => {
    const email = newEmail.trim().toLowerCase();
    if (!email) {
      setAddError("Enter an email address.");
      return;
    }

    setAdding(true);
    setAddError("");
    try {
      const response = await fetch("/api/portal/admin/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role: newRole }),
      });
      const result = await response.json();

      if (!response.ok) {
        setAddError(result.error || "Unable to add member.");
        return;
      }

      setMemberList((previousMembers) => [result.member, ...previousMembers]);
      setShowAddModal(false);
      setNotice(
        result.inviteSent
          ? {
              type: "success",
              message: "Member added and invitation sent. They can set their password from the email.",
            }
          : {
              type: "warning",
              message: result.warning || "Member added, but the invitation was not sent.",
            }
      );
      router.refresh();
    } catch {
      setAddError("Unable to add member right now.");
    } finally {
      setAdding(false);
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
            <h2 className="text-xl font-bold text-gray-950">Members</h2>
            <p className="mt-1 text-sm text-gray-600">
              Search by name or email, manage access, and record strikes for active members.
            </p>
          </div>
          <div className="flex w-full gap-3 sm:w-auto sm:items-end">
            <div className="w-full sm:max-w-sm">
              <label
                className="mb-2 block text-sm font-semibold text-gray-900"
                htmlFor="member-search"
              >
                Search members
              </label>
              <input
                id="member-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-black outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <button
              type="button"
              onClick={openAddModal}
              className="h-fit rounded-lg bg-primary px-4 py-2.5 font-semibold text-white hover:bg-primary/90"
            >
              Add member
            </button>
          </div>
        </div>

        {rowError && (
          <p className="mt-4 text-sm font-medium text-red-700" role="alert">
            {rowError}
          </p>
        )}
        {notice && (
          <p className={`mt-4 rounded-lg border px-4 py-3 text-sm font-medium ${notice.type === "success" ? "border-green-200 bg-green-50 text-green-800" : "border-amber-200 bg-amber-50 text-amber-900"}`} role="status">
            {notice.message}
          </p>
        )}

        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-primary text-white">
              <tr>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Strikes</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => (
                <tr key={member.id} className="border-b border-gray-200">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-gray-950">{member.name}</p>
                    <p className="text-xs text-gray-600">{member.email}</p>
                    {!member.hasLoggedIn && (
                      <p className="text-xs text-gray-500">Invited, not yet signed in</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={member.role}
                      disabled={busyId === member.id}
                      onChange={(event) =>
                        handleRoleChange(member, event.target.value)
                      }
                      className="rounded-lg border border-gray-300 px-3 py-1.5 text-black outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                    >
                      {ROLES.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 capitalize text-gray-700">
                    {member.status}
                  </td>
                  <td className="px-4 py-3">
                    {member.userId && member.status === "active" ? (
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-gray-900">
                          {member.strikeCount}
                        </span>
                        <button
                          type="button"
                          onClick={() => openStrikeModal(member)}
                          className="rounded-lg bg-red-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-800"
                        >
                          Log strike
                        </button>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      disabled={busyId === member.id}
                      onClick={() => handleStatusToggle(member)}
                      className="rounded-lg border border-gray-300 px-4 py-2 font-semibold text-gray-800 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {member.status === "active" ? "Deactivate" : "Reactivate"}
                    </button>
                  </td>
                </tr>
              ))}
              {filteredMembers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-600">
                    No members match that search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-xl font-bold text-gray-950">Recent strike log</h2>
        <p className="mt-1 text-sm text-gray-600">
          The issuing officer and timestamp are recorded automatically.
        </p>
        <div className="mt-4 space-y-3">
          {strikeList.map((strike) => (
            <article
              key={strike.id}
              className="rounded-xl border border-gray-200 bg-gray-50 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-gray-950">{strike.memberName}</p>
                <time className="text-xs text-gray-600">
                  {formatCentralDate(strike.createdAt)}
                </time>
              </div>
              <p className="mt-2 text-sm leading-6 text-gray-800">{strike.reason}</p>
              <p className="mt-2 text-xs text-gray-600">
                Logged by {strike.issuerName}
              </p>
            </article>
          ))}
          {strikeList.length === 0 && (
            <p className="text-sm text-gray-600">No strikes have been logged.</p>
          )}
        </div>
      </section>

      {selectedMember && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/55 px-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeStrikeModal();
          }}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white p-6 text-black shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="strike-dialog-title"
          >
            <h2 id="strike-dialog-title" className="text-2xl font-bold text-gray-950">
              Log strike for {selectedMember.name}
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
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
              value={strikeReason}
              onChange={(event) => setStrikeReason(event.target.value)}
              disabled={loggingStrike}
              className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-black outline-none focus:border-red-600 focus:ring-2 focus:ring-red-200"
            />
            <p className="mt-1 text-right text-xs text-gray-500">
              {strikeReason.length}/500
            </p>
            {strikeError && (
              <p className="mt-3 text-sm font-medium text-red-700" role="alert">
                {strikeError}
              </p>
            )}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeStrikeModal}
                disabled={loggingStrike}
                className="rounded-lg border border-gray-300 px-4 py-2.5 font-semibold text-gray-800 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submitStrike}
                disabled={loggingStrike || strikeReason.trim().length < 5}
                className="rounded-lg bg-red-700 px-4 py-2.5 font-semibold text-white hover:bg-red-800 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {loggingStrike ? "Logging..." : "Confirm strike"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/55 px-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeAddModal();
          }}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white p-6 text-black shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-member-dialog-title"
          >
            <h2 id="add-member-dialog-title" className="text-2xl font-bold text-gray-950">
              Add member
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              An invitation email will let the member set a password, then
              complete onboarding on their first sign-in.
            </p>

            <label
              className="mb-2 mt-5 block text-sm font-semibold text-gray-900"
              htmlFor="new-member-email"
            >
              Email
            </label>
            <input
              id="new-member-email"
              type="email"
              value={newEmail}
              onChange={(event) => setNewEmail(event.target.value)}
              disabled={adding}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-black outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />

            <label
              className="mb-2 mt-4 block text-sm font-semibold text-gray-900"
              htmlFor="new-member-role"
            >
              Role
            </label>
            <select
              id="new-member-role"
              value={newRole}
              onChange={(event) => setNewRole(event.target.value)}
              disabled={adding}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-black outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              {ROLES.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>

            {addError && (
              <p className="mt-3 text-sm font-medium text-red-700" role="alert">
                {addError}
              </p>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeAddModal}
                disabled={adding}
                className="rounded-lg border border-gray-300 px-4 py-2.5 font-semibold text-gray-800 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submitAdd}
                disabled={adding || !newEmail.trim()}
                className="rounded-lg bg-primary px-4 py-2.5 font-semibold text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {adding ? "Adding..." : "Add member"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}