// Submission eligibility is per event, never per week or recurring series.
export function getEligibleStudyEvents(events, submissions, semester, now = new Date()) {
  const submittedEventIds = new Set(submissions.map((submission) => submission.event_id));
  const semesterStart = semester && new Date(`${semester.start_date}T00:00:00`);
  const semesterEnd = semester && new Date(`${semester.end_date}T23:59:59`);

  return events.filter((event) => {
    const eventType = String(event.event_type || "").toLowerCase();
    const eventDate = new Date(event.start_time);
    return ["study hours", "study_hours", "studyhours"].includes(eventType)
      && new Date(event.end_time) <= now
      && !submittedEventIds.has(event.id)
      && (!semester || (eventDate >= semesterStart && eventDate <= semesterEnd));
  });
}

export function getApprovedStudyHours(submissions, startOfWeek, endOfWeek) {
  return submissions.reduce((total, submission) => {
    if (submission.status !== "approved" || !submission.portal_events?.start_time) return total;
    const eventDate = new Date(submission.portal_events.start_time);
    if (!(eventDate >= startOfWeek && eventDate <= endOfWeek)) return total;
    return total + Number(submission.hours_awarded || 0);
  }, 0);
}
