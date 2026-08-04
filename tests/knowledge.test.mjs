import assert from "node:assert/strict";
import test from "node:test";

import {
  buildKnowledgeContext,
  rankKnowledgeRows,
} from "../lib/knowledge.js";

const rows = [
  {
    title: "General chapter overview",
    content: "KTP supports professional and technical growth.",
  },
  {
    title: "Recruitment eligibility",
    content: "Students from every major may apply during recruitment.",
  },
  {
    title: "Event attendance",
    content: "Recruitment events are announced on the chapter calendar.",
  },
];

test("exact title phrases outrank content-only matches", () => {
  const ranked = rankKnowledgeRows(rows, "recruitment eligibility");

  assert.equal(ranked[0].row.title, "Recruitment eligibility");
  assert.ok(ranked[0].score > ranked[1].score);
});

test("context stays within its character budget", () => {
  const result = buildKnowledgeContext(rows, "recruitment", 110);
  const body = result.context.replace(
    /^KTP knowledge base.*:\n/,
    ""
  );

  assert.ok(body.length <= 110);
  assert.match(result.context, /Recruitment eligibility/);
});

test("long rows include a query-centered excerpt", () => {
  const content = `${"Unrelated preface. ".repeat(400)}Recruitment eligibility allows every major to apply.`;
  const result = buildKnowledgeContext(
    [{ title: "Constitution article", content }],
    "recruitment eligibility",
    240
  );

  assert.match(result.context, /Recruitment eligibility/i);
  assert.deepEqual(result.sources, ["Constitution article"]);
});

test("exact phrases beat earlier single-keyword matches", () => {
  const content = [
    "Recruitment updates are posted each semester.",
    "Unrelated policy details. ".repeat(350),
    "Recruitment eligibility allows every major to apply.",
  ].join(" ");
  const result = buildKnowledgeContext(
    [{ title: "Constitution article", content }],
    "recruitment eligibility",
    240
  );

  assert.match(result.context, /Recruitment eligibility allows every major/i);
});

test("source labels include only relevant selected rows", () => {
  const result = buildKnowledgeContext(rows, "who can apply during recruitment");

  assert.deepEqual(result.sources.slice(0, 1), ["Recruitment eligibility"]);
  assert.ok(!result.sources.includes("General chapter overview"));
});

test("empty inputs return no context or sources", () => {
  assert.deepEqual(buildKnowledgeContext([], "recruitment"), {
    context: "",
    sources: [],
  });
});
