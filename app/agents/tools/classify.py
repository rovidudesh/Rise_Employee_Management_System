from app.utils.llm import llm_call
from app.agents.state import AgentState

def classify_query(state: AgentState):
    last_msg = state["messages"][-1].content
    prompt = f"""
Classify this query into one of the following categories:

- "retrieve_updates" → if the query asks about an employee's work or updates.
- "assign_task" → if it mentions assigning a task to someone.
- "create_user" → if it asks to add or register a new user (e.g., employee).
- "submit_update" → if it describes work done by the person, as a progress update.
- "other" → if it doesn’t clearly match any of the above.

Query: "{last_msg}"
Only return one of: retrieve_updates, assign_task, add_comment, create_user, submit_update, other
"""
    query_type = llm_call(prompt).strip().lower()
    return {"query_type": query_type}
