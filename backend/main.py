from fastapi import FastAPI
from pydantic import BaseModel

from graph.workflow import app as workflow_app
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173",
                   "https://YOUR-VERCEL-APP.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class IdeaRequest(BaseModel):
    idea: str


@app.get("/")
def home():
    return {"message": "Multi-Agent Team API Running"}


@app.post("/generate-project")
def generate_project(request: IdeaRequest):

    result = workflow_app.invoke({
        "idea": request.idea
    })

    return result