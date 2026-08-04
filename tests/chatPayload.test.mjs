import assert from "node:assert/strict";
import test from "node:test";

import {
  getApiChatHistory,
  prepareChatMessages,
} from "../lib/chatPayload.js";

test("trims messages before enforcing limits and forwarding", () => {
  const result = prepareChatMessages([
    { role: "user", text: `ok${" ".repeat(5000)}` },
  ]);

  assert.equal(result.error, "");
  assert.equal(result.question, "ok");
  assert.deepEqual(result.messages, [{ role: "user", text: "ok" }]);
});

test("rejects an oversized prior retained turn", () => {
  const result = prepareChatMessages([
    { role: "user", text: "x".repeat(1201) },
    { role: "assistant", text: "Understood." },
    { role: "user", text: "Short follow-up" },
  ]);

  assert.match(result.error, /each message under/i);
  assert.deepEqual(result.messages, []);
});

test("prunes old retained turns to fit the aggregate limit", () => {
  const result = prepareChatMessages(
    Array.from({ length: 6 }, (_, index) => ({
      role: index % 2 === 0 ? "user" : "assistant",
      text: "x".repeat(1100),
    }))
  );

  assert.equal(result.error, "");
  assert.ok(result.messages.length < 6);
  assert.equal(result.question, "x".repeat(1100));
});

test("keeps only the twelve most recent normalized turns", () => {
  const result = prepareChatMessages(
    Array.from({ length: 14 }, (_, index) => ({
      role: index % 2 === 0 ? "assistant" : "user",
      text: ` message ${index} `,
    }))
  );

  assert.equal(result.error, "");
  assert.equal(result.messages.length, 12);
  assert.equal(result.messages[0].text, "message 2");
  assert.equal(result.question, "message 13");
});

test("truncates long assistant replies without blocking a new question", () => {
  const result = prepareChatMessages([
    { role: "assistant", text: "a".repeat(4000) },
    { role: "user", text: "Short follow-up" },
  ]);

  assert.equal(result.error, "");
  assert.equal(result.messages[0].text.length, 2400);
  assert.equal(result.question, "Short follow-up");
});

test("rejects malformed consecutive roles", () => {
  const result = prepareChatMessages([
    { role: "assistant", text: "First response" },
    { role: "assistant", text: "Second response" },
    { role: "user", text: "Question" },
  ]);

  assert.match(result.error, /must alternate/i);
});

test("local UI errors never enter API history", () => {
  assert.deepEqual(
    getApiChatHistory([
      { role: "assistant", text: "Welcome" },
      {
        role: "assistant",
        text: "Please shorten the message.",
        localOnly: true,
      },
      { role: "user", text: "Short question" },
    ]),
    [
      { role: "assistant", text: "Welcome" },
      { role: "user", text: "Short question" },
    ]
  );
});
