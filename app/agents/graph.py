from langgraph.graph import StateGraph, END, START
from app.agents.state import AgentState
from langgraph.checkpoint.memory import MemorySaver


# Tools
from app.agents.tools.classify import classify_query
from app.agents.tools.retrieve_update import retrieve_updates
from app.agents.tools.assign_task import assign_task
from app.agents.tools.extract_info import extract_info
from app.agents.tools.other import other_task
from app.agents.tools.add_user import create_user
from app.agents.tools.employee_update import submit_update
from app.agents.tools.memory import handle_memory_node  # 🧠 new import

memory = MemorySaver()

# LangGraph setup
graph = StateGraph(AgentState)

# Add nodes
graph.add_node("memory", handle_memory_node)  # 🧠 New memory node
graph.add_node("extract_info", extract_info)
graph.add_node("classify_query", classify_query)
graph.add_node("retrieve_updates", retrieve_updates)
graph.add_node("assign_task", assign_task)
graph.add_node("other", other_task)
graph.add_node("create_user", create_user)
graph.add_node("submit_update", submit_update)

# Start → memory → extract_info → classify_query
graph.add_edge(START, "memory")                # 🧠 first
graph.add_edge("memory", "extract_info")
graph.add_edge("extract_info", "classify_query")

# Classify → route to tools
def router(state: AgentState):
    return state["query_type"]

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

# Tool outputs → END
graph.add_edge("assign_task", END)
graph.add_edge("other", END)
graph.add_edge("create_user", END)
graph.add_edge("submit_update", END)
graph.add_edge("retrieve_updates", END)

# Compile
chatbot_agent3 = graph.compile()