import assert from "node:assert/strict";
import test from "node:test";

import {
  getContextSourceLabels,
  isCurrentLeadershipQuestion,
  isUpcomingEventQuestion,
} from "../lib/chatSources.js";

test("current officer questions use the leadership roster", () => {
  assert.equal(isCurrentLeadershipQuestion("Who is the VP of Technology?"), true);
  assert.equal(isCurrentLeadershipQuestion("Who can apply during recruitment?"), false);
});

test("upcoming schedule questions use event context", () => {
  assert.equal(isUpcomingEventQuestion("What events are coming up?"), true);
  assert.equal(isUpcomingEventQuestion("When is recruitment?"), true);
  assert.equal(isUpcomingEventQuestion("When was KTP founded?"), false);
});

test("labels are relevant, unique, and bounded", () => {
  assert.deepEqual(
    getContextSourceLabels("Who can apply during recruitment?", {
      hasEvents: true,
      knowledgeSources: [
        "Recruitment eligibility",
        "Recruitment eligibility",
      ],
    }),
    ["Recruitment eligibility"]
  );

  assert.deepEqual(
    getContextSourceLabels("Who is the current president?", {
      hasEvents: true,
      knowledgeSources: ["Leadership policy"],
    }),
    ["Current leadership roster"]
  );
});
