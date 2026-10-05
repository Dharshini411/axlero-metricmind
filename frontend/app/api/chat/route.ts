import { NextResponse } from "next/server";
import { API_URL } from "@/mock/api";
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const contentType = response.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      const text = await response.text();

      console.error("Upstream API returned non-JSON:", text);

      return NextResponse.json(
        {
          error: "API did not return JSON",
          status: response.status,
        },
        { status: 502 }
      );
    }

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("API proxy error:", error);

    return NextResponse.json(
      {
        error: "Failed to connect to AI API",
      },
      {
        status: 500,
      }
    );
  }
}