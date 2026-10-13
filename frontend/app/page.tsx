"use client";

import { useEffect, useState, useRef } from "react";
import MetricMindAnimation from "@/components/MetricMindAnimation";

type Row = Record<string, unknown>;

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
  data?: Row[];
  sql?: string;
  apiResponse?: unknown;
};

type Pin = {
  question: string;
};

function Icon({ name }: { name: string }) {
  const icons: Record<string, React.ReactNode> = {
    chart: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M18 20V10" />
        <path d="M12 20V4" />
        <path d="M6 20v-6" />
      </svg>
    ),
    database: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    ),
    spark: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
      </svg>
    ),
    settings: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
    plus: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    ),
    send: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" fill="white" fillOpacity="0.15" />
      </svg>
    ),
    pin: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="12" y1="17" x2="12" y2="22" />
        <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.89A2 2 0 0 1 15 10.77V5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v5.77a2 2 0 0 1-1.11 1.79l-1.78.89A2 2 0 0 0 5 15.24Z" />
      </svg>
    ),
    menu: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="4" y1="7" x2="20" y2="7" />
        <line x1="4" y1="12" x2="20" y2="12" />
        <line x1="4" y1="17" x2="20" y2="17" />
      </svg>
    ),
    close: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    ),
    code: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    grip: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        <path d="M14 14H12V12H14V14ZM14 10H12V8H14V10ZM10 14H8V12H10V14ZM14 6H12V4H14V6ZM10 10H8V8H10V10ZM6 14H4V12H6V14Z" opacity="0.35" />
      </svg>
    ),
  };

  return <>{icons[name] || icons.spark}</>;
}

function getRows(result: unknown): Row[] {
  if (!result || typeof result !== "object") return [];
  const obj = result as Record<string, unknown>;
  const data = Array.isArray(obj.data)
    ? obj.data
    : Array.isArray(obj.results)
    ? obj.results
    : [];

  return data.filter(
    (item): item is Row =>
      !!item && typeof item === "object" && !Array.isArray(item)
  );
}

function getSql(result: unknown): string | undefined {
  if (!result || typeof result !== "object") return undefined;
  const obj = result as Record<string, unknown>;

  if (typeof obj.sql === "string") return obj.sql;
  if (typeof obj.generated_sql === "string") return obj.generated_sql;

  if (obj.query && typeof obj.query === "object") {
    const query = obj.query as Record<string, unknown>;
    if (typeof query.sql === "string") return query.sql;
  }
  return undefined;
}

function displayValue(value: unknown) {
  if (value === null || value === undefined) return "—";
  if (typeof value === "number") return value.toLocaleString("en-US");
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

export default function Home() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState("chat");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [pins, setPins] = useState<Pin[]>([]);
  const [modal, setModal] = useState<"api" | "sql" | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("metricmind-pinned");
      if (saved) setPins(JSON.parse(saved));
    } catch {
      // Ignore invalid saved preferences
    }
  }, []);

  function togglePin(questionText: string) {
    setPins((oldPins) => {
      const exists = oldPins.some((p) => p.question === questionText);
      const next = exists
        ? oldPins.filter((p) => p.question !== questionText)
        : [...oldPins, { question: questionText }];

      try {
        localStorage.setItem("metricmind-pinned", JSON.stringify(next));
      } catch {
        // Ignored
      }
      return next;
    });
  }

  async function sendQuestion(text = question) {
    const cleaned = text.trim();
    if (!cleaned || loading) return;

    setQuestion("");
    setPage("chat");

    setMessages((old) => [
      ...old,
      { id: Date.now(), role: "user", content: cleaned },
    ]);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: cleaned }),
      });

      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        throw new Error(`API returned a non-JSON response (${response.status}).`);
      }

      const result: unknown = await response.json();

      if (!response.ok) {
        const errorObj = result as Record<string, unknown>;
        throw new Error(
          typeof errorObj.error === "string"
            ? errorObj.error
            : `Request failed (${response.status})`
        );
      }

      const obj = result as Record<string, unknown>;
      const rows = getRows(result);
      const answer =
        (typeof obj.answer === "string" && obj.answer) ||
        (typeof obj.response === "string" && obj.response) ||
        (typeof obj.message === "string" && obj.message) ||
        (rows.length
          ? `I found ${rows.length} rows for your question.`
          : "The API returned a response. You can inspect the API details below.");

      setMessages((old) => [
        ...old,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: answer,
          data: rows,
          sql: getSql(result),
          apiResponse: result,
        },
      ]);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to connect to the AI API.";

      setMessages((old) => [
        ...old,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: `Unable to retrieve live result: ${message}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="metricApp">
      {/* LEFT SIDEBAR - Exact match to Reference Screenshot */}
      {sidebarOpen && (
        <aside className="sidebar">
          {/* Top Brand */}
          <div className="brand">
            <div className="brandIcon">M</div>
            <div className="brandText">
              <strong>MetricMind</strong>
              <span>SEMANTIC BI</span>
            </div>
          </div>

          {/* New Chat Button */}
          <button
            className="newChatBtn"
            onClick={() => {
              setMessages([]);
              setPage("chat");
            }}
          >
            <Icon name="plus" />
            <span>New Chat</span>
          </button>

          {/* WORKSPACE Navigation */}
          <div className="sidebarNavSection">
            <div className="sectionLabel">WORKSPACE</div>
            {[
              ["chart", "Analytics", "analytics"],
              ["database", "Data Sources", "sources"],
              ["spark", "Integrations", "integrations"],
              ["settings", "Settings", "settings"],
            ].map(([icon, label, key]) => (
              <button
                key={key}
                className={`navItem ${page === key ? "navActive" : ""}`}
                onClick={() => setPage(key)}
              >
                <Icon name={icon} />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* PINNED Section */}
          <div className="sidebarNavSection">
            <div className="sectionLabel">PINNED</div>
            {pins.length === 0 ? (
              <p className="emptyHint">Pin important questions to keep them here.</p>
            ) : (
              pins.map((pin) => (
                <div className="pinItemRow" key={pin.question}>
                  <button
                    className="pinTextBtn"
                    onClick={() => void sendQuestion(pin.question)}
                  >
                    {pin.question}
                  </button>
                  <button
                    className="pinActionBtn"
                    title="Unpin"
                    onClick={() => togglePin(pin.question)}
                  >
                    <Icon name="pin" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* SUGGESTED Section */}
          <div className="sidebarNavSection">
            <div className="sectionLabel">SUGGESTED</div>
            {["Show revenue by country", "Show profit by country"].map((text) => (
              <div className="pinItemRow" key={text}>
                <button
                  className="pinTextBtn"
                  onClick={() => void sendQuestion(text)}
                >
                  <Icon name="chart" />
                  <span>{text}</span>
                </button>
                <button
                  className="pinActionBtn"
                  title="Pin question"
                  onClick={() => togglePin(text)}
                >
                  <Icon name="pin" />
                </button>
              </div>
            ))}
          </div>

          {/* RECENT CHATS Section */}
          <div className="sidebarNavSection">
            <div className="sectionLabel">RECENT CHATS</div>
            {messages.filter((m) => m.role === "user").length === 0 ? (
              <p className="emptyHint">No recent chats</p>
            ) : (
              <div className="recentChatsList">
                {messages
                  .filter((m) => m.role === "user")
                  .slice(-4)
                  .reverse()
                  .map((m) => (
                    <button
                      className="recentItemBtn"
                      key={m.id}
                      onClick={() => setPage("chat")}
                    >
                      {m.content}
                    </button>
                  ))}
              </div>
            )}
          </div>

          {/* Bottom Profile */}
          <div className="profileSection">
            <div className="profileAvatar">N</div>
            <div className="profileDetails">
              <strong>Naseema</strong>
              <span>Analyst</span>
            </div>
            <span className="onlineStatusDot" title="Active" />
          </div>
        </aside>
      )}

      {/* MAIN CONTENT AREA */}
      <section className="mainContent">
        {/* TOPBAR - Clean, dark navy, hamburger on left, Connected badge & avatar on right */}
        <header className="topbar">
          <button
            className="menuToggleBtn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle navigation sidebar"
          >
            <Icon name="menu" />
          </button>

          <div className="topbarRight">
            <div className="connectedBadge">
              <span className="onlineDot" />
              <span>Connected</span>
            </div>
            <div className="topAvatar">N</div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        {page === "chat" ? (
          <div className="chatWorkspace">
            {messages.length === 0 ? (
              /* DEFAULT HOME DASHBOARD - Exact match to reference screenshot */
              <div className="heroWelcome">
                {/* 1. Animated Dashboard Illustration */}
                <div className="heroAnimationWrapper">
                  <MetricMindAnimation />
                </div>

                {/* 2. Main Heading and Subtitle */}
                <h1 className="heroTitle">Ask MetricMind anything</h1>
                <p className="heroSubtitle">
                  Turn your business data into clear answers and insights.
                </p>

                {/* 3. Wide Rounded Chat Input */}
                <form
                  className="heroComposer"
                  onSubmit={(e) => {
                    e.preventDefault();
                    void sendQuestion();
                  }}
                >
                  <span className="composerSparkIcon">
                    <Icon name="spark" />
                  </span>

                  <textarea
                    ref={textareaRef}
                    rows={1}
                    className="composerInput"
                    placeholder="Ask a question about your business data..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        void sendQuestion();
                      }
                    }}
                  />

                  <div className="composerGrip">
                    <Icon name="grip" />
                  </div>

                  <button
                    className="composerSendBtn"
                    type="submit"
                    disabled={!question.trim() || loading}
                    aria-label="Send question"
                  >
                    <Icon name="send" />
                  </button>
                </form>

                {/* 4. Subtext below input */}
                <div className="composerHelperText">
                  Press Enter to send · Shift + Enter for a new line
                </div>
              </div>
            ) : (
              /* CHAT MESSAGES VIEW */
              <div className="messagesWorkspace">
                <div className="messagesList">
                  {messages.map((message) => (
                    <article
                      className={`messageCard ${
                        message.role === "user" ? "userCard" : "assistantCard"
                      }`}
                      key={message.id}
                    >
                      {message.role === "assistant" && (
                        <div className="assistantBrandBadge">M</div>
                      )}
                      <div className="messageBody">
                        <div className="messageRoleTag">
                          {message.role === "user" ? "YOU" : "METRICMIND"}
                        </div>
                        <div className="messageText">{message.content}</div>

                        {message.data && message.data.length > 0 && (
                          <div className="tableWrapper">
                            <table className="dataTable">
                              <thead>
                                <tr>
                                  {Object.keys(message.data[0]).map((key) => (
                                    <th key={key}>{key}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {message.data.map((row, index) => (
                                  <tr key={index}>
                                    {Object.keys(message.data![0]).map((key) => (
                                      <td key={key}>
                                        {displayValue(row[key])}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}

                        {message.role === "assistant" && (
                          <div className="messageActions">
                            <button
                              className="actionBtn"
                              onClick={() => {
                                setSelectedMessage(message);
                                setModal("api");
                              }}
                            >
                              <Icon name="code" />
                              <span>View API Call</span>
                            </button>
                            <button
                              className="actionBtn"
                              onClick={() => {
                                setSelectedMessage(message);
                                setModal("sql");
                              }}
                            >
                              <Icon name="code" />
                              <span>View SQL</span>
                            </button>
                            <button
                              className="actionBtn"
                              onClick={() =>
                                togglePin(
                                  messages[messages.indexOf(message) - 1]
                                    ?.content || message.content
                                )
                              }
                            >
                              <Icon name="pin" />
                              <span>Pin / Unpin</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </article>
                  ))}

                  {loading && (
                    <article className="messageCard assistantCard loadingCard">
                      <div className="assistantBrandBadge">M</div>
                      <div className="messageBody">
                        <div className="messageRoleTag">METRICMIND</div>
                        <div className="loadingIndicator">
                          <span className="loadingSpinner" />
                          <div>
                            <strong>Analyzing your business question...</strong>
                            <p>Querying the Semantic Layer and preparing results</p>
                          </div>
                        </div>
                        <div className="loadingStreamBars">
                          <span />
                          <span />
                          <span />
                          <span />
                          <span />
                        </div>
                      </div>
                    </article>
                  )}
                </div>

                {/* Bottom Composer for chat continuation */}
                <form
                  className="heroComposer bottomComposer"
                  onSubmit={(e) => {
                    e.preventDefault();
                    void sendQuestion();
                  }}
                >
                  <span className="composerSparkIcon">
                    <Icon name="spark" />
                  </span>

                  <textarea
                    rows={1}
                    className="composerInput"
                    placeholder="Ask another question about your business data..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        void sendQuestion();
                      }
                    }}
                  />

                  <button
                    className="composerSendBtn"
                    type="submit"
                    disabled={!question.trim() || loading}
                    aria-label="Send question"
                  >
                    <Icon name="send" />
                  </button>
                </form>
              </div>
            )}
          </div>
        ) : (
          /* WORKSPACE SUBPAGES (Analytics, Data Sources, Integrations, Settings) */
          <div className="workspaceSubpage">
            <span className="eyebrowLabel">METRICMIND WORKSPACE</span>
            <h1 className="subpageTitle">
              {page === "analytics"
                ? "Analytics Overview"
                : page === "sources"
                ? "Data Sources"
                : page === "integrations"
                ? "Integrations"
                : "Settings"}
            </h1>
            <p className="subpageDescription">
              {page === "analytics" &&
                "Explore real-time business performance and ask questions about your data."}
              {page === "sources" &&
                "Review connected relational databases and Semantic BI catalogs."}
              {page === "integrations" &&
                "AI Agent upstream API proxy and Cloudflare tunnel status."}
              {page === "settings" &&
                "Workspace preferences, model parameters, and profile configuration."}
            </p>

            {page === "analytics" ? (
              <div className="workspaceCardsGrid">
                {[
                  ["Sales Analysis", "Show sales by country", "Explore sales across regional markets."],
                  ["Revenue Analysis", "Show revenue by country", "Analyze revenue trends and recurring sales."],
                  ["Profit Analysis", "Show profit by country", "Inspect profit margins and unit economics."],
                ].map(([title, query, desc]) => (
                  <button
                    className="workspaceActionCard"
                    key={title}
                    onClick={() => {
                      setPage("chat");
                      void sendQuestion(query);
                    }}
                  >
                    <div className="workspaceCardIcon">
                      <Icon name="chart" />
                    </div>
                    <h3>{title}</h3>
                    <p>{desc}</p>
                    <span className="cardActionLink">Explore analysis →</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="infoStatusCard">
                <div className="workspaceCardIcon">
                  <Icon
                    name={
                      page === "sources"
                        ? "database"
                        : page === "settings"
                        ? "settings"
                        : "spark"
                    }
                  />
                </div>
                <h3>
                  {page === "sources"
                    ? "Data Source Connection Active"
                    : page === "integrations"
                    ? "Semantic AI API Configured"
                    : "User Profile: Naseema (Analyst)"}
                </h3>
                <p>
                  {page === "sources"
                    ? "Semantic Layer connection points to PostgreSQL/DuckDB business models."
                    : page === "integrations"
                    ? "Queries are processed via /api/chat upstream model endpoint."
                    : "Workspace configured for semantic exploration and interactive dashboarding."}
                </p>
                <button
                  className="returnToChatBtn"
                  onClick={() => setPage("chat")}
                >
                  Return to Dashboard
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      {/* DETAIL MODAL (API Call / SQL) */}
      {modal && selectedMessage && (
        <div className="modalBackdrop" onClick={() => setModal(null)}>
          <div className="modalCard" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <h3>{modal === "api" ? "API Call Details" : "Generated SQL"}</h3>
              <button
                className="modalCloseBtn"
                onClick={() => setModal(null)}
                aria-label="Close modal"
              >
                <Icon name="close" />
              </button>
            </div>
            <pre className="modalCodeBlock">
              {modal === "sql"
                ? selectedMessage.sql ||
                  "The backend did not return a generated SQL query for this response."
                : JSON.stringify(
                    {
                      method: "POST",
                      endpoint: "/api/chat",
                      response:
                        selectedMessage.apiResponse ?? {
                          message: selectedMessage.content,
                        },
                    },
                    null,
                    2
                  )}
            </pre>
            <div className="modalFooter">
              <button
                className="copyBtn"
                onClick={() => {
                  const val =
                    modal === "sql"
                      ? selectedMessage.sql || "No SQL returned."
                      : JSON.stringify(selectedMessage.apiResponse ?? {}, null, 2);
                  void navigator.clipboard?.writeText(val);
                }}
              >
                Copy to Clipboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STYLES - Exact replication of reference screenshot layout & theme */}
      <style jsx>{`
        .metricApp {
          display: flex;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          background-color: #060b18;
          color: #f8fafc;
        }

        /* SIDEBAR */
        .sidebar {
          width: 250px;
          min-width: 250px;
          height: 100%;
          display: flex;
          flex-direction: column;
          padding: 20px 16px 16px;
          background-color: #080d1a;
          border-right: 1px solid rgba(25, 42, 75, 0.45);
          overflow-y: auto;
          flex-shrink: 0;
          z-index: 20;
        }

        /* Top Brand */
        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-bottom: 18px;
          border-bottom: 1px solid rgba(30, 48, 85, 0.45);
        }

        .brandIcon {
          display: grid;
          place-items: center;
          width: 38px;
          height: 38px;
          border-radius: 11px;
          background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%);
          color: #ffffff;
          font-weight: 800;
          font-size: 19px;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.35);
          flex-shrink: 0;
        }

        .brandText strong {
          display: block;
          color: #ffffff;
          font-size: 15.5px;
          font-weight: 700;
          letter-spacing: -0.2px;
        }

        .brandText span {
          display: block;
          margin-top: 3px;
          color: #64748b;
          font-size: 9.5px;
          font-weight: 600;
          letter-spacing: 1.6px;
        }

        /* New Chat Button */
        .newChatBtn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          width: 100%;
          height: 42px;
          margin: 18px 0 20px;
          border-radius: 11px;
          background: linear-gradient(90deg, #9333ea 0%, #3b82f6 100%);
          color: #ffffff;
          font-size: 13.5px;
          font-weight: 600;
          box-shadow: 0 4px 14px rgba(147, 51, 234, 0.35);
          transition: transform 0.15s ease, filter 0.15s ease;
        }

        .newChatBtn:hover {
          filter: brightness(1.08);
          transform: translateY(-1px);
        }

        .newChatBtn:active {
          transform: translateY(0);
        }

        /* Nav Section */
        .sidebarNavSection {
          margin-bottom: 22px;
        }

        .sectionLabel {
          color: #55698a;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1.4px;
          margin: 0 6px 10px;
        }

        .navItem {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 9px 10px;
          border-radius: 8px;
          color: #94a3b8;
          font-size: 13px;
          font-weight: 500;
          text-align: left;
          transition: color 0.15s ease, background-color 0.15s ease;
        }

        .navItem:hover {
          color: #ffffff;
          background-color: rgba(30, 50, 90, 0.35);
        }

        .navActive {
          color: #ffffff;
          background-color: rgba(30, 50, 90, 0.5);
        }

        .emptyHint {
          margin: 0 6px;
          color: #55698a;
          font-size: 11.5px;
          line-height: 1.5;
        }

        .pinItemRow {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-bottom: 3px;
        }

        .pinTextBtn {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 8px 8px;
          border-radius: 7px;
          color: #94a3b8;
          font-size: 12px;
          text-align: left;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          transition: color 0.15s ease, background 0.15s ease;
        }

        .pinTextBtn:hover {
          color: #ffffff;
          background: rgba(30, 50, 90, 0.3);
        }

        .pinActionBtn {
          display: grid;
          place-items: center;
          padding: 7px;
          border-radius: 6px;
          color: #55698a;
          transition: color 0.15s ease;
        }

        .pinActionBtn:hover {
          color: #00f2fe;
        }

        .recentChatsList {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .recentItemBtn {
          padding: 7px 8px;
          border-radius: 7px;
          color: #94a3b8;
          font-size: 12px;
          text-align: left;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          transition: color 0.15s ease;
        }

        .recentItemBtn:hover {
          color: #ffffff;
          background: rgba(30, 50, 90, 0.25);
        }

        /* Bottom Profile */
        .profileSection {
          display: flex;
          align-items: center;
          gap: 11px;
          margin-top: auto;
          padding-top: 14px;
          border-top: 1px solid rgba(30, 48, 85, 0.45);
        }

        .profileAvatar {
          display: grid;
          place-items: center;
          width: 35px;
          height: 35px;
          border-radius: 50%;
          background: linear-gradient(135deg, #1e293b, #0f172a);
          border: 1px solid rgba(148, 163, 184, 0.2);
          color: #ffffff;
          font-weight: 600;
          font-size: 14px;
        }

        .profileDetails strong {
          display: block;
          color: #ffffff;
          font-size: 13px;
          font-weight: 600;
          line-height: 1.2;
        }

        .profileDetails span {
          display: block;
          margin-top: 2px;
          color: #64748b;
          font-size: 11px;
        }

        .onlineStatusDot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #00f2fe;
          box-shadow: 0 0 8px #00f2fe;
          margin-left: auto;
        }

        /* MAIN PANEL */
        .mainContent {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          height: 100%;
          background-color: #060b18;
          position: relative;
        }

        /* TOPBAR */
        .topbar {
          height: 72px;
          min-height: 72px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 28px;
          border-bottom: 1px solid rgba(25, 42, 75, 0.45);
          background-color: #080d1a;
          z-index: 10;
        }

        .menuToggleBtn {
          display: grid;
          place-items: center;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          color: #8fa3c7;
          transition: color 0.15s ease, background 0.15s ease;
        }

        .menuToggleBtn:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.05);
        }

        .topbarRight {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .connectedBadge {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          border-radius: 20px;
          background: rgba(0, 242, 254, 0.04);
          border: 1px solid rgba(0, 242, 254, 0.5);
          color: #00f2fe;
          font-size: 12px;
          font-weight: 500;
        }

        .onlineDot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #00f2fe;
          box-shadow: 0 0 7px #00f2fe;
        }

        .topAvatar {
          display: grid;
          place-items: center;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%);
          color: #ffffff;
          font-weight: 600;
          font-size: 14px;
          box-shadow: 0 2px 8px rgba(139, 92, 246, 0.35);
        }

        /* CHAT WORKSPACE */
        .chatWorkspace {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 0;
          overflow: hidden;
          position: relative;
        }

        /* HERO WELCOME SCREEN (Screenshot Replica) */
        .heroWelcome {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px 32px 36px;
          overflow-y: auto;
        }

        .heroAnimationWrapper {
          width: 100%;
          max-width: 780px;
          margin-bottom: 24px;
        }

        .heroTitle {
          margin: 0;
          color: #f8fafc;
          font-size: clamp(26px, 2.5vw, 34px);
          font-weight: 700;
          letter-spacing: -0.6px;
          text-align: center;
        }

        .heroSubtitle {
          margin: 10px 0 28px;
          color: #8fa3c7;
          font-size: 15px;
          font-weight: 400;
          text-align: center;
        }

        /* COMPOSER (Screenshot Replica) */
        .heroComposer {
          display: flex;
          align-items: center;
          gap: 12px;
          width: min(780px, 92%);
          min-height: 62px;
          padding: 8px 10px 8px 18px;
          border-radius: 18px;
          background: #0b1324;
          border: 1px solid rgba(48, 74, 115, 0.45);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.04);
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .heroComposer:focus-within {
          border-color: rgba(0, 242, 254, 0.4);
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.5), 0 0 16px rgba(0, 242, 254, 0.15);
        }

        .composerSparkIcon {
          color: #818cf8;
          display: grid;
          place-items: center;
          flex-shrink: 0;
        }

        .composerInput {
          flex: 1;
          min-width: 0;
          max-height: 120px;
          resize: none;
          padding: 8px 0;
          border: 0;
          outline: 0;
          background: transparent;
          color: #f8fafc;
          font-size: 14px;
        }

        .composerInput::placeholder {
          color: #55698a;
        }

        .composerGrip {
          display: grid;
          place-items: center;
          color: #3e5070;
          margin-right: 4px;
        }

        .composerSendBtn {
          display: grid;
          place-items: center;
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: linear-gradient(135deg, #a855f7 0%, #3b82f6 100%);
          color: #ffffff;
          box-shadow: 0 4px 15px rgba(168, 85, 247, 0.35);
          flex-shrink: 0;
          transition: transform 0.15s ease, filter 0.15s ease;
        }

        .composerSendBtn:hover:not(:disabled) {
          filter: brightness(1.1);
          transform: translateY(-1px);
        }

        .composerSendBtn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          box-shadow: none;
        }

        .composerHelperText {
          margin-top: 12px;
          color: #55698a;
          font-size: 11.5px;
          text-align: center;
        }

        /* MESSAGES WORKSPACE */
        .messagesWorkspace {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 0;
          overflow: hidden;
        }

        .messagesList {
          flex: 1;
          overflow-y: auto;
          padding: 24px clamp(16px, 5vw, 80px) 16px;
        }

        .messageCard {
          display: flex;
          gap: 14px;
          width: min(100%, 820px);
          margin: 0 auto 18px;
          padding: 18px 20px;
          border-radius: 16px;
          background: #091224;
          border: 1px solid rgba(35, 58, 98, 0.5);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        }

        .userCard {
          width: fit-content;
          max-width: 80%;
          margin-right: max(0px, calc((100% - 820px) / 2));
          margin-left: auto;
          background: rgba(30, 58, 110, 0.3);
          border-color: rgba(59, 130, 246, 0.35);
        }

        .assistantBrandBadge {
          display: grid;
          place-items: center;
          width: 32px;
          height: 32px;
          border-radius: 10px;
          background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%);
          color: #ffffff;
          font-weight: 700;
          font-size: 15px;
          flex-shrink: 0;
        }

        .messageBody {
          flex: 1;
          min-width: 0;
        }

        .messageRoleTag {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1.2px;
          color: #818cf8;
          margin-bottom: 6px;
        }

        .messageText {
          color: #e2e8f0;
          font-size: 14px;
          line-height: 1.65;
          overflow-wrap: anywhere;
        }

        .tableWrapper {
          margin-top: 14px;
          overflow-x: auto;
          border-radius: 10px;
          border: 1px solid rgba(40, 70, 115, 0.5);
        }

        .dataTable {
          width: 100%;
          border-collapse: collapse;
          font-size: 12.5px;
          text-align: left;
        }

        .dataTable th,
        .dataTable td {
          padding: 10px 14px;
          border-bottom: 1px solid rgba(35, 58, 95, 0.4);
          white-space: nowrap;
        }

        .dataTable th {
          background: #0f1c34;
          color: #7dd3fc;
          font-weight: 600;
        }

        .dataTable td {
          color: #cbd5e1;
        }

        .messageActions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 14px;
          padding-top: 12px;
          border-top: 1px solid rgba(35, 58, 95, 0.35);
        }

        .actionBtn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 11px;
          border-radius: 8px;
          background: rgba(30, 50, 85, 0.35);
          border: 1px solid rgba(50, 80, 130, 0.4);
          color: #94a3b8;
          font-size: 11.5px;
          transition: color 0.15s ease, background 0.15s ease;
        }

        .actionBtn:hover {
          color: #ffffff;
          background: rgba(45, 75, 125, 0.5);
        }

        .bottomComposer {
          margin: 0 auto 20px;
          flex-shrink: 0;
        }

        .loadingCard {
          border-color: rgba(56, 189, 248, 0.35);
        }

        .loadingIndicator {
          display: flex;
          align-items: center;
          gap: 14px;
          color: #7dd3fc;
        }

        .loadingIndicator strong {
          font-size: 13.5px;
          color: #ffffff;
        }

        .loadingIndicator p {
          margin: 3px 0 0;
          font-size: 12px;
          color: #8fa3c7;
        }

        .loadingSpinner {
          width: 26px;
          height: 26px;
          border: 2px solid rgba(56, 189, 248, 0.2);
          border-top-color: #00f2fe;
          border-right-color: #a855f7;
          border-radius: 50%;
          animation: spin 0.9s linear infinite;
          flex-shrink: 0;
        }

        .loadingStreamBars {
          display: flex;
          gap: 6px;
          height: 3px;
          margin-top: 14px;
          background: rgba(30, 50, 85, 0.3);
          border-radius: 2px;
          overflow: hidden;
        }

        .loadingStreamBars span {
          width: 20%;
          background: linear-gradient(90deg, #00f2fe, #a855f7);
          animation: barFlow 1.2s ease-in-out infinite alternate;
        }

        /* WORKSPACE SUBPAGES */
        .workspaceSubpage {
          flex: 1;
          overflow-y: auto;
          padding: clamp(24px, 4vw, 56px);
        }

        .eyebrowLabel {
          color: #818cf8;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1.5px;
        }

        .subpageTitle {
          margin: 6px 0 10px;
          font-size: 28px;
          color: #ffffff;
          font-weight: 700;
        }

        .subpageDescription {
          color: #8fa3c7;
          font-size: 14px;
          margin: 0 0 28px;
        }

        .workspaceCardsGrid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 18px;
        }

        .workspaceActionCard,
        .infoStatusCard {
          padding: 22px;
          border-radius: 16px;
          background: #091224;
          border: 1px solid rgba(35, 58, 98, 0.5);
          text-align: left;
          color: #f8fafc;
          transition: transform 0.15s ease, border-color 0.15s ease;
        }

        .workspaceActionCard:hover {
          transform: translateY(-2px);
          border-color: rgba(0, 242, 254, 0.4);
        }

        .workspaceCardIcon {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: rgba(0, 242, 254, 0.1);
          color: #00f2fe;
          display: grid;
          place-items: center;
          margin-bottom: 14px;
        }

        .workspaceActionCard h3,
        .infoStatusCard h3 {
          margin: 0 0 8px;
          font-size: 16px;
          font-weight: 600;
        }

        .workspaceActionCard p,
        .infoStatusCard p {
          color: #8fa3c7;
          font-size: 13px;
          line-height: 1.6;
          margin: 0 0 14px;
        }

        .cardActionLink {
          color: #38bdf8;
          font-size: 12.5px;
          font-weight: 600;
        }

        .returnToChatBtn {
          padding: 9px 16px;
          border-radius: 8px;
          background: linear-gradient(90deg, #9333ea, #3b82f6);
          color: #ffffff;
          font-size: 13px;
          font-weight: 600;
        }

        /* MODAL */
        .modalBackdrop {
          position: fixed;
          inset: 0;
          z-index: 50;
          background: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(6px);
          display: grid;
          place-items: center;
          padding: 20px;
        }

        .modalCard {
          width: min(650px, 100%);
          max-height: 85vh;
          border-radius: 18px;
          background: #091326;
          border: 1px solid rgba(45, 75, 125, 0.5);
          padding: 22px;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7);
        }

        .modalHeader {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
        }

        .modalHeader h3 {
          margin: 0;
          color: #ffffff;
          font-size: 16px;
        }

        .modalCloseBtn {
          color: #8fa3c7;
          display: grid;
          place-items: center;
        }

        .modalCloseBtn:hover {
          color: #ffffff;
        }

        .modalCodeBlock {
          flex: 1;
          overflow-y: auto;
          background: #050a14;
          border: 1px solid rgba(30, 48, 80, 0.5);
          border-radius: 10px;
          padding: 14px;
          color: #7dd3fc;
          font-family: monospace;
          font-size: 12px;
          white-space: pre-wrap;
          word-break: break-all;
        }

        .modalFooter {
          margin-top: 16px;
          display: flex;
          justify-content: flex-end;
        }

        .copyBtn {
          padding: 8px 14px;
          border-radius: 8px;
          background: rgba(30, 50, 90, 0.4);
          border: 1px solid rgba(56, 189, 248, 0.3);
          color: #00f2fe;
          font-size: 12px;
          font-weight: 500;
        }

        .copyBtn:hover {
          background: rgba(30, 50, 90, 0.6);
        }

        /* ANIMATIONS */
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes barFlow {
          from {
            opacity: 0.3;
            transform: scaleX(0.4);
          }
          to {
            opacity: 1;
            transform: scaleX(1);
          }
        }

        /* RESPONSIVE */
        @media (max-width: 900px) {
          .sidebar {
            width: 220px;
            min-width: 220px;
          }
        }

        @media (max-width: 680px) {
          .sidebar {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            width: 240px;
            box-shadow: 4px 0 20px rgba(0, 0, 0, 0.5);
          }

          .heroComposer {
            width: 95%;
          }
        }
      `}</style>
    </main>
  );
}
