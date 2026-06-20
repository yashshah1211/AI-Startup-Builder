from services.llm import llm

def backend_engineer(state):
    idea = state["idea"]
    product_plan = state["product_plan"]
    architecture_plan = state["architecture_plan"]
    review_notes = state["review_notes"]

    prompt = f"""
You are a Senior Backend Engineer.

Product Requirements:
{product_plan}

Architecture Decisions:
{architecture_plan}

Review Notes:
{review_notes}

Generate:

1. Backend Architecture
2. Database Schema
3. API Endpoints
4. Folder Structure

Follow the architect decisions and reviewer feedback.

Keep under 500 words.
"""

    result = llm.invoke(prompt)

    return {
        "backend_plan": result.content
    }