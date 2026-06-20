from services.llm import llm

def reviewer(state):

    architecture_plan = state["architecture_plan"]

    prompt = f"""
    You are a Senior Engineering Reviewer.

    Architecture Proposal:
    {architecture_plan}

    Review it and provide:

    1. Strengths
    2. Weaknesses
    3. Risks
    4. Recommended Improvements

    Keep answer under 250 words.
    """

    result = llm.invoke(prompt)

    return {
        "review_notes": result.content
    }