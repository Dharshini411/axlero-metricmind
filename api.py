
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from agent import run_agent


app = FastAPI()


# Allow the Next.js frontend to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    question: str


@app.get("/")
def root():
    return {
        "status": "ok",
        "message": "MetricMind AI Agent API is running"
    }


@app.post("/api/chat")
def chat(request: ChatRequest):

    result = run_agent(request.question)

    return {
        "question": request.question,
        "type": result["type"],
        "answer": result["answer"]
    }

