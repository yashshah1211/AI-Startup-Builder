from services.llm import llm

def frontend_engineer(state):
    idea = state["idea"]
    product_plan = state["product_plan"]
    architecture_plan = state["architecture_plan"]
    review_notes = state["review_notes"]

    prompt = f"""
You are a Senior Frontend Engineer.

Product Requirements:
{product_plan}

Architecture Decisions:
{architecture_plan}

Review Notes:
{review_notes}

Generate:

1. Pages
2. Components
3. User Flow
4. Frontend Tech Stack

Follow architect decisions and reviewer feedback.

Keep under 500 words.
"""

  

    result = llm.invoke(prompt)

    return {
        "frontend_plan": result.content
    }