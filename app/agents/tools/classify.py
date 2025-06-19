from utils.llm import AgentState, llm_call


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
