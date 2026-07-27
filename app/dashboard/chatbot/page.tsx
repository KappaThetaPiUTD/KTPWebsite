"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Sidebar from "../../../components/Sidebar";
import { supabase } from "../../../lib/supabase";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000";

const getApiUrl = (endpoint: string) => {
  const base = API_BASE.endsWith("/") ? API_BASE.slice(0, -1) : API_BASE;
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${base}${path}`;
};

interface Message {
  role: "user" | "bot";
  text: string;
}

interface DocItem {
  id: string;
  title: string;
  uploadedAt: string;
  contentLength: number;
}

interface SearchResult {
  id: string;
  title: string;
  snippet: string;
}

interface SelectedDoc {
  id: string;
  title: string;
  content: string;
}

const topics = [
  "About KTPilot & fraternity",
  "Events & agenda",
  "Membership & eligibility",
  "Project guidelines",
];

const GREEN = "#1E3D2F";

export default function ChatbotPage() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "Hi, I'm KTPilot. Ask me anything about KTP and your docs." },
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const [documents, setDocuments] = useState<DocItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<SelectedDoc | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const getToken = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session?.access_token || "";
  };

  const loadDocuments = useCallback(async () => {
    try {
      const token = await getToken();
      const res = await fetch(getApiUrl("/api/documents"), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setDocuments(data.documents || []);
    } catch (err) {
      console.error("Failed to load documents:", err);
    }
  }, []);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  useEffect(() => {
    window.scrollTo(0, 0);
    chatContainerRef.current?.scrollTo({ top: 0 });
  }, []);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = query.trim();
    if (!text) return;

    setMessages((prev) => [...prev, { role: "user", text }]);
    setQuery("");
    setIsThinking(true);

    try {
      const token = await getToken();
      const res = await fetch(getApiUrl("/api/ask"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query: text }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "bot", text: data.answer || "I couldn't generate an answer." }]);
    } catch {
      setMessages((prev) => [...prev, { role: "bot", text: "Server error. Please try again." }]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = searchQuery.trim();
    if (!text) return;

    try {
      const token = await getToken();
      const res = await fetch(getApiUrl("/api/search"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query: text }),
      });
      const data = await res.json();
      setSearchResults(data.results || []);
    } catch {
      setSearchResults([]);
    }
  };

  const handleViewDocument = async (id: string) => {
    try {
      const token = await getToken();
      const res = await fetch(getApiUrl(`/api/documents/${id}`), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setSelectedDoc(data);
    } catch (err) {
      console.error("Failed to load document:", err);
    }
  };

  const handleQuickTopic = (topic: string) => {
    setQuery(topic);
    document.getElementById("ktp-chat-input")?.focus();
  };

  return (
    <div
      className="bg-white pt-24 text-sm text-black font-['Public_Sans'] grid grid-cols-[220px_1fr]"
      style={{ minHeight: "100vh" }}
    >
      <aside className="bg-white px-6 py-10 font-['Inter'] border-r border-black shadow-sm space-y-6">
        <Sidebar />
      </aside>

      <main className="px-6 py-6 bg-gray-50 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold" style={{ color: GREEN }}>
              KTPilot
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Ask about chapter docs, rules, events, and membership.
            </p>
          </div>
          <div className="text-[11px] text-gray-500 bg-white border border-gray-200 rounded-full px-3 py-1.5">
            {documents.length} indexed docs
          </div>
        </div>

        <div className="flex gap-4 min-h-0" style={{ height: "calc(100vh - 96px - 24px - 52px - 48px)" }}>
          <section className="flex-1 min-w-0 flex flex-col bg-white rounded-2xl border border-gray-200 shadow-sm min-h-0">
            <div
              className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 shrink-0 rounded-t-2xl"
              style={{ backgroundColor: GREEN }}
            >
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <span className="text-white text-xs font-serif font-bold">KTP</span>
              </div>
              <div>
                <div className="text-sm font-semibold text-white">KTPilot Chat</div>
                <div className="text-[10px] text-white/70">Answering from your uploaded documents</div>
              </div>
              <div className="ml-auto flex items-center gap-1.5 text-[10px] bg-white/10 border border-white/20 px-2 py-1 rounded-full text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-green-300 inline-block" />
                Online
              </div>
            </div>

            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 shrink-0">
              <div className="text-[10px] text-gray-400 mb-2 uppercase tracking-wide">Suggested prompts</div>
              <div className="flex flex-wrap gap-2">
                {topics.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => handleQuickTopic(topic)}
                    className="text-[11px] px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 transition hover:bg-white hover:border-gray-300"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            <div ref={chatContainerRef} className="flex-1 min-h-0 overflow-y-auto px-4 py-4 flex flex-col gap-3 bg-gray-50">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-end gap-2 ${
                    message.role === "user" ? "flex-row-reverse self-end max-w-[85%]" : "self-start max-w-[85%]"
                  }`}
                >
                  {message.role === "bot" && (
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mb-0.5 text-white text-[9px] font-bold font-serif"
                      style={{ backgroundColor: GREEN }}
                    >
                      KTP
                    </div>
                  )}
                  <div
                    className="px-4 py-3 rounded-2xl text-sm leading-relaxed"
                    style={
                      message.role === "user"
                        ? { backgroundColor: GREEN, color: "white", borderTopRightRadius: "6px" }
                        : { backgroundColor: "white", color: "#1a1a1a", border: "1px solid #e5e7eb", borderTopLeftRadius: "6px" }
                    }
                  >
                    {message.text}
                  </div>
                </div>
              ))}

              {isThinking && (
                <div className="flex items-end gap-2 self-start">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mb-0.5 text-white text-[9px] font-bold font-serif"
                    style={{ backgroundColor: GREEN }}
                  >
                    KTP
                  </div>
                  <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl flex gap-1.5 items-center" style={{ borderTopLeftRadius: "6px" }}>
                    {[0, 1, 2].map((item) => (
                      <span
                        key={item}
                        className="w-1.5 h-1.5 rounded-full animate-bounce"
                        style={{ backgroundColor: GREEN, animationDelay: `${item * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleAsk} className="flex items-center gap-2 px-4 py-4 border-t border-gray-200 shrink-0 bg-white rounded-b-2xl">
              <input
                id="ktp-chat-input"
                type="text"
                placeholder="Ask KTPilot anything..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-3 text-sm text-gray-800 outline-none focus:border-gray-400 placeholder:text-gray-400"
              />
              <button type="submit" className="text-white text-sm font-semibold px-5 py-3 rounded-full transition hover:opacity-90" style={{ backgroundColor: GREEN }}>
                Send
              </button>
            </form>
          </section>

          <aside className="w-[360px] shrink-0 min-w-0 flex flex-col gap-3 bg-white rounded-2xl p-4 border border-gray-200 shadow-sm overflow-hidden">
            <div className="rounded-xl p-3 border border-gray-200 bg-gray-50">
              <h2 className="text-sm font-semibold text-gray-900">Document panel</h2>
              <p className="text-[11px] text-gray-500 mt-1 mb-3">
                Search the indexed knowledge base and preview source docs.
              </p>

              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-white text-gray-800 text-xs px-3 py-2 rounded-lg border border-gray-200 outline-none focus:border-gray-400 placeholder:text-gray-400"
                />
                <button type="submit" className="text-white px-3 py-2 rounded-lg text-xs font-semibold transition hover:opacity-90" style={{ backgroundColor: GREEN }}>
                  Search
                </button>
              </form>

              {searchResults.length > 0 && (
                <div className="mt-2 flex flex-col gap-2 max-h-40 overflow-y-auto">
                  <div className="text-[10px] text-gray-400">
                    Found {searchResults.length} result{searchResults.length !== 1 ? "s" : ""}
                  </div>
                  {searchResults.map((result) => (
                    <div key={result.id} className="p-2 bg-white rounded-lg border border-gray-200">
                      <div className="text-xs font-semibold text-gray-800 mb-1">{result.title}</div>
                      <div className="text-[11px] text-gray-500 mb-2">{result.snippet}</div>
                      <button
                        onClick={() => handleViewDocument(result.id)}
                        className="text-[10px] border px-2 py-1 rounded transition"
                        style={{ borderColor: GREEN, color: GREEN }}
                        onMouseEnter={(e) => {
                          const button = e.currentTarget as HTMLButtonElement;
                          button.style.backgroundColor = GREEN;
                          button.style.color = "white";
                        }}
                        onMouseLeave={(e) => {
                          const button = e.currentTarget as HTMLButtonElement;
                          button.style.backgroundColor = "transparent";
                          button.style.color = GREEN;
                        }}
                      >
                        View
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-xl p-3 border border-gray-200 bg-gray-50 flex-1 min-h-0 overflow-y-auto">
              <div className="text-xs font-semibold text-gray-700 mb-2">Uploaded Documents ({documents.length})</div>
              {documents.length === 0 ? (
                <div className="text-xs text-gray-400 text-center py-4">No documents uploaded yet.</div>
              ) : (
                <div className="flex flex-col gap-2">
                  {documents.map((doc) => (
                    <button
                      key={doc.id}
                      onClick={() => handleViewDocument(doc.id)}
                      className="w-full text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition"
                    >
                      <div className="text-xs font-medium text-gray-800">{doc.title}</div>
                      <div className="text-[10px] text-gray-400 mt-1">
                        {new Date(doc.uploadedAt).toLocaleDateString()} | {doc.contentLength} chars
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {selectedDoc && (
              <div className="bg-white rounded-xl border border-gray-200 flex flex-col max-h-64 shrink-0 shadow-sm">
                <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 shrink-0">
                  <h3 className="text-xs font-semibold text-gray-800 truncate pr-2">{selectedDoc.title}</h3>
                  <button
                    onClick={() => setSelectedDoc(null)}
                    className="text-gray-400 hover:text-gray-700 text-xs border border-gray-200 px-2 py-1 rounded transition shrink-0"
                  >
                    Close
                  </button>
                </div>
                <pre className="flex-1 overflow-y-auto p-3 text-[11px] text-gray-600 whitespace-pre-wrap font-mono leading-relaxed">
                  {selectedDoc.content}
                </pre>
              </div>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}
