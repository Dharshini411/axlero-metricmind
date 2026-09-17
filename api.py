from fastapi import FastAPI
from pydantic import BaseModel

from agent import run_agent


app = FastAPI()


class ChatRequest(BaseModel):
    question: str


@app.post("/api/chat")
def chat(request: ChatRequest):

    result = run_agent(request.question)

    return {
        "question": request.question,
        "query": result["query"],
        "data": result["data"]
    }