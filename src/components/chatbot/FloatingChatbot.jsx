"use client";

import React, { useEffect, useRef, useState } from "react";
import "./FloatingChatbot.scss";

const LS_SESSION = "age_chat_session_v1";
const LS_MESSAGES = "age_chat_messages_v1";

function nowTime() {
  const d = new Date();
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function safeJsonParse(s, fallback) {
  try {
    return JSON.parse(s);
  } catch {
    return fallback;
  }
}

function genSessionId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return "sess_" + Math.random().toString(16).slice(2) + "_" + Date.now().toString(16);
}

function linkify(text) {
  const str = String(text ?? "");
  const splitRe = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;
  const parts = str.split(splitRe);
  return parts.map((p, i) => {
    const s = String(p || "");
    const isUrl = /^(https?:\/\/|www\.)/i.test(s);
    if (isUrl) {
      const href = s.startsWith("http") ? s : `https://${s}`;
      return (
        <a
          key={i}
          href={href}
          target="_blank"
          rel="noreferrer"
          style={{ textDecoration: "underline", color: "#0ea5e9" }}
        >
          {s}
        </a>
      );
    }
    return <React.Fragment key={i}>{s}</React.Fragment>;
  });
}

async function postJson(url, body, signal) {
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal,
  });
  const j = await r.json().catch(() => ({}));
  return { ok: r.ok, status: r.status, json: j };
}

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const listRef = useRef(null);
  const abortRef = useRef(null);

  // Initialize from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const sid = localStorage.getItem(LS_SESSION) || genSessionId();
    localStorage.setItem(LS_SESSION, sid);
    setSessionId(sid);

    const msgs = safeJsonParse(localStorage.getItem(LS_MESSAGES) || "[]", []);
    setMessages(Array.isArray(msgs) ? msgs : []);
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages.length, sending]);

  function persist(nextMsgs) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LS_MESSAGES, JSON.stringify(nextMsgs || []));
    }
  }

  function addMsg(role, text) {
    const m = { 
      id: `${Date.now()}_${Math.random().toString(16).slice(2)}`, 
      role, 
      text, 
      t: nowTime() 
    };
    setMessages((prev) => {
      const next = [...prev, m];
      persist(next);
      return next;
    });
  }

  async function sendMessage(text) {
    const msg = String(text || "").trim();
    if (!msg || sending) return;

    setError("");
    setSending(true);
    addMsg("user", msg);

    if (abortRef.current) abortRef.current.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    const body = {
      message: msg,
      sessionId,
    };

    const chatUrl = process.env.NEXT_PUBLIC_CHAT_MESSAGE_URL || "/api/chat/message";

    try {
      const { ok, status, json } = await postJson(chatUrl, body, ac.signal);

      if (ok && json?.replyText) {
        setMessages((prev) => {
          const botMsg = {
            id: `${Date.now()}_${Math.random().toString(16).slice(2)}`,
            role: "assistant",
            text: json.replyText,
            t: nowTime(),
          };
          const next = [...prev, botMsg];
          persist(next);
          return next;
        });
      } else {
        throw new Error(json?.error || `API Error: ${status}`);
      }
    } catch (e) {
      if (e?.name === "AbortError") return;
      setError(String(e?.message || e));
      setMessages((prev) => {
        const botMsg = {
          id: `${Date.now()}_${Math.random().toString(16).slice(2)}`,
          role: "assistant",
          text: "Sorry, I'm having trouble connecting right now. Please try again.",
          t: nowTime(),
        };
        const next = [...prev, botMsg];
        persist(next);
        return next;
      });
    } finally {
      setSending(false);
      abortRef.current = null;
    }
  }

  function onSubmit(e) {
    e.preventDefault();
    sendMessage(input);
    setInput("");
  }

  function clearChat() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(LS_MESSAGES);
    setMessages([]);
    setError("");
  }

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const closeChat = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <div className="floating-chat-button" onClick={toggleChat}>
          <div className="chat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16Z" fill="currentColor"/>
              <circle cx="7" cy="10" r="1" fill="currentColor"/>
              <circle cx="12" cy="10" r="1" fill="currentColor"/>
              <circle cx="17" cy="10" r="1" fill="currentColor"/>
            </svg>
          </div>
          <div className="chat-pulse"></div>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="floating-chat-window">
          {/* Header */}
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-logo"></div>
              <div className="chat-title">
                <h3>AGE Chat Assistant</h3>
                <p>Ask about fabrics, GSM, colors & more</p>
              </div>
            </div>
            <div className="header-buttons">
              <button className="clear-btn" onClick={clearChat} title="Clear chat">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M3 6H5H21M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button className="close-btn" onClick={closeChat}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Chat Content */}
          <div className="chat-content">
            {/* Messages */}
            <div className="chat-messages" ref={listRef}>
              {messages.length === 0 ? (
                <div className="welcome-message">
                  <div className="welcome-icon">👋</div>
                  <h4>Welcome to AGE Chat!</h4>
                  <p>Ask me about:</p>
                  <ul>
                    <li>Fabric availability & specifications</li>
                    <li>GSM, colors, and content details</li>
                    <li>Nokia & Majestica collections</li>
                    <li>Product recommendations</li>
                  </ul>
                  <div className="quick-questions">
                    <button onClick={() => sendMessage("Show me cotton fabrics")}>
                      Cotton Fabrics
                    </button>
                    <button onClick={() => sendMessage("What GSM options do you have?")}>
                      GSM Options
                    </button>
                    <button onClick={() => sendMessage("Tell me about Nokia collection")}>
                      Nokia Collection
                    </button>
                  </div>
                </div>
              ) : null}
              
              {messages.map((m) => (
                <div key={m.id} className={`message ${m.role}`}>
                  <div className="message-bubble">
                    {linkify(m.text)}
                  </div>
                  <div className="message-meta">
                    <span>{m.role === "user" ? "You" : "AGE Assistant"}</span>
                    <span>{m.t}</span>
                  </div>
                </div>
              ))}
              
              {sending && (
                <div className="message assistant">
                  <div className="message-bubble typing">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="error-banner">
                <span>⚠️ {error}</span>
                <button onClick={() => setError("")}>×</button>
              </div>
            )}

            {/* Input Form */}
            <form className="chat-input-form" onSubmit={onSubmit}>
              <div className="input-wrapper">
                <input
                  className="chat-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about fabric availability, specs, GSM, colors..."
                  disabled={sending}
                />
                <button 
                  className="send-btn" 
                  type="submit" 
                  disabled={sending || !input.trim()}
                >
                  {sending ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                      <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}