"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const ROLES = ["admin", "exec", "director", "brother", "pledge"];

export default function PortalMembersManager({ members, error }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [rowError, setRowError] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("brother");
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState("");

  const filteredMembers = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return members;
    return members.filter((member) =>
      member.email.toLowerCase().includes(normalized)
    );
  }, [members, query]);

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

  const openAddModal = () => {
    setNewEmail("");
    setNewRole("brother");
    setAddError("");
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    if (adding) return;
    setShowAddModal(false);
  };

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

      setShowAddModal(false);
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
              Search by email, change a role, or deactivate an account.
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

        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-primary text-white">
              <tr>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => (
                <tr key={member.id} className="border-b border-gray-200">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-gray-950">{member.email}</p>
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
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-600">
                    No members match that search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

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
              The member must complete onboarding after signing in for the first
              time.
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
