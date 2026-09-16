"use client";

import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  const sendMessage = () => {
  if (!message.trim()) return;

  setMessages([...messages, message]);
  setMessage("");
};

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">
          MetricMind
        </h1>
        <p className="text-sm text-gray-500">
          Agentic Semantic BI Engine
        </p>
      </header>

      {/* Chat Area */}
      <div className="flex-1 max-w-4xl w-full mx-auto p-6">
        <div className="bg-white rounded-xl shadow-sm border min-h-[500px] p-6">
          
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-[400px] text-gray-500">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-800">
                  Welcome to MetricMind
                </h2>
                <p className="mt-2">
                  Ask a question about your business data.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className="flex justify-end"
                >
                  <div className="bg-black text-white rounded-lg px-4 py-3 max-w-[70%]">
                    {msg}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t p-4">
        <div className="max-w-4xl mx-auto flex gap-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
            placeholder="Ask MetricMind a question..."
            className="flex-1 border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-gray-400"
          />

          <button
            onClick={sendMessage}
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
          >
            Send
          </button>
        </div>
      </div>
    </main>
  );
}