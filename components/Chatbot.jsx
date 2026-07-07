"use client";

import { useState, useRef, useEffect } from "react";
import { FaCommentDots, FaTimes, FaPaperPlane } from "react-icons/fa";
import { trackEvent } from "../lib/analytics";

const INITIAL_MESSAGE = {
  role: "assistant",
  text: "Hi! I'm the KTP assistant. Ask me about recruitment, our chapter, or how to get involved!",
};

const QUICK_QUESTIONS = [
  "When is recruitment?",
  "What events are coming up?",
  "What are the five pillars?",
  "Do I need to be a CS major?",
  "How do I join?",
];

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [lift, setLift] = useState(0);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  // Lift the widget above the footer when it scrolls into view so it never
  // covers the footer's social links.
  useEffect(() => {
    if (typeof document === "undefined") return;
    const footer = document.querySelector("footer");
    if (!footer) return;

    let raf = null;
    const update = () => {
      raf = null;
      const rect = footer.getBoundingClientRect();
      const overlap = window.innerHeight - rect.top;
      setLift(overlap > 0 ? Math.round(overlap) + 16 : 0);
    };
    const onScroll = () => {
      if (raf == null) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf != null) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const toggleOpen = () => {
    setOpen((o) => {
      if (!o) trackEvent("chatbot_open");
      return !o;
    });
  };

  const send = async (preset) => {
    const text = (typeof preset === "string" ? preset : input).trim();
    if (!text || loading) return;

    trackEvent("chatbot_message");
    const next = [...messages, { role: "user", text }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text:
            data.reply ||
            "Sorry, please try again, or email kappathetapiutd@gmail.com.",
        },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text:
            "Sorry, I couldn't connect. Please email kappathetapiutd@gmail.com.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={toggleOpen}
        aria-label={open ? "Close chat assistant" : "Open chat assistant"}
        aria-expanded={open}
        style={{ transform: lift && !open ? `translateY(-${lift}px)` : undefined }}
        className="fixed bottom-5 right-5 z-[60] bg-primary text-white rounded-full p-4 shadow-lg hover:scale-110 transition-transform"
      >
        {open ? <FaTimes size={22} /> : <FaCommentDots size={22} />}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="KTP chat assistant"
          className="fixed bottom-24 right-5 z-[60] flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl w-[calc(100vw-2.5rem)] sm:w-96 h-[70vh] sm:h-[30rem]"
        >
          <div className="flex items-center justify-between bg-primary px-4 py-3 font-poppins font-semibold text-white">
            <span>KTP Assistant</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="transition-opacity hover:opacity-80"
            >
              <FaTimes size={18} />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-gray-50 p-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm ${
                    m.role === "user"
                      ? "rounded-br-sm bg-primary text-white"
                      : "rounded-bl-sm border border-gray-200 bg-white text-black"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-sm border border-gray-200 bg-white px-3 py-2 text-sm text-gray-500">
                  Typing…
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="border-t border-gray-200 bg-white">
            {messages.length === 1 && !loading && (
              <div className="flex flex-wrap gap-2 px-3 pt-3">
                {QUICK_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => send(q)}
                    className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs text-primary hover:bg-primary/10 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
            <div className="flex items-center gap-2 p-3">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Ask about KTP…"
                aria-label="Type your message"
                className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="button"
                onClick={() => send()}
                disabled={loading || !input.trim()}
                aria-label="Send message"
                className="rounded-full bg-primary p-2.5 text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                <FaPaperPlane size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
