from app.utils.llm import llm_call
from app.agents.state import AgentState



def classify_query(state: AgentState):
    last_msg = state["messages"][-1].content
    prompt = f"""
    Classify this query:
    - "retrieve_updates" (asks about daily work/daily updates)
    - "assign_task" (mentions task assignment)
    - "add_comment" (mentions feedback or commenting)
    
    Query: {last_msg}
    Only return the classification.
    """
    query_type = llm_call(prompt)
    return {"query_type": query_type}
