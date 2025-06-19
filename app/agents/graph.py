from langgraph.graph import StateGraph, END, START
from utils.llm import AgentState
from tools.classify import classify_query
from tools.retrieve_update import retrieve_updates
from tools.assign_task import assign_task
from tools.add_comment import add_comment

# Define the graph
graph = StateGraph(AgentState)  # Use StateGraph, not just Graph()

# Add nodes
graph.add_node("classify_query", classify_query)
graph.add_node("retrieve_updates", retrieve_updates)
graph.add_node("assign_task", assign_task)
graph.add_node("add_comment", add_comment)

graph.add_edge(START, "classify_query")


# Routing function
def router(state: AgentState):
    return state["query_type"]

# Add conditional edges (branches)
graph.add_conditional_edges(
    "classify_query",
    lambda state: state["query_type"],  # This should return one of the node names
    {
        "retrieve_updates": "retrieve_updates",
        "assign_task": "assign_task", 
        "add_comment": "add_comment"
    }
)

# Connect tools to END
graph.add_edge("retrieve_updates", END)
graph.add_edge("assign_task", END)
graph.add_edge("add_comment", END)

# Start the graph
graph.add_edge(START, "classify_query")

# Compile it
agent4 = graph.compile()