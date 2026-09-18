"use client";

import { useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Home() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    const question = message.trim();

    if (!question || loading) {
      return;
    }

    setMessages((current) => [
      ...current,
      {
        role: "user",
        content: question,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "API request failed");
      }

      const answer =
        data.answer ||
        data.response ||
        JSON.stringify(data, null, 2);

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: answer,
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: "API connection failed. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white border-b px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">
          MetricMind
        </h1>

        <p className="text-sm text-gray-500">
          Agentic Semantic BI Engine
        </p>
      </header>

      <div className="flex-1 w-full max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-sm border min-h-[500px] p-6">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-[400px]">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-800">
                  Welcome to MetricMind
                </h2>

                <p className="mt-2 text-gray-500">
                  Ask a question about your business data.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={
                    msg.role === "user"
                      ? "flex justify-end"
                      : "flex justify-start"
                  }
                >
                  <div
                    className={
                      msg.role === "user"
                        ? "bg-black text-white rounded-lg px-4 py-3 max-w-[70%] whitespace-pre-wrap"
                        : "bg-gray-100 text-gray-900 rounded-lg px-4 py-3 max-w-[80%] whitespace-pre-wrap"
                    }
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-500 rounded-lg px-4 py-3">
                    Thinking...
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white border-t p-4">
        <div className="w-full max-w-4xl mx-auto flex gap-3">
          <input
            type="text"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                sendMessage();
              }
            }}
            placeholder="Ask MetricMind a question..."
            disabled={loading}
            className="flex-1 border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-gray-400 disabled:bg-gray-100"
          />

          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 disabled:bg-gray-400"
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </main>
  );
}
