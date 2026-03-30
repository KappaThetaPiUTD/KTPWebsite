"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";

export default function AdminStrikesPage() {
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [strikeReason, setStrikeReason] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState(""); // "success" | "error"

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    const { data, error } = await supabase
      .from("users")
      .select("id, name, email");

    if (error) {
      console.error("Users fetch error:", error);
      return;
    }

    setAllUsers(data || []);
  }

  function openStrikeModal(user) {
    setSelectedUser(user);
    setStrikeReason("");
    setFeedbackMessage("");
    setFeedbackType("");
    setIsModalOpen(true);
  }

  function closeStrikeModal() {
    if (isSubmitting) return;
    setIsModalOpen(false);
    setSelectedUser(null);
    setStrikeReason("");
    setFeedbackMessage("");
    setFeedbackType("");
  }

  async function handleLogStrike() {
    if (!selectedUser || !strikeReason.trim()) return;

    setIsSubmitting(true);
    setFeedbackMessage("");
    setFeedbackType("");

    const { error } = await supabase.from("strikes_log").insert([
      {
        user_id: selectedUser.id,
        reason: strikeReason.trim(),
      },
    ]);

    if (error) {
      setFeedbackMessage(`Error logging strike: ${error.message}`);
      setFeedbackType("error");
      setIsSubmitting(false);
      return;
    }

    setFeedbackMessage("Strike logged successfully.");
    setFeedbackType("success");
    setIsSubmitting(false);

    setTimeout(() => {
      closeStrikeModal();
    }, 1000);
  }

  return (
    <section className="p-4">
      <h2 className="text-2xl font-semibold mb-4 text-primary">
        Log Strikes for Users
      </h2>

      <div className="overflow-x-auto border border-gray-300 rounded-xl shadow-sm bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-primary text-white">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {allUsers.map((u) => (
              <tr
                key={u.id}
                className="border-t bg-white hover:bg-gray-50 text-black transition"
              >
                <td className="px-4 py-3">{u.name || "N/A"}</td>
                <td className="px-4 py-3">{u.email || "N/A"}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => openStrikeModal(u)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition"
                  >
                    Log Strike
                  </button>
                </td>
              </tr>
            ))}

            {!allUsers.length && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            <div className="border-b px-6 py-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Log Strike
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Enter the reason for issuing a strike.
              </p>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div className="rounded-lg bg-gray-50 border border-gray-200 p-4">
                <p className="text-sm text-gray-500">User</p>
                <p className="text-base font-semibold text-gray-900">
                  {selectedUser.name || "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  {selectedUser.email || "N/A"}
                </p>
              </div>

              <div>
                <label
                  htmlFor="strikeReason"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Strike Reason
                </label>
                <textarea
                  id="strikeReason"
                  rows={4}
                  value={strikeReason}
                  onChange={(e) => setStrikeReason(e.target.value)}
                  placeholder="Enter the reason for this strike..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                />
              </div>

              {feedbackMessage && (
                <div
                  className={`rounded-lg px-4 py-3 text-sm font-medium ${
                    feedbackType === "success"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {feedbackMessage}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 border-t px-6 py-4">
              <button
                onClick={closeStrikeModal}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleLogStrike}
                disabled={isSubmitting || !strikeReason.trim()}
                className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Logging..." : "Submit Strike"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}