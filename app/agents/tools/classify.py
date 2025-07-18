from app.utils.llm import llm_call
from app.agents.state import AgentState
from app.database import SessionLocal
from app.models import User

def classify_query(state: AgentState) -> AgentState:
    user_input = state["messages"][-1].content
    memory_summary = state.get("memory_summary", "")
    session_user_id = state.get("session_user_id")

    # 🧠 Step 1: Get role from DB based on session_user_id
    db = SessionLocal()
    user = db.query(User).filter_by(id=session_user_id).first()
    session_role = user.role.lower() if user and user.role else ""
    db.close()

    if not session_role:
        print("⚠️ Warning: session_role is missing or not found for user.")
    
    # 🔐 Step 2: Map allowed tools for each role
    role_tool_map = {
        "admin": ["create_user", "other"],
        "manager": ["assign_task", "retrieve_updates", "other"],
        "employee": ["submit_update", "other"]
    }

    # Tool descriptions (more detailed)
    tool_descriptions = {
        "create_user": "Register a new employee or user (e.g., when user says 'add new intern', 'register team member', 'create a user')",
        "assign_task": "Assign a task to employees (e.g., when user says 'give task', 'assign work to Ramesh', 'new task for team')",
        "retrieve_updates": "View employee updates (e.g., when user says 'see today's update', 'get what Ramesh did', 'check report')",
        "submit_update": "Submit your own daily work update (e.g., when user says 'today I worked on...', 'submit my update')",
        "other": "None of the above fits clearly"
    }

    available_tools = role_tool_map.get(session_role, ["other"])

    print(f"[CLASSIFY] Available tools for role '{session_role}': {available_tools}")

    # 🧾 Step 3: Classify using summary + message
    classification_prompt = f"""
You are an intelligent assistant in an employee management system.

The current user's role is **{session_role}**, so they are allowed to perform ONLY the following actions:

{chr(10).join(f"- `{tool}`: {tool_descriptions[tool]}" for tool in available_tools)}

Now analyze the combined conversation context and classify the intent.

🧠 Previous Summary:
{memory_summary}

🗣️ Latest User Message:
{user_input}

--- 
Respond with just **one** of these keywords: {', '.join(f"`{tool}`" for tool in available_tools)}
"""

    result = llm_call(classification_prompt).strip().lower()
    print(f"[CLASSIFY] User intent classified as: {result}")

    state["query_type"] = result if result in available_tools else "other"
    return state
