from services.llm import llm

def architect(state):

    product_plan = state["product_plan"]

    prompt = f"""
You are a Principal Software Architect.

Product Requirements:
{product_plan}

Rules:

- Assume a small startup with 1-3 developers.
- Optimize for simplicity and fast development.
- Avoid microservices unless absolutely necessary.
- Prefer monolith architecture for MVPs.
- Prefer low-cost deployment.
- If AI/ML features are present, prefer Python ecosystem tools.
- Prefer technologies that integrate naturally with LangGraph and LangChain.

Decide:

1. Architecture Style
2. Backend Framework
3. Frontend Framework
4. Database
5. Deployment Strategy

For each decision give a short reason.

Keep answer under 250 words.
"""

    result = llm.invoke(prompt)

    return {
        "architecture_plan": result.content
    }