const CURRENT_LEADERSHIP_PATTERNS = [
  /\bwho\s+(?:is|are)\s+(?:the\s+)?(?:current\s+)?(?:president|vice president|vp|treasurer|secretary|technology chair|tech chair|director|officers?|leadership|executive board|director board)\b/i,
  /\bcurrent(?:ly)?\s+(?:president|vice president|vp|treasurer|secretary|technology chair|tech chair|director|officers?|leadership|executive board|director board)\b/i,
  /\b(?:president|vice president|vp|treasurer|secretary|technology chair|tech chair|director)\b.*\b(?:currently|right now)\b/i,
];

const UPCOMING_EVENT_PATTERNS = [
  /\b(?:what|which)\s+(?:events?|recruitment events?)\s+(?:are\s+)?(?:upcoming|coming|scheduled)\b/i,
  /\bwhen\s+(?:is|are)\s+(?:the\s+)?(?:next\s+|upcoming\s+)?(?:event|recruitment|rush)\b/i,
  /\b(?:upcoming|next|scheduled)\s+(?:events?|recruitment|rush)\b/i,
  /\b(?:events?|recruitment|rush)\b.*\b(?:today|tomorrow|this week|next week)\b/i,
];

export function isCurrentLeadershipQuestion(question = "") {
  return CURRENT_LEADERSHIP_PATTERNS.some((pattern) =>
    pattern.test(question)
  );
}

export function isUpcomingEventQuestion(question = "") {
  return UPCOMING_EVENT_PATTERNS.some((pattern) => pattern.test(question));
}

export function getContextSourceLabels(
  question,
  { hasEvents = false, knowledgeSources = [] } = {}
) {
  if (isCurrentLeadershipQuestion(question)) {
    return ["Current leadership roster"];
  }

  const labels = [];
  if (hasEvents && isUpcomingEventQuestion(question)) {
    labels.push("Upcoming events");
  }
  labels.push(...knowledgeSources);

  return [...new Set(labels)].slice(0, 5);
}
