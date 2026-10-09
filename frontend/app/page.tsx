"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Message = {
  role: "user" | "assistant";
  content: string;
  data?: any[];
  sql?: string;
  apiResponse?: any;
};

type PageType =
  | "chat"
  | "analytics"
  | "sources"
  | "integrations"
  | "settings";

type PinItem = {
  id: string;
  title: string;
  question: string;
};

type IconName =
  | "plus"
  | "chart"
  | "database"
  | "settings"
  | "plug"
  | "pin"
  | "clock"
  | "send"
  | "menu"
  | "search"
  | "paperclip"
  | "mic"
  | "close"
  | "copy"
  | "code"
  | "check"
  | "unpin";

function Icon({
  name,
  size = 20,
}: {
  name: IconName;
  size?: number;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case "plus":
      return (
        <svg {...common}>
          <path d="M12 5v14M5 12h14" />
        </svg>
      );

    case "chart":
      return (
        <svg {...common}>
          <path d="M4 19V5" />
          <path d="M4 19h16" />
          <path d="M7 16v-5" />
          <path d="M12 16V8" />
          <path d="M17 16V6" />
        </svg>
      );

    case "database":
      return (
        <svg {...common}>
          <ellipse cx="12" cy="5" rx="8" ry="3" />
          <path d="M4 5v7c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
          <path d="M4 12v7c0 1.7 3.6 3 8 3s8-1.3 8-3v-7" />
        </svg>
      );

    case "settings":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V20h-2.5v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1-1.8-1.8.1-.1A1.7 1.7 0 0 0 8.1 15a1.7 1.7 0 0 0-1.5-1H6.5v-2.5h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 1.8-1.8.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5V5h2.5v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.8 1.8-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.1V14h-.1a1.7 1.7 0 0 0-1.5 1Z" />
        </svg>
      );

    case "plug":
      return (
        <svg {...common}>
          <path d="M8 12h8" />
          <path d="M9 7V4M15 7V4" />
          <path d="M7 7h10v4a5 5 0 0 1-10 0V7Z" />
          <path d="M12 16v4" />
        </svg>
      );

    case "pin":
      return (
        <svg {...common}>
          <path d="m15 4 5 5-3 1-3 3v4l-2 2-2-2v-4l-3-3-3-1 5-5Z" />
          <path d="m12 19-1 2" />
        </svg>
      );

    case "unpin":
      return (
        <svg {...common}>
          <path d="m15 4 5 5-3 1-3 3v4l-2 2-2-2v-4l-3-3-3-1 5-5Z" />
          <path d="M4 4l16 16" />
        </svg>
      );

    case "clock":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8v4l3 2" />
        </svg>
      );

    case "send":
      return (
        <svg {...common}>
          <path d="m21 3-7.5 18-3.5-7-7-3.5L21 3Z" />
          <path d="M10 14 21 3" />
        </svg>
      );

    case "menu":
      return (
        <svg {...common}>
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      );

    case "search":
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="6" />
          <path d="m16 16 4 4" />
        </svg>
      );

    case "paperclip":
      return (
        <svg {...common}>
          <path d="m20 11-7.5 7.5a5 5 0 0 1-7-7L13 4a3.5 3.5 0 0 1 5 5l-7.5 7.5a2 2 0 0 1-3-3L14 7" />
        </svg>
      );

    case "mic":
      return (
        <svg {...common}>
          <rect x="9" y="3" width="6" height="11" rx="3" />
          <path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6" />
        </svg>
      );

    case "close":
      return (
        <svg {...common}>
          <path d="m6 6 12 12M18 6 6 18" />
        </svg>
      );

    case "copy":
      return (
        <svg {...common}>
          <rect x="8" y="8" width="11" height="11" rx="2" />
          <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
        </svg>
      );

    case "code":
      return (
        <svg {...common}>
          <path d="m8 9-4 3 4 3M16 9l4 3-4 3M14 5l-4 14" />
        </svg>
      );

    case "check":
      return (
        <svg {...common}>
          <path d="m5 12 4 4L19 6" />
        </svg>
      );

    default:
      return null;
  }
}

function getChartData(data: any[]) {
  if (!Array.isArray(data) || data.length === 0) {
    return null;
  }

  const first = data[0];

  if (!first || typeof first !== "object") {
    return null;
  }

  const keys = Object.keys(first);

  const labelKey =
    keys.find(
      (key) =>
        typeof first[key] === "string" &&
        key.toLowerCase() !== "id"
    ) || keys[0];

  const numericKey = keys.find(
    (key) =>
      typeof first[key] === "number" &&
      Number.isFinite(first[key])
  );

  if (!labelKey || !numericKey) {
    return null;
  }

  return data.map((item) => ({
    label: String(item[labelKey]),
    value: Number(item[numericKey]),
  }));
}

function formatCell(value: any) {
  if (value === null || value === undefined) {
    return "-";
  }

  if (typeof value === "number") {
    return value.toLocaleString();
  }

  return String(value);
}

export default function Home() {
  const [currentPage, setCurrentPage] =
    useState<PageType>("chat");

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [mobileSidebar, setMobileSidebar] =
    useState(false);

  const [showApiModal, setShowApiModal] =
    useState(false);

  const [showSqlModal, setShowSqlModal] =
    useState(false);

  const [lastQuestion, setLastQuestion] =
    useState("");

  const [lastApiResponse, setLastApiResponse] =
    useState<any>(null);

  const [lastSql, setLastSql] =
    useState("");

  const [pinnedItems, setPinnedItems] =
    useState<PinItem[]>([]);

  useEffect(() => {
    try {
      const saved =
        localStorage.getItem("metricmind-pinned");

      if (saved) {
        setPinnedItems(JSON.parse(saved));
      }
    } catch (error) {
      console.error(
        "Failed to load pinned items:",
        error
      );
    }
  }, []);

  function savePinnedItems(items: PinItem[]) {
    setPinnedItems(items);

    try {
      localStorage.setItem(
        "metricmind-pinned",
        JSON.stringify(items)
      );
    } catch (error) {
      console.error(
        "Failed to save pinned items:",
        error
      );
    }
  }

  function isPinned(id: string) {
    return pinnedItems.some(
      (item) => item.id === id
    );
  }

  function togglePin(item: PinItem) {
    if (isPinned(item.id)) {
      savePinnedItems(
        pinnedItems.filter(
          (pinned) => pinned.id !== item.id
        )
      );
    } else {
      savePinnedItems([
        ...pinnedItems,
        item,
      ]);
    }
  }

  function pinMessage(question: string) {
    const id = `chat-${question
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .slice(0, 60)}`;

    togglePin({
      id,
      title: question,
      question,
    });
  }

  async function sendMessage(
    event?: FormEvent,
    customQuestion?: string
  ) {
    event?.preventDefault();

    const question =
      customQuestion?.trim() || input.trim();

    if (!question || loading) {
      return;
    }

    setCurrentPage("chat");

    const userMessage: Message = {
      role: "user",
      content: question,
    };

    setMessages((previous) => [
      ...previous,
      userMessage,
    ]);

    setInput("");
    setLoading(true);
    setLastQuestion(question);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error || "API request failed"
        );
      }

      const responseData = Array.isArray(result?.data)
        ? result.data
        : [];

      const assistantText =
        result?.answer ||
        result?.response ||
        result?.message ||
        result?.text ||
        "The API returned a response.";

      const sql =
        result?.sql ||
        result?.query?.sql ||
        result?.query?.generated_sql ||
        "";

      setLastApiResponse(result);
      setLastSql(sql);

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content:
            typeof assistantText === "string"
              ? assistantText
              : JSON.stringify(assistantText),
          data: responseData,
          sql,
          apiResponse: result,
        },
      ]);
    } catch (error) {
      console.error("Chat error:", error);

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content:
            "The Semantic Layer is currently unavailable. Please try again later.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function startNewChat() {
    setMessages([]);
    setInput("");
    setLastQuestion("");
    setLastApiResponse(null);
    setLastSql("");
    setCurrentPage("chat");
    setMobileSidebar(false);
  }

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  function openPage(page: PageType) {
    setCurrentPage(page);
    setMobileSidebar(false);
  }

  function renderAnalytics() {
    return (
      <section className="mx-auto w-full max-w-[1100px]">
        <div className="mb-7">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-500">
            Analytics
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-800">
            Analytics Overview
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Monitor business metrics and explore your data using natural language.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <Icon name="chart" size={22} />
            </div>

            <h3 className="font-semibold text-slate-800">
              Sales Analysis
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Ask MetricMind about sales, products and regions.
            </p>

            <button
              onClick={() =>
                sendMessage(
                  undefined,
                  "Show sales by region"
                )
              }
              className="mt-5 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-700"
            >
              Explore Sales
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Icon name="chart" size={22} />
            </div>

            <h3 className="font-semibold text-slate-800">
              Revenue Analysis
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Analyze revenue by country, month, product or region.
            </p>

            <button
              onClick={() =>
                sendMessage(
                  undefined,
                  "Show revenue by country"
                )
              }
              className="mt-5 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              Explore Revenue
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Icon name="chart" size={22} />
            </div>

            <h3 className="font-semibold text-slate-800">
              Profit Analysis
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Explore profit and margin metrics from your business data.
            </p>

            <button
              onClick={() =>
                sendMessage(
                  undefined,
                  "Show profit by country"
                )
              }
              className="mt-5 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700"
            >
              Explore Profit
            </button>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
            <Icon name="database" size={23} />
          </div>

          <h3 className="mt-4 font-semibold text-slate-800">
            Live analytics will appear here
          </h3>

          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
            Once the Semantic Layer is available, MetricMind can populate these analytics with real business data.
          </p>
        </div>
      </section>
    );
  }

  function renderSources() {
    return (
      <section className="mx-auto w-full max-w-[1000px]">
        <div className="mb-7">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-500">
            Data
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-800">
            Data Sources
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Manage and monitor the data sources used by MetricMind.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-4 border-b border-slate-100 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Icon name="database" size={24} />
            </div>

            <div className="flex-1">
              <h3 className="font-semibold text-slate-800">
                MetricMind Data Layer
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Business dataset connected through the semantic layer.
              </p>
            </div>

            <span className="flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-600">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              Waiting
            </span>
          </div>

          <div className="grid gap-4 p-6 sm:grid-cols-3">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wider text-slate-400">
                Source
              </p>

              <p className="mt-2 font-medium text-slate-700">
                Business Dataset
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wider text-slate-400">
                Access
              </p>

              <p className="mt-2 font-medium text-slate-700">
                API / Semantic Layer
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wider text-slate-400">
                Status
              </p>

              <p className="mt-2 font-medium text-amber-600">
                Waiting for backend
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  function renderIntegrations() {
    return (
      <section className="mx-auto w-full max-w-[1000px]">
        <div className="mb-7">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-500">
            Connections
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-800">
            Integrations
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Monitor the services connected to MetricMind.
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <Icon name="plug" size={24} />
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-slate-800">
                  AI / Chat API
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  MetricMind frontend chat endpoint.
                </p>
              </div>

              <span className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Connected
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Icon name="database" size={24} />
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-slate-800">
                  Semantic Layer
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Provides business metrics and query results.
                </p>
              </div>

              <span className="flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-600">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                Unavailable
              </span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  function renderSettings() {
    return (
      <section className="mx-auto w-full max-w-[1000px]">
        <div className="mb-7">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Configuration
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-800">
            Settings
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Manage your MetricMind workspace preferences.
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-slate-800">
              Workspace
            </h3>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Workspace Name
                </label>

                <input
                  value="MetricMind"
                  readOnly
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Role
                </label>

                <input
                  value="Analyst"
                  readOnly
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-slate-800">
              Interface
            </h3>

            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    Show visualization
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Display charts when returned data supports them.
                  </p>
                </div>

                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <Icon name="check" size={17} />
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    API details
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Show API and SQL details on responses.
                  </p>
                </div>

                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <Icon name="check" size={17} />
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  function ChatInput() {
    return (
      <form
        onSubmit={sendMessage}
        className="mt-8 w-full max-w-[760px]"
      >
        <div className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_10px_40px_rgba(15,23,42,0.08)] focus-within:border-violet-300 focus-within:ring-4 focus-within:ring-violet-100">
          <button
            type="button"
            className="mb-1 rounded-xl p-3 text-slate-400 hover:bg-slate-100"
          >
            <Icon name="paperclip" size={19} />
          </button>

          <textarea
            value={input}
            onChange={(event) =>
              setInput(event.target.value)
            }
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder={
              messages.length === 0
                ? "Ask a question about your business data..."
                : "Ask another question..."
            }
            className="max-h-32 min-h-[48px] flex-1 resize-none bg-transparent px-2 py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />

          <button
            type="button"
            className="mb-1 rounded-xl p-3 text-slate-400 hover:bg-slate-100"
          >
            <Icon name="mic" size={19} />
          </button>

          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="mb-1 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 text-white shadow-lg transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Icon name="send" size={19} />
          </button>
        </div>

        {messages.length === 0 && (
          <p className="mt-3 text-center text-xs text-slate-400">
            Press Enter to send · Shift + Enter for a new line
          </p>
        )}
      </form>
    );
  }

  function renderChat() {
    return (
      <section className="flex flex-1 flex-col">
        {messages.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center pb-10">
            <img
              src="https://aietta.ac.in/assets/images/uploads/Cheerful_3D_Analytics_Dashboard_Illustration.png"
              alt="MetricMind analytics illustration"
              className="h-auto w-[620px] max-w-[92vw] object-contain"
            />

            <h2 className="mt-2 text-center text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">
              Ask MetricMind anything
            </h2>

            <p className="mt-3 text-center text-sm leading-6 text-slate-500 sm:text-base">
              Turn your business data into clear answers and insights.
            </p>

            <ChatInput />
          </div>
        ) : (
          <>
            <div className="mx-auto w-full max-w-[950px] flex-1 space-y-6 pb-8">
              {messages.map((message, index) => {
                const chartData = message.data
                  ? getChartData(message.data)
                  : null;

                return (
                  <div
                    key={index}
                    className={
                      message.role === "user"
                        ? "flex justify-end"
                        : "flex justify-start"
                    }
                  >
                    {message.role === "user" ? (
                      <div className="group relative max-w-[80%] rounded-2xl rounded-br-md bg-gradient-to-br from-violet-600 to-blue-600 px-5 py-3.5 text-sm leading-6 text-white shadow-lg">
                        {message.content}

                        <button
                          type="button"
                          onClick={() =>
                            pinMessage(message.content)
                          }
                          title={
                            isPinned(
                              `chat-${message.content
                                .toLowerCase()
                                .replace(
                                  /[^a-z0-9]+/g,
                                  "-"
                                )
                                .slice(0, 60)}`
                            )
                              ? "Unpin"
                              : "Pin"
                          }
                          className="absolute -left-10 top-2 hidden rounded-lg border border-slate-200 bg-white p-2 text-slate-500 shadow-sm group-hover:block"
                        >
                          <Icon
                            name={
                              isPinned(
                                `chat-${message.content
                                  .toLowerCase()
                                  .replace(
                                    /[^a-z0-9]+/g,
                                    "-"
                                  )
                                  .slice(0, 60)}`
                              )
                                ? "unpin"
                                : "pin"
                            }
                            size={15}
                          />
                        </button>
                      </div>
                    ) : (
                      <div className="w-full max-w-[90%] rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-start gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 text-sm font-bold text-white">
                            M
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-violet-500">
                              MetricMind
                            </p>

                            <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
                              {message.content}
                            </p>
                          </div>
                        </div>

                        {message.data &&
                          message.data.length > 0 && (
                            <div className="mt-6">
                              <div className="mb-3 flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-slate-800">
                                  Results
                                </h3>

                                <span className="text-xs text-slate-400">
                                  {message.data.length} rows
                                </span>
                              </div>

                              <div className="overflow-hidden rounded-xl border border-slate-200">
                                <div className="overflow-x-auto">
                                  <table className="w-full min-w-[560px] text-left text-sm">
                                    <thead className="bg-slate-50">
                                      <tr>
                                        {Object.keys(
                                          message.data[0]
                                        ).map((key) => (
                                          <th
                                            key={key}
                                            className="border-b border-slate-200 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500"
                                          >
                                            {key}
                                          </th>
                                        ))}
                                      </tr>
                                    </thead>

                                    <tbody>
                                      {message.data.map(
                                        (row, rowIndex) => (
                                          <tr
                                            key={rowIndex}
                                            className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                                          >
                                            {Object.keys(
                                              message.data?.[0] || {}
                                            ).map((key) => (
                                              <td
                                                key={key}
                                                className="px-4 py-3 text-slate-700"
                                              >
                                                {formatCell(
                                                  row[key]
                                                )}
                                              </td>
                                            ))}
                                          </tr>
                                        )
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          )}

                        {chartData && (
                          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                            <h3 className="mb-4 text-sm font-semibold text-slate-800">
                              Visualization
                            </h3>

                            <div className="h-[300px] w-full">
                              <ResponsiveContainer
                                width="100%"
                                height="100%"
                              >
                                <BarChart
                                  data={chartData}
                                  margin={{
                                    top: 10,
                                    right: 10,
                                    left: 0,
                                    bottom: 20,
                                  }}
                                >
                                  <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                  />

                                  <XAxis
                                    dataKey="label"
                                    tick={{ fontSize: 11 }}
                                  />

                                  <YAxis
                                    tick={{ fontSize: 11 }}
                                  />

                                  <Tooltip />

                                  <Bar
                                    dataKey="value"
                                    radius={[
                                      6,
                                      6,
                                      0,
                                      0,
                                    ]}
                                    fill="#7c3aed"
                                  />
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                        )}

                        <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                          <button
                            type="button"
                            onClick={() => {
                              setLastQuestion(
                                messages
                                  .slice(0, index + 1)
                                  .reverse()
                                  .find(
                                    (item) =>
                                      item.role === "user"
                                  )?.content || ""
                              );

                              setLastApiResponse(
                                message.apiResponse ||
                                  null
                              );

                              setShowApiModal(true);
                            }}
                            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
                          >
                            <Icon name="code" size={14} />
                            View API Call
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setLastSql(
                                message.sql || ""
                              );
                              setShowSqlModal(true);
                            }}
                            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
                          >
                            <Icon name="code" size={14} />
                            View SQL
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              navigator.clipboard?.writeText(
                                message.content
                              )
                            }
                            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
                          >
                            <Icon name="copy" size={14} />
                            Copy
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 text-xs font-bold text-white">
                        M
                      </div>

                      <div className="flex gap-1">
                        <span className="h-2 w-2 animate-bounce rounded-full bg-violet-400" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-violet-400 [animation-delay:150ms]" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-violet-400 [animation-delay:300ms]" />
                      </div>

                      <span className="text-xs text-slate-400">
                        Analyzing your data...
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 mx-auto w-full max-w-[950px] bg-[#f7f8fc] pb-4 pt-3">
              <ChatInput />
            </div>
          </>
        )}
      </section>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f8fc] text-slate-800">
      {mobileSidebar && (
        <button
          type="button"
          onClick={() => setMobileSidebar(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-[270px] flex-col bg-[#101329] text-white transition-transform ${
          mobileSidebar
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex h-[78px] items-center justify-between border-b border-white/10 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 text-lg font-bold">
              M
            </div>

            <div>
              <h1 className="text-[17px] font-bold">
                MetricMind
              </h1>

              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
                Semantic BI
              </p>
            </div>
          </div>

          <button
            onClick={() => setMobileSidebar(false)}
            className="lg:hidden"
          >
            <Icon name="close" size={19} />
          </button>
        </div>

        <div className="px-4 pt-5">
          <button
            onClick={startNewChat}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-3 text-sm font-semibold"
          >
            <Icon name="plus" size={18} />
            New Chat
          </button>
        </div>

        <nav className="mt-6 px-3">
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Workspace
          </p>

          <button
            onClick={() => openPage("analytics")}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm ${
              currentPage === "analytics"
                ? "bg-white/10 font-medium text-white"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Icon name="chart" size={18} />
            Analytics
          </button>

          <button
            onClick={() => openPage("sources")}
            className={`mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm ${
              currentPage === "sources"
                ? "bg-white/10 font-medium text-white"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Icon name="database" size={18} />
            Data Sources
          </button>

          <button
            onClick={() => openPage("integrations")}
            className={`mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm ${
              currentPage === "integrations"
                ? "bg-white/10 font-medium text-white"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Icon name="plug" size={18} />
            Integrations
          </button>

          <button
            onClick={() => openPage("settings")}
            className={`mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm ${
              currentPage === "settings"
                ? "bg-white/10 font-medium text-white"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Icon name="settings" size={18} />
            Settings
          </button>
        </nav>

        {/* PINNED */}
        <div className="mt-7 px-3">
          <div className="mb-2 flex items-center justify-between px-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Pinned
            </p>

            {pinnedItems.length > 0 && (
              <span className="text-[10px] text-slate-600">
                {pinnedItems.length}
              </span>
            )}
          </div>

          {pinnedItems.length === 0 ? (
            <p className="px-3 text-xs leading-5 text-slate-600">
              Pin important questions to keep them here.
            </p>
          ) : (
            pinnedItems.map((item) => (
              <div
                key={item.id}
                className="group flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-white/5"
              >
                <button
                  onClick={() => {
                    sendMessage(
                      undefined,
                      item.question
                    );
                  }}
                  className="flex min-w-0 flex-1 items-center gap-3 text-left text-sm text-slate-300"
                >
                  <Icon name="pin" size={16} />

                  <span className="truncate">
                    {item.title}
                  </span>
                </button>

                <button
                  type="button"
                  title="Unpin"
                  onClick={() =>
                    togglePin(item)
                  }
                  className="rounded-lg p-1.5 text-slate-500 opacity-0 transition hover:bg-white/10 hover:text-white group-hover:opacity-100"
                >
                  <Icon name="unpin" size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* QUICK PIN OPTIONS */}
        <div className="mt-4 px-3">
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Suggested
          </p>

          <div className="space-y-1">
            <div className="group flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-white/5">
              <button
                onClick={() =>
                  sendMessage(
                    undefined,
                    "Show sales by region"
                  )
                }
                className="flex min-w-0 flex-1 items-center gap-3 text-left text-sm text-slate-400 hover:text-white"
              >
                <Icon name="chart" size={16} />

                <span className="truncate">
                  Sales Overview
                </span>
              </button>

              <button
                type="button"
                title={
                  isPinned("sales-overview")
                    ? "Unpin"
                    : "Pin"
                }
                onClick={() =>
                  togglePin({
                    id: "sales-overview",
                    title: "Sales Overview",
                    question:
                      "Show sales by region",
                  })
                }
                className="rounded-lg p-1.5 text-slate-500 hover:bg-white/10 hover:text-white"
              >
                <Icon
                  name={
                    isPinned("sales-overview")
                      ? "unpin"
                      : "pin"
                  }
                  size={14}
                />
              </button>
            </div>

            <div className="group flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-white/5">
              <button
                onClick={() =>
                  sendMessage(
                    undefined,
                    "Show revenue by country"
                  )
                }
                className="flex min-w-0 flex-1 items-center gap-3 text-left text-sm text-slate-400 hover:text-white"
              >
                <Icon name="chart" size={16} />

                <span className="truncate">
                  Revenue Analysis
                </span>
              </button>

              <button
                type="button"
                title={
                  isPinned("revenue-analysis")
                    ? "Unpin"
                    : "Pin"
                }
                onClick={() =>
                  togglePin({
                    id: "revenue-analysis",
                    title: "Revenue Analysis",
                    question:
                      "Show revenue by country",
                  })
                }
                className="rounded-lg p-1.5 text-slate-500 hover:bg-white/10 hover:text-white"
              >
                <Icon
                  name={
                    isPinned("revenue-analysis")
                      ? "unpin"
                      : "pin"
                  }
                  size={14}
                />
              </button>
            </div>
          </div>
        </div>

        {/* RECENT CHATS */}
        <div className="mt-5 flex-1 overflow-y-auto px-3">
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Recent Chats
          </p>

          {messages.filter(
            (message) => message.role === "user"
          ).length > 0 ? (
            messages
              .filter(
                (message) => message.role === "user"
              )
              .slice(-5)
              .reverse()
              .map((message, index) => {
                const id = `chat-${message.content
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")
                  .slice(0, 60)}`;

                return (
                  <div
                    key={`${id}-${index}`}
                    className="group flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-white/5"
                  >
                    <button
                      onClick={() => {
                        setInput(message.content);
                        setCurrentPage("chat");
                        setMobileSidebar(false);
                      }}
                      className="flex min-w-0 flex-1 items-center gap-3 text-left text-sm text-slate-400 hover:text-white"
                    >
                      <Icon
                        name="clock"
                        size={16}
                      />

                      <span className="truncate">
                        {message.content}
                      </span>
                    </button>

                    <button
                      type="button"
                      title={
                        isPinned(id)
                          ? "Unpin"
                          : "Pin"
                      }
                      onClick={() =>
                        togglePin({
                          id,
                          title: message.content,
                          question: message.content,
                        })
                      }
                      className="rounded-lg p-1.5 text-slate-500 hover:bg-white/10 hover:text-white"
                    >
                      <Icon
                        name={
                          isPinned(id)
                            ? "unpin"
                            : "pin"
                        }
                        size={14}
                      />
                    </button>
                  </div>
                );
              })
          ) : (
            <p className="px-3 text-xs text-slate-600">
              No recent chats
            </p>
          )}
        </div>

        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-blue-500 text-sm font-bold">
              N
            </div>

            <div className="flex-1">
              <p className="text-sm font-medium">
                Naseema
              </p>

              <p className="text-xs text-slate-500">
                Analyst
              </p>
            </div>

            <span className="h-2 w-2 rounded-full bg-emerald-400" />
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="min-h-screen lg:ml-[270px]">
        <header className="sticky top-0 z-30 flex h-[78px] items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebar(true)}
              className="rounded-xl border border-slate-200 p-2 lg:hidden"
            >
              <Icon name="menu" size={20} />
            </button>

            <div className="relative hidden sm:block">
              <div className="absolute left-3 top-3 text-slate-400">
                <Icon name="search" size={17} />
              </div>

              <input
                placeholder="Ask questions about your data"
                className="w-[260px] rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:bg-white"
              />
            </div>

            <div className="sm:hidden">
              <p className="font-semibold">
                MetricMind
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-600 sm:flex">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Connected
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-blue-500 text-sm font-bold text-white">
              N
            </div>
          </div>
        </header>

        <div className="mx-auto flex min-h-[calc(100vh-78px)] w-full max-w-[1180px] flex-col px-4 py-6 sm:px-6 lg:px-8">
          {currentPage === "chat" &&
            renderChat()}

          {currentPage === "analytics" &&
            renderAnalytics()}

          {currentPage === "sources" &&
            renderSources()}

          {currentPage === "integrations" &&
            renderIntegrations()}

          {currentPage === "settings" &&
            renderSettings()}
        </div>

        {/* API MODAL */}
        {showApiModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
            <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">
                    API Call
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    Request sent from MetricMind frontend
                  </p>
                </div>

                <button
                  onClick={() =>
                    setShowApiModal(false)
                  }
                  className="rounded-lg p-2 hover:bg-slate-100"
                >
                  <Icon name="close" size={19} />
                </button>
              </div>

              <div className="space-y-5 p-6">
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Method
                  </p>

                  <span className="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-600">
                    POST
                  </span>
                </div>

                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Endpoint
                  </p>

                  <div className="rounded-xl bg-slate-900 px-4 py-3 font-mono text-sm text-emerald-400">
                    /api/chat
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Request Body
                  </p>

                  <pre className="overflow-auto rounded-xl bg-slate-900 p-4 text-sm text-slate-200">
{JSON.stringify(
  {
    question: lastQuestion,
  },
  null,
  2
)}
                  </pre>
                </div>

                {lastApiResponse && (
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Response
                    </p>

                    <pre className="max-h-[220px] overflow-auto rounded-xl bg-slate-900 p-4 text-xs text-slate-200">
{JSON.stringify(
  lastApiResponse,
  null,
  2
)}
                    </pre>
                  </div>
                )}
              </div>

              <div className="flex justify-end border-t border-slate-200 px-6 py-4">
                <button
                  onClick={() =>
                    setShowApiModal(false)
                  }
                  className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-medium text-white"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SQL MODAL */}
        {showSqlModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
            <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">
                    Generated SQL
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    SQL returned by MetricMind API
                  </p>
                </div>

                <button
                  onClick={() =>
                    setShowSqlModal(false)
                  }
                  className="rounded-lg p-2 hover:bg-slate-100"
                >
                  <Icon name="close" size={19} />
                </button>
              </div>

              <div className="p-6">
                {lastSql ? (
                  <pre className="max-h-[400px] overflow-auto rounded-xl bg-slate-900 p-5 font-mono text-sm leading-6 text-emerald-400">
                    {lastSql}
                  </pre>
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                    <p className="text-sm font-medium text-slate-600">
                      SQL is not available yet.
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Backend needs to return a SQL field.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end border-t border-slate-200 px-6 py-4">
                <button
                  onClick={() =>
                    setShowSqlModal(false)
                  }
                  className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-medium text-white"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}