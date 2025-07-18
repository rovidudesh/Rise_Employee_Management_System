from datetime import datetime
from sqlalchemy.orm import Session
from app.models import ChatMessage
from app.utils.llm import llm_call
from langchain_core.messages import HumanMessage, BaseMessage
from app.database import SessionLocal  # this is your DB session creator


def handle_memory_node(state: dict) -> dict:
    """
    LangGraph-compatible memory node.
    Internally creates a DB session and uses it.
    """
    db = SessionLocal()

    session_id = state.get("session_user_id")
    messages: list[BaseMessage] = state.get("messages", [])

    if not session_id or not messages:
        raise ValueError("Missing session ID or messages in agent state")

    new_message = messages[-1]
    if not isinstance(new_message, HumanMessage):
        raise ValueError("Last message must be a HumanMessage")

    user_input = new_message.content

    # Step 1: Get all previous messages (excluding this new one)
    previous_msgs = db.query(ChatMessage)\
        .filter(ChatMessage.session_id == session_id)\
        .order_by(ChatMessage.timestamp.asc()).all()

    history_lines = [f"{msg.sender.capitalize()}: {msg.message}" for msg in previous_msgs]
    history_text = "\n".join(history_lines) if history_lines else "No previous messages."

    # Step 2: Summarize with Gemini
    prompt = f"""
You are a summarizer assistant for an employee management chatbot system.

The user may interact over multiple turns, sometimes trying different ways to express the same request or refining information over time.

Your job is to:
- Understand what the user is currently trying to do (e.g., add user, assign task, retrieve updates, submit update).
- Focus **only on the last 3–5 messages** in the conversation. Prioritize the **most recent valid data** — ignore earlier conflicting or incomplete ones.
- Identify and remember any critical entities:
    - 👤 Name(s) of employees/managers
    - 🏢 Role (Admin, Manager, Employee)
    - 🛠️ Tasks (titles, descriptions, due dates)
    - 📅 Dates (like today, or explicit dates)
    - 🧑‍💼 Team (Software, HR, Operations, etc.)
    - 📓 Daily updates (summary of what they did)

Below is the recent conversation history between the user and the assistant (most recent last):

Conversation:
{history_text}

⬇️ Please return a **clear summary** of:
1. What the user is trying to do.
2. What relevant information has been provided.
3. Any missing fields the assistant may still need.

Example format:
- Intent: Create user
- Provided: Name: Jake James, Role: Employee, Team: HR
- Missing: None

or

- Intent: Assign task
- Provided: To: Alex, Title: Finalize Report, Due: July 18
- Missing: Task description

Keep the summary concise and structured. Do NOT explain or speculate.
"""

    
    try:
        summary = llm_call(prompt).strip()
    except Exception as e:
        summary = "⚠️ Failed to generate summary."
        print(f"[SUMMARY ERROR] {e}")

    # Step 3: Save the new message
    db.add(ChatMessage(
        session_id=session_id,
        user_id=new_message.additional_kwargs.get("user_id"),  # optional
        sender="user",
        message=user_input,
        timestamp=datetime.utcnow()
    ))
    db.commit()

    
    print(f"[SUMMARY] Summary generated: {summary}")
    # Step 4: Return updated state
    state["memory_summary"] = summary
    return state
