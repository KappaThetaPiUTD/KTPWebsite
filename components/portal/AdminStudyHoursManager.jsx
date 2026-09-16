"use client";

import { useEffect, useMemo, useState } from "react";
import { getPortalBrowserClient } from "../../lib/portal/client";

function formatDateTime(dateString) {
  if (!dateString) return "—";

  return new Date(dateString).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getMemberDisplayName(member) {
  return (
    member?.profile?.full_name ||
    member?.email ||
    member?.profile?.utd_email ||
    "Unknown member"
  );
}

function getStatusClasses(status) {
  switch (status) {
    case "approved":
      return "bg-green-100 text-green-800";
    case "rejected":
      return "bg-red-100 text-red-800";
    default:
      return "bg-amber-100 text-amber-800";
  }
}

function getStartOfCurrentWeek() {
  const now = new Date();
  const day = now.getDay();

  // Monday = start of week
  const daysSinceMonday = day === 0 ? 6 : day - 1;

  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - daysSinceMonday);
  startOfWeek.setHours(0, 0, 0, 0);

  return startOfWeek;
}

function getEndOfCurrentWeek() {
  const startOfWeek = getStartOfCurrentWeek();

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  return endOfWeek;
}

export default function AdminStudyHoursManager() {
  const supabase = useMemo(() => getPortalBrowserClient(), []);

  const [currentUser, setCurrentUser] = useState(null);
  const [currentMember, setCurrentMember] = useState(null);

  const [semester, setSemester] = useState(null);
  const [requirements, setRequirements] = useState({});

  const [submissions, setSubmissions] = useState([]);
  const [members, setMembers] = useState([]);
  const [requiredBrothers, setRequiredBrothers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [reviewingId, setReviewingId] = useState(null);
  const [savingBrother, setSavingBrother] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [brotherSearch, setBrotherSearch] = useState("");

  const [progressSearch, setProgressSearch] = useState("");
  const [progressRoleFilter, setProgressRoleFilter] =
    useState("all");

  const [selectedSubmission, setSelectedSubmission] =
    useState(null);

  const [hoursAwarded, setHoursAwarded] = useState("");
  const [rejectionReason, setRejectionReason] =
    useState("");

  async function loadStudyHours() {
    setLoading(true);
    setError("");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;

      if (!user) {
        setError(
          "You must be signed in to access Study Hours."
        );
        return;
      }

      setCurrentUser(user);

      const { data: memberData, error: memberError } =
        await supabase
          .from("portal_members")
          .select("id, user_id, email, role, status")
          .eq("user_id", user.id)
          .maybeSingle();

      if (memberError) throw memberError;

      if (
        !memberData ||
        !["admin", "exec"].includes(memberData.role)
      ) {
        setError(
          "You do not have permission to manage Study Hours."
        );
        return;
      }

      setCurrentMember(memberData);

      const [
        { data: semesterData, error: semesterError },
        { data: submissionData, error: submissionError },
        { data: requirementData, error: requirementError },
        { data: memberListData, error: memberListError },
        { data: assignmentData, error: assignmentError },
      ] = await Promise.all([
        supabase
          .from("portal_semesters")
          .select(
            "id, name, start_date, end_date, is_active"
          )
          .eq("is_active", true)
          .maybeSingle(),

        supabase
          .from("portal_study_hour_submissions")
          .select(`
            id,
            event_id,
            user_id,
            semester_id,
            start_photo_url,
            end_photo_url,
            status,
            hours_awarded,
            reviewed_by,
            reviewed_at,
            rejection_reason,
            submitted_at,
            updated_at,
            portal_events (
              id,
              title,
              description,
              location,
              start_time,
              end_time,
              event_type
            )
          `)
          .order("submitted_at", {
            ascending: false,
          }),

        supabase
          .from("portal_study_hour_requirements")
          .select("role, hours_per_week"),

        supabase
          .from("portal_members")
          .select(
            "id, user_id, email, role, status"
          )
          .in("role", ["brother", "pledge"]),

        supabase
          .from("portal_study_hour_assignments")
          .select(
            "id, user_id, hours_per_week, assigned_by, assigned_at"
          ),
      ]);

      if (semesterError) throw semesterError;
      if (submissionError) throw submissionError;
      if (requirementError) throw requirementError;
      if (memberListError) throw memberListError;
      if (assignmentError) throw assignmentError;

      setSemester(semesterData);

      /*
       * ----------------------------------------------------------
       * REQUIREMENTS
       * ----------------------------------------------------------
       *
       * Pledges have a global requirement from
       * portal_study_hour_requirements.
       *
       * Brothers get their requirement from
       * portal_study_hour_assignments.
       */

      const requirementMap = {};

      (requirementData || []).forEach(
        (requirement) => {
          requirementMap[requirement.role] =
            Number(
              requirement.hours_per_week || 0
            );
        }
      );

      setRequirements(requirementMap);

      const memberList = memberListData || [];

      /*
       * Only assignment rows represent brothers who
       * are currently required to complete Study Hours.
       *
       * There is no "active" column because removing
       * a requirement deletes the assignment row.
       */
      setRequiredBrothers(
        assignmentData || []
      );

      /*
       * ----------------------------------------------------------
       * MEMBER PROFILES
       * ----------------------------------------------------------
       *
       * portal_members contains the email fallback.
       * Get names/emails from portal_profiles.
       *
       * Filter out null user IDs because portal_members
       * can contain unlinked member records.
       */

      const userIds = [
        ...new Set(
          memberList
            .map((member) => member.user_id)
            .filter(Boolean)
        ),
      ];

      let profileMap = {};

      if (userIds.length > 0) {
        const {
          data: profileData,
          error: profileError,
        } = await supabase
          .from("portal_profiles")
          .select(
            "user_id, full_name, utd_email"
          )
          .in("user_id", userIds);

        if (profileError) throw profileError;

        profileMap = Object.fromEntries(
          (profileData || []).map(
            (profile) => [
              profile.user_id,
              profile,
            ]
          )
        );
      }

      const memberMap = Object.fromEntries(
        memberList
          .filter((member) => member.user_id)
          .map((member) => [
            member.user_id,
            {
              ...member,
              profile:
                profileMap[member.user_id] ||
                null,
            },
          ])
      );

      const enrichedMembers = memberList.map(
        (member) => ({
          ...member,
          profile: member.user_id
            ? profileMap[member.user_id] ||
              null
            : null,
        })
      );

      setMembers(enrichedMembers);

      /*
       * ----------------------------------------------------------
       * SUBMISSIONS
       * ----------------------------------------------------------
       */

      const enrichedSubmissions = (
        submissionData || []
      )
        .filter((submission) => {
          if (!semesterData) return true;

          return (
            submission.semester_id ===
            semesterData.id
          );
        })
        .map((submission) => ({
          ...submission,
          member:
            memberMap[submission.user_id] ||
            null,
        }));

      setSubmissions(enrichedSubmissions);
    } catch (loadError) {
      console.error(
        "Unable to load Study Hours:",
        loadError
      );

      setError(
        loadError.message ||
          "Unable to load Study Hours."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStudyHours();
  }, []);

  /*
   * ----------------------------------------------------------
   * BROTHER ASSIGNMENTS
   * ----------------------------------------------------------
   */

  function getBrotherAssignment(userId) {
    return requiredBrothers.find(
      (assignment) =>
        assignment.user_id === userId
    );
  }

  function isBrotherRequired(userId) {
    return Boolean(
      getBrotherAssignment(userId)
    );
  }

  async function toggleBrotherRequirement(
    brother
  ) {
    if (
      !currentMember?.id ||
      !brother?.user_id
    ) {
      return;
    }

    setSavingBrother(brother.user_id);
    setError("");
    setSuccess("");

    try {
      const assignment =
        getBrotherAssignment(
          brother.user_id
        );

      if (assignment) {
        /*
         * Remove the brother's requirement.
         *
         * The assignment table does not have an
         * active column, so the row is deleted.
         */
        const { error: deleteError } =
          await supabase
            .from(
              "portal_study_hour_assignments"
            )
            .delete()
            .eq(
              "user_id",
              brother.user_id
            );

        if (deleteError) throw deleteError;

        setSuccess(
          "Brother removed from the weekly Study Hours requirement."
        );
      } else {
        /*
         * Add a brother with the default
         * 2-hour weekly requirement.
         */
        const { error: insertError } =
          await supabase
            .from(
              "portal_study_hour_assignments"
            )
            .insert({
              user_id: brother.user_id,
              hours_per_week: 2,
              assigned_by:
                currentMember.id,
              assigned_at:
                new Date().toISOString(),
            });

        if (insertError) throw insertError;

        setSuccess(
          "Brother added to the weekly Study Hours requirement."
        );
      }

      await loadStudyHours();
    } catch (updateError) {
      console.error(
        "Unable to update Study Hours requirement:",
        updateError
      );

      setError(
        updateError.message ||
          "Unable to update the Study Hours requirement."
      );
    } finally {
      setSavingBrother(null);
    }
  }

  /*
   * ----------------------------------------------------------
   * APPROVE SUBMISSION
   * ----------------------------------------------------------
   */

  async function approveSubmission() {
    if (
      !selectedSubmission ||
      !currentMember
    ) {
      return;
    }

    const parsedHours = Number(hoursAwarded);

    if (
      !hoursAwarded ||
      Number.isNaN(parsedHours) ||
      parsedHours <= 0
    ) {
      setError(
        "Enter a valid number of hours to award."
      );
      return;
    }

    setReviewingId(
      selectedSubmission.id
    );
    setError("");
    setSuccess("");

    try {
      const { error: updateError } =
        await supabase
          .from(
            "portal_study_hour_submissions"
          )
          .update({
            status: "approved",
            hours_awarded: parsedHours,
            reviewed_by: currentMember.id,
            reviewed_at:
              new Date().toISOString(),
            rejection_reason: null,
            updated_at:
              new Date().toISOString(),
          })
          .eq(
            "id",
            selectedSubmission.id
          );

      if (updateError) throw updateError;

      setSuccess(
        "Study Hours submission approved."
      );

      setSelectedSubmission(null);
      setHoursAwarded("");

      await loadStudyHours();
    } catch (updateError) {
      console.error(
        "Unable to approve Study Hours:",
        updateError
      );

      setError(
        updateError.message ||
          "Unable to approve Study Hours."
      );
    } finally {
      setReviewingId(null);
    }
  }

  /*
   * ----------------------------------------------------------
   * REJECT SUBMISSION
   * ----------------------------------------------------------
   */

  async function rejectSubmission() {
    if (
      !selectedSubmission ||
      !currentMember
    ) {
      return;
    }

    if (!rejectionReason.trim()) {
      setError(
        "Please provide a reason for rejecting this submission."
      );
      return;
    }

    setReviewingId(
      selectedSubmission.id
    );
    setError("");
    setSuccess("");

    try {
      const { error: updateError } =
        await supabase
          .from(
            "portal_study_hour_submissions"
          )
          .update({
            status: "rejected",
            hours_awarded: null,
            reviewed_by: currentMember.id,
            reviewed_at:
              new Date().toISOString(),
            rejection_reason:
              rejectionReason.trim(),
            updated_at:
              new Date().toISOString(),
          })
          .eq(
            "id",
            selectedSubmission.id
          );

      if (updateError) throw updateError;

      setSuccess(
        "Study Hours submission rejected."
      );

      setSelectedSubmission(null);
      setRejectionReason("");

      await loadStudyHours();
    } catch (updateError) {
      console.error(
        "Unable to reject Study Hours:",
        updateError
      );

      setError(
        updateError.message ||
          "Unable to reject Study Hours."
      );
    } finally {
      setReviewingId(null);
    }
  }

  /*
   * ----------------------------------------------------------
   * FILTERS
   * ----------------------------------------------------------
   */

  const filteredSubmissions =
    submissions.filter(
      (submission) => {
        if (
          statusFilter !== "all" &&
          submission.status !==
            statusFilter
        ) {
          return false;
        }

        if (
          roleFilter !== "all" &&
          submission.member?.role !==
            roleFilter
        ) {
          return false;
        }

        return true;
      }
    );

  const pendingCount =
    submissions.filter(
      (submission) =>
        submission.status === "pending"
    ).length;

  const approvedCount =
    submissions.filter(
      (submission) =>
        submission.status === "approved"
    ).length;

  const rejectedCount =
    submissions.filter(
      (submission) =>
        submission.status === "rejected"
    ).length;

  /*
   * ----------------------------------------------------------
   * CURRENT WEEK MEMBER PROGRESS
   * ----------------------------------------------------------
   *
   * Monday 12:00 AM through Sunday 11:59 PM.
   *
   * Pledges:
   *   3 hours/week.
   *
   * Assigned brothers:
   *   hours_per_week from assignment row.
   *
   * Unassigned brothers:
   *   No requirement and are excluded from this table.
   */

  const startOfWeek =
    getStartOfCurrentWeek();

  const endOfWeek =
    getEndOfCurrentWeek();

  const memberProgress = members
    .map((member) => {
      let requiredHours = 0;

      if (member.role === "pledge") {
        requiredHours = Number(
          requirements.pledge || 3
        );
      } else if (
        member.role === "brother" &&
        member.user_id
      ) {
        const assignment =
          getBrotherAssignment(
            member.user_id
          );

        if (assignment) {
          requiredHours = Number(
            assignment.hours_per_week || 2
          );
        }
      }

      /*
       * Unassigned brothers do not have a
       * weekly requirement.
       */
      if (requiredHours <= 0) {
        return null;
      }

      const memberSubmissions =
        submissions.filter(
          (submission) =>
            submission.user_id ===
            member.user_id
        );

      const approvedHours =
        memberSubmissions.reduce(
          (total, submission) => {
            if (
              submission.status !==
              "approved"
            ) {
              return total;
            }

            const eventStartTime =
              submission.portal_events
                ?.start_time;

            if (!eventStartTime) {
              return total;
            }

            const eventDate =
              new Date(eventStartTime);

            if (
              eventDate < startOfWeek ||
              eventDate > endOfWeek
            ) {
              return total;
            }

            return (
              total +
              Number(
                submission.hours_awarded ||
                  0
              )
            );
          },
          0
        );

      return {
        ...member,
        approvedHours,
        requiredHours,
        remainingHours: Math.max(
          requiredHours -
            approvedHours,
          0
        ),
        percentage:
          requiredHours > 0
            ? Math.min(
                (approvedHours /
                  requiredHours) *
                  100,
                100
              )
            : 0,
      };
    })
    .filter(Boolean)
    .filter((member) => {
      if (
        progressRoleFilter !== "all" &&
        member.role !== progressRoleFilter
      ) {
        return false;
      }

      const search =
        progressSearch.trim().toLowerCase();

      if (!search) {
        return true;
      }

      const name =
        getMemberDisplayName(member).toLowerCase();

      const email =
        (member.email || "").toLowerCase();

      return (
        name.includes(search) ||
        email.includes(search)
      );
    })
    .sort((a, b) => {
      const nameA = getMemberDisplayName(a);
      const nameB = getMemberDisplayName(b);

      return nameA.localeCompare(nameB);
    });

  /*
   * ----------------------------------------------------------
   * BROTHERS THAT CAN BE ASSIGNED
   * ----------------------------------------------------------
   */

  const selectableBrothers = members
    .filter(
      (member) =>
        member.role === "brother" &&
        member.status === "active" &&
        member.user_id
    )
    .filter((member) => {
      const search = brotherSearch.trim().toLowerCase();

      if (!search) return true;

      const name = getMemberDisplayName(member).toLowerCase();
      const email = (member.email || "").toLowerCase();

      return (
        name.includes(search) ||
        email.includes(search)
      );
    })
    .sort((a, b) =>
      getMemberDisplayName(a).localeCompare(
        getMemberDisplayName(b)
      )
    );

  if (loading) {
    return (
      <div className="py-10">
        <p className="text-sm text-gray-600">
          Loading Study Hours...
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-8">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      {/* =====================================================
          OVERVIEW
          ===================================================== */}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Pending
          </p>

          <p className="mt-2 text-3xl font-bold text-gray-950">
            {pendingCount}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Approved
          </p>

          <p className="mt-2 text-3xl font-bold text-gray-950">
            {approvedCount}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Rejected
          </p>

          <p className="mt-2 text-3xl font-bold text-gray-950">
            {rejectedCount}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Required Brothers
          </p>

          <p className="mt-2 text-3xl font-bold text-gray-950">
            {requiredBrothers.length}
          </p>
        </div>
      </section>

      {/* =====================================================
          STUDY HOURS REQUIREMENTS
          ===================================================== */}

      <section>
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-gray-950">
            Study Hours Requirements
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            All pledges are required to complete{" "}
            {Number(
              requirements.pledge || 3
            ).toFixed(0)}{" "}
            Study Hours each week. Select the brothers
            who are required to complete 2 Study Hours
            each week.
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-950">
                Required Brothers
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Selected brothers will have a 2-hour
                weekly requirement.
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 px-4 py-2 text-sm text-gray-700">
              <span className="font-semibold text-gray-950">
                {requiredBrothers.length}
              </span>{" "}
              selected
            </div>
          </div>

          <div className="mb-5">
            <input
              type="text"
              value={brotherSearch}
              onChange={(event) =>
                setBrotherSearch(
                  event.target.value
                )
              }
              placeholder="Search brothers by name or email..."
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-primary"
            />
          </div>

          {selectableBrothers.length === 0 ? (
            <p className="text-sm text-gray-600">
              {brotherSearch.trim()
                ? "No brothers match your search."
                : "No active brothers with linked accounts found."}
            </p>
          ) : (
            <div className="space-y-3">
              {selectableBrothers.map(
                (brother) => {
                  const assignment =
                    getBrotherAssignment(
                      brother.user_id
                    );

                  const required =
                    Boolean(assignment);

                  const hoursPerWeek =
                    Number(
                      assignment
                        ?.hours_per_week || 2
                    );

                  return (
                    <div
                      key={brother.user_id}
                      className="flex flex-col gap-4 rounded-lg border border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="font-medium text-gray-950">
                          {getMemberDisplayName(
                            brother
                          )}
                        </p>

                        {brother.email && (
                          <p className="mt-1 text-xs text-gray-500">
                            {brother.email}
                          </p>
                        )}

                        {required && (
                          <p className="mt-1 text-xs font-medium text-primary">
                            {hoursPerWeek}{" "}
                            hours/week required
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          toggleBrotherRequirement(
                            brother
                          )
                        }
                        disabled={
                          savingBrother ===
                          brother.user_id
                        }
                        className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                          required
                            ? "bg-primary text-white hover:opacity-90"
                            : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                        } disabled:cursor-not-allowed disabled:opacity-50`}
                      >
                        {savingBrother ===
                        brother.user_id
                          ? "Saving..."
                          : required
                            ? "Remove Requirement"
                            : "Make Required"}
                      </button>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </div>
      </section>

      {/* =====================================================
          WEEKLY MEMBER PROGRESS
          ===================================================== */}

      <section>
        <div className="mb-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-950">
                Weekly Progress
              </h2>

              <p className="mt-2 text-sm text-gray-600">
                Current Study Hours progress for Monday
                through Sunday.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                value={progressSearch}
                onChange={(event) =>
                  setProgressSearch(event.target.value)
                }
                placeholder="Search members by name or email..."
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-primary sm:w-72"
              />

              <select
                value={progressRoleFilter}
                onChange={(event) =>
                  setProgressRoleFilter(event.target.value)
                }
                className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700"
              >
                <option value="all">All roles</option>
                <option value="brother">Brothers</option>
                <option value="pledge">Pledges</option>
              </select>
            </div>
          </div>
        </div>

        {memberProgress.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-600">
              {progressSearch.trim() ||
              progressRoleFilter !== "all"
                ? "No members match the selected search or role filter."
                : "No members are currently required to complete Study Hours."}
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Member
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Role
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Requirement
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Progress
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Remaining
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {memberProgress.map(
                    (member) => (
                      <tr key={member.id}>
                        <td className="px-5 py-4">
                          <p className="font-medium text-gray-950">
                            {getMemberDisplayName(
                              member
                            )}
                          </p>

                          {member.email && (
                            <p className="mt-1 text-xs text-gray-500">
                              {member.email}
                            </p>
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold capitalize text-gray-700">
                            {member.role}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-sm text-gray-700">
                          {member.requiredHours.toFixed(
                            2
                          )}{" "}
                          hrs/week
                        </td>

                        <td className="px-5 py-4">
                          <div className="min-w-[180px]">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium text-gray-900">
                                {member.approvedHours.toFixed(
                                  2
                                )}{" "}
                                /{" "}
                                {member.requiredHours.toFixed(
                                  2
                                )}
                              </span>

                              <span className="text-gray-500">
                                {Math.round(
                                  member.percentage
                                )}
                                %
                              </span>
                            </div>

                            <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                              <div
                                className="h-full rounded-full bg-primary transition-all"
                                style={{
                                  width: `${member.percentage}%`,
                                }}
                              />
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-sm text-gray-700">
                          {member.remainingHours >
                          0
                            ? `${member.remainingHours.toFixed(
                                2
                              )} hours`
                            : "Complete"}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* =====================================================
          SUBMISSIONS
          ===================================================== */}

      <section>
        <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-950">
              Submissions
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Review Study Hour photo submissions for
              the active semester.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value
                )
              }
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700"
            >
              <option value="all">
                All statuses
              </option>

              <option value="pending">
                Pending
              </option>

              <option value="approved">
                Approved
              </option>

              <option value="rejected">
                Rejected
              </option>
            </select>

          </div>
        </div>

        {filteredSubmissions.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-600">
              No Study Hours submissions match the
              selected filters.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSubmissions.map(
              (submission) => {
                const member =
                  submission.member;

                const profile =
                  member?.profile;

                const event =
                  submission.portal_events;

                return (
                  <article
                    key={submission.id}
                    className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-lg font-semibold text-gray-950">
                            {getMemberDisplayName(
                              member
                            )}
                          </h3>

                          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold capitalize text-gray-700">
                            {member?.role ||
                              "Unknown role"}
                          </span>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClasses(
                              submission.status
                            )}`}
                          >
                            {
                              submission.status
                            }
                          </span>
                        </div>

                        <p className="mt-2 text-sm font-medium text-gray-800">
                          {event?.title ||
                            "Study Hours Event"}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          {formatDateTime(
                            event?.start_time
                          )}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          Submitted{" "}
                          {formatDateTime(
                            submission.submitted_at
                          )}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <a
                          href={
                            submission.start_photo_url
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                        >
                          View Start Photo
                        </a>

                        {submission.end_photo_url && (
                          <a
                            href={
                              submission.end_photo_url
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                          >
                            View End Photo
                          </a>
                        )}

                        {submission.status ===
                          "pending" && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedSubmission(
                                submission
                              );
                              setHoursAwarded(
                                ""
                              );
                              setRejectionReason(
                                ""
                              );
                              setError("");
                              setSuccess("");
                            }}
                            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                          >
                            Review
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="mt-5 grid gap-4 border-t border-gray-100 pt-5 sm:grid-cols-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Hours Awarded
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-900">
                          {submission.status ===
                          "approved"
                            ? `${Number(
                                submission.hours_awarded ||
                                  0
                              ).toFixed(
                                2
                              )} hours`
                            : "—"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Reviewed
                        </p>

                        <p className="mt-1 text-sm text-gray-700">
                          {submission.reviewed_at
                            ? formatDateTime(
                                submission.reviewed_at
                              )
                            : "Not reviewed"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Rejection Reason
                        </p>

                        <p className="mt-1 text-sm text-red-700">
                          {submission.rejection_reason ||
                            "—"}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              }
            )}
          </div>
        )}
      </section>

      {/* =====================================================
          REVIEW MODAL
          ===================================================== */}

      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-950">
                  Review Study Hours
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                  {getMemberDisplayName(
                    selectedSubmission.member
                  )}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (reviewingId) return;

                  setSelectedSubmission(
                    null
                  );
                  setHoursAwarded("");
                  setRejectionReason("");
                }}
                disabled={Boolean(
                  reviewingId
                )}
                className="text-2xl leading-none text-gray-400 hover:text-gray-700 disabled:opacity-50"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="mt-6 space-y-6">
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm font-semibold text-gray-900">
                  {
                    selectedSubmission
                      .portal_events?.title
                  }
                </p>

                <p className="mt-1 text-sm text-gray-600">
                  {formatDateTime(
                    selectedSubmission
                      .portal_events
                      ?.start_time
                  )}
                </p>

                {selectedSubmission
                  .portal_events
                  ?.location && (
                  <p className="mt-1 text-sm text-gray-600">
                    {
                      selectedSubmission
                        .portal_events
                        .location
                    }
                  </p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <a
                  href={
                    selectedSubmission.start_photo_url
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-gray-200 p-4 transition hover:bg-gray-50"
                >
                  <p className="text-sm font-semibold text-gray-950">
                    Start Photo
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Open uploaded photo
                  </p>
                </a>

                {selectedSubmission.end_photo_url && (
                  <a
                    href={
                      selectedSubmission.end_photo_url
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl border border-gray-200 p-4 transition hover:bg-gray-50"
                  >
                    <p className="text-sm font-semibold text-gray-950">
                      End Photo
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Open uploaded photo
                    </p>
                  </a>
                )}
              </div>

              <div>
                <label
                  htmlFor="hours-awarded"
                  className="block text-sm font-semibold text-gray-900"
                >
                  Hours Awarded
                </label>

                <input
                  id="hours-awarded"
                  type="number"
                  min="0"
                  step="0.25"
                  value={hoursAwarded}
                  onChange={(event) =>
                    setHoursAwarded(
                      event.target.value
                    )
                  }
                  placeholder="Example: 2"
                  className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-primary"
                />

                <p className="mt-2 text-xs text-gray-500">
                  Enter the number of Study Hours
                  supported by the photo evidence.
                </p>
              </div>

              <div>
                <label
                  htmlFor="rejection-reason"
                  className="block text-sm font-semibold text-gray-900"
                >
                  Rejection Reason
                </label>

                <textarea
                  id="rejection-reason"
                  rows={3}
                  value={rejectionReason}
                  onChange={(event) =>
                    setRejectionReason(
                      event.target.value
                    )
                  }
                  placeholder="Required when rejecting a submission."
                  className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-primary"
                />
              </div>

              {error && (
                <p
                  role="alert"
                  className="text-sm text-red-600"
                >
                  {error}
                </p>
              )}

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={rejectSubmission}
                  disabled={
                    Boolean(reviewingId) ||
                    !rejectionReason.trim()
                  }
                  className="rounded-lg border border-red-300 px-5 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {reviewingId ===
                  selectedSubmission.id
                    ? "Processing..."
                    : "Reject"}
                </button>

                <button
                  type="button"
                  onClick={approveSubmission}
                  disabled={
                    Boolean(reviewingId) ||
                    !hoursAwarded
                  }
                  className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {reviewingId ===
                  selectedSubmission.id
                    ? "Processing..."
                    : "Approve"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}