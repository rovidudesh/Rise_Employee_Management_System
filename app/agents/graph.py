from langgraph.graph import StateGraph, END, START
from app.agents.state import AgentState
from app.agents.tools.classify import classify_query
from app.agents.tools.retrieve_update import retrieve_updates
from app.agents.tools.assign_task import assign_task
from app.agents.tools.add_comment import add_comment
from app.agents.tools.extract_info import extract_info
from app.agents.tools.other import other_task
from app.agents.tools.add_user import create_user
from app.agents.tools.employee_update import submit_update


# Define the graph
graph = StateGraph(AgentState)

# Add nodes
graph.add_node("extract_info", extract_info)
graph.add_node("classify_query", classify_query)
graph.add_node("retrieve_updates", retrieve_updates)
graph.add_node("assign_task", assign_task)
graph.add_node("add_comment", add_comment)
graph.add_node("other", other_task)
graph.add_node("create_user", create_user)
graph.add_node("submit_update", submit_update)

# Start → extract_info → classify_query
graph.add_edge(START, "extract_info")
graph.add_edge("extract_info", "classify_query")

# Routing function for classification
def router(state: AgentState):
    return state["query_type"]

# Classification → conditional routing
graph.add_conditional_edges(
    "classify_query",
    router,
    {
        "assign_task": "assign_task",
        "retrieve_updates": "retrieve_updates",
        "other": "other",
        "create_user": "create_user",
        "submit_update": "submit_update"
    }
)

# Branches
graph.add_edge("assign_task", END)
graph.add_edge("other", END)
graph.add_edge("create_user", END)
graph.add_edge("submit_update", END)


# Retrieve updates → could go to add_comment or end
def post_retrieve_router(state: AgentState):
    return state.get("add_comment_required", False)

# Conditional routing after retrieve_updates
graph.add_conditional_edges(
    "retrieve_updates",
    post_retrieve_router,
    {
        True: "add_comment",
        False: END
    }
)

# add_comment always ends
graph.add_edge("add_comment", END)

# Compile graph
chatbot_agent = graph.compile()
