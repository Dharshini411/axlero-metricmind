"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type DataRow = Record<string, any>;

type Message = {
  role: "user" | "assistant";
  content: string;
  data?: DataRow[];
};

export default function Home() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  // Convert API data into table-friendly rows
  const extractData = (apiData: any): DataRow[] => {
    // Normal API response
    if (Array.isArray(apiData?.data)) {
      return apiData.data;
    }

    // If response is nested
    if (Array.isArray(apiData?.response?.data)) {
      return apiData.response.data;
    }

    // If answer contains lines like:
    // UK → revenue: 107079900.00
    // India → revenue: 105355000.00
    const answer =
      apiData?.answer ||
      apiData?.response ||
      "";

    if (typeof answer === "string") {
      const lines = answer.split("\n");

      const rows: DataRow[] = [];

      for (const line of lines) {
        const match = line.match(
          /^(.+?)\s*→\s*([^:]+):\s*([\d,.]+)$/
        );

        if (match) {
          rows.push({
            country: match[1].trim(),
            metric: match[2].trim(),
            value: Number(match[3].replace(/,/g, "")),
          });
        }
      }

      return rows;
    }

    return [];
  };

  const sendMessage = async () => {
    const question = message.trim();

    if (!question || loading) {
      return;
    }

    // Add user message
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

      const apiData = await response.json();

      if (!response.ok) {
        throw new Error(
          apiData.error || "API request failed"
        );
      }

      const answer =
        apiData.answer ||
        apiData.response ||
        "Here is the result:";

      const tableData = extractData(apiData);

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: answer,
          data: tableData,
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            "API connection failed. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data
  const getChartData = (data: DataRow[]) => {
    if (!Array.isArray(data) || data.length === 0) {
      return null;
    }

    const first = data[0];

    const keys = Object.keys(first);

    const labelKey = keys.find(
      (key) =>
        typeof first[key] === "string" &&
        key !== "metric"
    );

    const valueKey = keys.find(
      (key) =>
        typeof first[key] === "number" &&
        key !== "id"
    );

    if (!labelKey || !valueKey) {
      return null;
    }

    return data.map((item) => ({
      label: String(item[labelKey]),
      value: Number(item[valueKey]),
    }));
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

      {/* Chat area */}
      <div className="flex-1 w-full max-w-5xl mx-auto p-6">

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

            <div className="space-y-6">

              {messages.map((msg, index) => {

                const chartData =
                  msg.role === "assistant"
                    ? getChartData(msg.data || [])
                    : null;

                return (

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
                          : "bg-gray-100 text-gray-900 rounded-lg px-4 py-3 max-w-[90%]"
                      }
                    >

                      {/* Answer */}
                      <div className="whitespace-pre-wrap">
                        {msg.content}
                      </div>

                      {/* TABLE */}
                      {msg.role === "assistant" &&
                        msg.data &&
                        msg.data.length > 0 && (

                          <div className="mt-4 overflow-x-auto">

                            <table className="border-collapse border border-gray-300 text-sm w-full">

                              <thead>

                                <tr className="bg-gray-200">

                                  {Object.keys(msg.data[0]).map(
                                    (key) => (

                                      <th
                                        key={key}
                                        className="border border-gray-300 px-3 py-2 text-left font-semibold"
                                      >
                                        {key}
                                      </th>

                                    )
                                  )}

                                </tr>

                              </thead>

                              <tbody>

                                {msg.data.map(
                                  (row, rowIndex) => (

                                    <tr key={rowIndex}>

                                      {Object.keys(msg.data![0]).map(
                                        (key) => (

                                          <td
                                            key={key}
                                            className="border border-gray-300 px-3 py-2"
                                          >
                                            {String(row[key])}
                                          </td>

                                        )
                                      )}

                                    </tr>

                                  )
                                )}

                              </tbody>

                            </table>

                          </div>

                        )}

                      {/* CHART */}
                      {msg.role === "assistant" &&
                        chartData &&
                        chartData.length > 1 && (

                          <div className="mt-6 bg-white rounded-lg p-4 border">

                            <h3 className="font-semibold text-gray-800 mb-4">
                              Data Visualization
                            </h3>

                            <div className="w-full h-[350px]">

                              <ResponsiveContainer
                                width="100%"
                                height="100%"
                              >

                                <BarChart
                                  data={chartData}
                                >

                                  <CartesianGrid
                                    strokeDasharray="3 3"
                                  />

                                  <XAxis
                                    dataKey="label"
                                    tick={{ fontSize: 12 }}
                                  />

                                  <YAxis
                                    tick={{ fontSize: 12 }}
                                  />

                                  <Tooltip />

                                  <Bar
                                    dataKey="value"
                                    fill="#111827"
                                  />

                                </BarChart>

                              </ResponsiveContainer>

                            </div>

                          </div>

                        )}

                    </div>

                  </div>

                );
              })}

              {/* Loading */}
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

      {/* Input */}
      <div className="bg-white border-t p-4">

        <div className="w-full max-w-5xl mx-auto flex gap-3">

          <input
            type="text"
            value={message}
            onChange={(event) =>
              setMessage(event.target.value)
            }
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
