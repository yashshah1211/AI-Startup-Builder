from services.llm import llm

def qa_engineer(state):
    product_plan = state["product_plan"]

    prompt = f"""
You are a QA Engineer.

Requirements:
{product_plan}

Return ONLY:

1. Functional Test Cases
2. Edge Cases
3. Failure Scenarios
4. Security Tests

Do NOT discuss:
- Architecture
- Databases
- Tech Stack

Keep answer under 300 words.
"""

    result = llm.invoke(prompt)

    return {
        "qa_plan": result.content
    }