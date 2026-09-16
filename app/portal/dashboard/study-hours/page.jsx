"use client";

import { useEffect, useMemo, useState } from "react";
import PhotoUpload from "../../../../components/portal/PhotoUpload";
import { getPortalBrowserClient } from "../../../../lib/portal/client";

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

  // Sunday = 0, Monday = 1, ..., Saturday = 6
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

export default function StudyHoursPage() {
  const supabase = useMemo(() => getPortalBrowserClient(), []);

  const [user, setUser] = useState(null);
  const [semester, setSemester] = useState(null);
  const [memberRole, setMemberRole] = useState(null);

  // Pledges are always required.
  // Brothers are only required when assigned by an admin.
  const [studyHoursRequired, setStudyHoursRequired] = useState(false);
  const [weeklyRequirement, setWeeklyRequirement] = useState(0);

  const [submissions, setSubmissions] = useState([]);
  const [eligibleEvents, setEligibleEvents] = useState([]);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [startPhotoUrl, setStartPhotoUrl] = useState("");
  const [endPhotoUrl, setEndPhotoUrl] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadStudyHours() {
    setLoading(true);
    setError("");

    try {
      const {
        data: { user: authenticatedUser },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;

      if (!authenticatedUser) {
        setError("You must be signed in to view Study Hours.");
        return;
      }

      setUser(authenticatedUser);

      const [
        { data: semesterData, error: semesterError },
        { data: submissionData, error: submissionError },
        { data: memberData, error: memberError },
      ] = await Promise.all([
        supabase
          .from("portal_semesters")
          .select(
            "id, name, start_date, end_date, required_hours, is_active"
          )
          .eq("is_active", true)
          .maybeSingle(),

        supabase
          .from("portal_study_hour_submissions")
          .select(`
            id,
            event_id,
            semester_id,
            start_photo_url,
            end_photo_url,
            status,
            hours_awarded,
            rejection_reason,
            submitted_at,
            reviewed_at,
            portal_events (
              title,
              start_time,
              end_time,
              location,
              event_type
            )
          `)
          .eq("user_id", authenticatedUser.id)
          .order("submitted_at", { ascending: false }),

        supabase
          .from("portal_members")
          .select("role, status")
          .eq("user_id", authenticatedUser.id)
          .maybeSingle(),
      ]);

      if (semesterError) throw semesterError;
      if (submissionError) throw submissionError;
      if (memberError) throw memberError;

      setSemester(semesterData);

      const role = memberData?.role || null;
      setMemberRole(role);

      /*
       * ----------------------------------------------------------
       * WEEKLY REQUIREMENT
       * ----------------------------------------------------------
       *
       * Pledges:
       *   Always required to complete 3 hours/week.
       *
       * Brothers:
       *   Only required if an admin has assigned them.
       *
       * Everyone else:
       *   No Study Hours requirement.
       */

      if (role === "pledge") {
        const {
          data: requirementData,
          error: requirementError,
        } = await supabase
          .from("portal_study_hour_requirements")
          .select("hours_per_week")
          .eq("role", "pledge")
          .maybeSingle();

        if (requirementError) throw requirementError;

        setWeeklyRequirement(
          Number(requirementData?.hours_per_week || 3)
        );

        setStudyHoursRequired(true);
      } else if (role === "brother") {
        const {
          data: assignmentData,
          error: assignmentError,
        } = await supabase
          .from("portal_study_hour_assignments")
          .select("id, hours_per_week")
          .eq("user_id", authenticatedUser.id)
          .maybeSingle();

        if (assignmentError) throw assignmentError;

        const assigned = Boolean(assignmentData);

        setStudyHoursRequired(assigned);

        if (assigned) {
          setWeeklyRequirement(
            Number(assignmentData.hours_per_week || 2)
          );
        } else {
          setWeeklyRequirement(0);
        }
      } else {
        setStudyHoursRequired(false);
        setWeeklyRequirement(0);
      }

      setSubmissions(submissionData || []);

      /*
       * ----------------------------------------------------------
       * ELIGIBLE STUDY HOURS EVENTS
       * ----------------------------------------------------------
       *
       * RSVP IS NOT REQUIRED.
       *
       * Any Study Hours event that:
       *   1. Has ended
       *   2. Falls within the active semester
       *   3. Has not already been submitted for
       *
       * can be submitted.
       */

      const submittedEventIds = new Set(
        (submissionData || []).map(
          (submission) => submission.event_id
        )
      );

      const now = new Date();

      const {
        data: eventData,
        error: eventError,
      } = await supabase
        .from("portal_events")
        .select(`
          id,
          title,
          description,
          location,
          start_time,
          end_time,
          event_type
        `)
        .order("start_time", { ascending: false });

      if (eventError) throw eventError;

      const events = (eventData || [])
        .filter((event) => new Date(event.end_time) <= now)
        .filter((event) => !submittedEventIds.has(event.id))
        .filter((event) => {
          if (!semesterData) return true;

          const eventDate = new Date(event.start_time);

          const semesterStart = new Date(
            `${semesterData.start_date}T00:00:00`
          );

          const semesterEnd = new Date(
            `${semesterData.end_date}T23:59:59`
          );

          return (
            eventDate >= semesterStart &&
            eventDate <= semesterEnd
          );
        })
        .filter((event) => {
          /*
           * Only Study Hours events should appear here.
           *
           * This checks the event_type without requiring
           * an RSVP.
           */
          const eventType = String(
            event.event_type || ""
          ).toLowerCase();

          return (
            eventType === "study hours" ||
            eventType === "study_hours" ||
            eventType === "studyhours"
          );
        });

      setEligibleEvents(events);
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

  function openSubmission(event) {
    setSelectedEvent(event);
    setStartPhotoUrl("");
    setEndPhotoUrl("");
    setError("");
    setSuccess("");
  }

  function closeSubmission() {
    if (submitting) return;

    setSelectedEvent(null);
    setStartPhotoUrl("");
    setEndPhotoUrl("");
    setError("");
  }

  async function submitStudyHours() {
    if (!user || !semester || !selectedEvent) return;

    if (!startPhotoUrl || !endPhotoUrl) {
      setError(
        "Upload both a start photo and an end photo."
      );
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const { error: insertError } = await supabase
        .from("portal_study_hour_submissions")
        .insert({
          event_id: selectedEvent.id,
          user_id: user.id,
          semester_id: semester.id,
          start_photo_url: startPhotoUrl,
          end_photo_url: endPhotoUrl,
          status: "pending",
        });

      if (insertError) throw insertError;

      setSuccess(
        "Study Hours submitted successfully."
      );

      setSelectedEvent(null);
      setStartPhotoUrl("");
      setEndPhotoUrl("");

      await loadStudyHours();
    } catch (submitError) {
      console.error(
        "Unable to submit Study Hours:",
        submitError
      );

      setError(
        submitError.message ||
          "Unable to submit Study Hours."
      );
    } finally {
      setSubmitting(false);
    }
  }

  /*
   * ----------------------------------------------------------
   * WEEKLY STUDY HOURS PROGRESS
   * ----------------------------------------------------------
   *
   * Only approved submissions from the current
   * Monday-Sunday week count toward the requirement.
   */

  const startOfWeek = getStartOfCurrentWeek();
  const endOfWeek = getEndOfCurrentWeek();

  const approvedHours = submissions.reduce(
    (total, submission) => {
      if (submission.status !== "approved") {
        return total;
      }

      const eventStartTime =
        submission.portal_events?.start_time;

      if (!eventStartTime) {
        return total;
      }

      const eventDate = new Date(eventStartTime);

      if (
        eventDate < startOfWeek ||
        eventDate > endOfWeek
      ) {
        return total;
      }

      return (
        total +
        Number(submission.hours_awarded || 0)
      );
    },
    0
  );

  const requiredHours = weeklyRequirement;

  const remainingHours = Math.max(
    requiredHours - approvedHours,
    0
  );

  const progressPercentage =
    requiredHours > 0
      ? Math.min(
          (approvedHours / requiredHours) * 100,
          100
        )
      : 0;

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
    <div className="space-y-10">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          Study Hours
        </p>

        <h1 className="mt-2 text-3xl font-bold text-gray-950">
          Study Hours
        </h1>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-700">
          Submit photo evidence for completed Study Hours
          events and track your approved Study Hours for
          the current week.
        </p>
      </div>

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

      {!semester ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-950">
            No active semester
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            There is currently no active semester
            configured for Study Hours.
          </p>
        </section>
      ) : (
        <>
          {/* =====================================================
              WEEKLY REQUIREMENT
              ===================================================== */}

          {studyHoursRequired ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-500">
                    This Week
                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-gray-950">
                    {approvedHours.toFixed(2)} /{" "}
                    {requiredHours.toFixed(2)} hours
                  </h2>

                  <p className="mt-2 text-sm text-gray-600">
                    {remainingHours > 0
                      ? `${remainingHours.toFixed(
                          2
                        )} hours remaining this week`
                      : "Study Hours requirement completed"}
                  </p>
                </div>

                <div className="text-left md:text-right">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Weekly Requirement
                  </p>

                  <p className="mt-1 text-sm text-gray-700">
                    {requiredHours.toFixed(0)} hours / week
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {memberRole === "pledge"
                      ? "Required for all pledges"
                      : "Assigned by an admin"}
                  </p>
                </div>
              </div>

              <div className="mt-6 h-3 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{
                    width: `${progressPercentage}%`,
                  }}
                />
              </div>
            </section>
          ) : (
            <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                Weekly Requirement
              </p>

              <h2 className="mt-2 text-xl font-bold text-gray-950">
                Study Hours are not currently required
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
                You can access Study Hours and view your
                submissions, but you are not currently
                assigned a weekly Study Hours requirement.
              </p>
            </section>
          )}

          {/* =====================================================
              SUBMIT STUDY HOURS
              ===================================================== */}

          <section>
            <div className="mb-5">
              <h2 className="text-2xl font-bold text-gray-950">
                Submit Study Hours
              </h2>

              <p className="mt-2 text-sm text-gray-600">
                Completed Study Hours events will appear
                here after they end. An RSVP is not required.
              </p>
            </div>

            {eligibleEvents.length === 0 ? (
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-gray-600">
                  You do not have any eligible Study Hours
                  events to submit right now.
                </p>
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2">
                {eligibleEvents.map((event) => (
                  <article
                    key={event.id}
                    className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-950">
                          {event.title}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          {formatDateTime(event.start_time)}
                        </p>
                      </div>

                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                        {event.event_type || "Study Hours"}
                      </span>
                    </div>

                    {event.location && (
                      <p className="mt-4 text-sm text-gray-600">
                        {event.location}
                      </p>
                    )}

                    <button
                      type="button"
                      onClick={() => openSubmission(event)}
                      className="mt-5 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                    >
                      Submit Study Hours
                    </button>
                  </article>
                ))}
              </div>
            )}
          </section>

          {/* =====================================================
              SUBMISSION HISTORY
              ===================================================== */}

          <section>
            <div className="mb-5">
              <h2 className="text-2xl font-bold text-gray-950">
                Submission History
              </h2>
            </div>

            {submissions.length === 0 ? (
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-gray-600">
                  You have not submitted any Study Hours
                  yet.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {submissions.map((submission) => {
                  const event = submission.portal_events;

                  return (
                    <article
                      key={submission.id}
                      className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-950">
                            {event?.title ||
                              "Study Hours Event"}
                          </h3>

                          <p className="mt-1 text-sm text-gray-500">
                            Submitted{" "}
                            {formatDateTime(
                              submission.submitted_at
                            )}
                          </p>
                        </div>

                        <span
                          className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClasses(
                            submission.status
                          )}`}
                        >
                          {submission.status}
                        </span>
                      </div>

                      <div className="mt-5 grid gap-4 sm:grid-cols-2">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Hours awarded
                          </p>

                          <p className="mt-1 text-sm font-medium text-gray-900">
                            {submission.status === "approved"
                              ? `${Number(
                                  submission.hours_awarded || 0
                                ).toFixed(2)} hours`
                              : "Pending review"}
                          </p>
                        </div>

                        {submission.rejection_reason && (
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                              Rejection reason
                            </p>

                            <p className="mt-1 text-sm text-red-700">
                              {submission.rejection_reason}
                            </p>
                          </div>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </>
      )}

      {/* =========================================================
          SUBMISSION MODAL
          ========================================================= */}

      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-950">
                  Submit Study Hours
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                  {selectedEvent.title}
                </p>
              </div>

              <button
                type="button"
                onClick={closeSubmission}
                disabled={submitting}
                className="text-2xl leading-none text-gray-400 hover:text-gray-700 disabled:opacity-50"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="mt-6 space-y-8">
              <PhotoUpload
                eventId={selectedEvent.id}
                label="Start photo"
                uploadEndpoint="/api/study-hours/upload-signature"
                disabled={submitting}
                onUploadComplete={setStartPhotoUrl}
              />

              <PhotoUpload
                eventId={selectedEvent.id}
                label="End photo"
                uploadEndpoint="/api/study-hours/upload-signature"
                disabled={submitting}
                onUploadComplete={setEndPhotoUrl}
              />

              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm text-gray-700">
                  Both photos are required. Your submission
                  will remain pending until an admin or exec
                  reviews the photo evidence.
                </p>
              </div>

              {error && (
                <p
                  role="alert"
                  className="text-sm text-red-600"
                >
                  {error}
                </p>
              )}

              <button
                type="button"
                onClick={submitStudyHours}
                disabled={
                  submitting ||
                  !startPhotoUrl ||
                  !endPhotoUrl
                }
                className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting
                  ? "Submitting..."
                  : "Submit Study Hours"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}