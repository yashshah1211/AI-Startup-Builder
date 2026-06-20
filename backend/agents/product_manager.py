from services.llm import llm

def product_manager(state):
    idea = state["idea"]

    prompt = f"""
You are a startup product manager.

Idea:
{state["idea"]}

Return:

1. Problem Statement
2. Target Users
3. Core Features
4. MVP Features
5. Success Metrics

Keep everything concise.
Maximum 200 words total.
Use bullet points.
"""

    result = llm.invoke(prompt)

    return {
        "product_plan": result.content
    }