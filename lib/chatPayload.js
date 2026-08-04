const MAX_MESSAGES = 12;
export const MAX_MESSAGE_LENGTH = 1200;
const MAX_ASSISTANT_HISTORY_LENGTH = 2400;
const MAX_CONVERSATION_LENGTH = 6000;

export function getApiChatHistory(messages) {
  return Array.isArray(messages)
    ? messages
        .filter(
          (message) =>
            !message?.localOnly &&
            typeof message?.text === "string" &&
            message.text.trim()
        )
        .map((message) => ({
          role: message.role === "assistant" ? "assistant" : "user",
          text: message.text,
        }))
    : [];
}

export function prepareChatMessages(rawMessages) {
  let messages = Array.isArray(rawMessages)
    ? rawMessages
        .filter(
          (message) =>
            message &&
            typeof message.text === "string" &&
            message.text.trim()
        )
        .slice(-MAX_MESSAGES)
        .map((message) => ({
          role: message.role === "assistant" ? "assistant" : "user",
          text:
            message.role === "assistant" &&
            message.text.trim().length > MAX_ASSISTANT_HISTORY_LENGTH
              ? `${message.text
                  .trim()
                  .slice(0, MAX_ASSISTANT_HISTORY_LENGTH - 3)}...`
              : message.text.trim(),
        }))
    : [];

  if (messages.length === 0) {
    return { error: "No messages provided.", messages: [], question: "" };
  }

  const lastUser = [...messages]
    .reverse()
    .find((message) => message.role !== "assistant");
  const question = lastUser?.text || "";
  if (!question) {
    return {
      error: "No user question provided.",
      messages: [],
      question: "",
    };
  }

  if (
    messages.some(
      (message) =>
        message.role === "user" &&
        message.text.length > MAX_MESSAGE_LENGTH
    )
  ) {
    return {
      error: `Please keep each message under ${MAX_MESSAGE_LENGTH.toLocaleString()} characters.`,
      messages: [],
      question: "",
    };
  }

  for (let index = 1; index < messages.length; index += 1) {
    if (messages[index - 1].role === messages[index].role) {
      return {
        error: "Conversation messages must alternate between user and assistant.",
        messages: [],
        question: "",
      };
    }
  }

  let conversationLength = messages.reduce(
    (total, message) => total + message.text.length,
    0
  );
  while (
    conversationLength > MAX_CONVERSATION_LENGTH &&
    messages.length > 1
  ) {
    conversationLength -= messages[0].text.length;
    messages = messages.slice(1);
  }

  if (conversationLength > MAX_CONVERSATION_LENGTH) {
    return {
      error:
        "This conversation is too long. Please start a new chat and ask a shorter question.",
      messages: [],
      question: "",
    };
  }

  return { error: "", messages, question };
}
