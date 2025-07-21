from app.utils.llm import llm_call
from app.agents.state import AgentState
from app.database import SessionLocal 
from app.models import Task, User
from datetime import date, datetime


def assign_task(state: AgentState):
    print("Assigning task...")
    user_input = state["messages"][-1].content
    session_user_id = state.get("session_user_id")  # Logged-in manager
    today = datetime.today().date()

    # 🧠 Step 1: Extract fields
    extraction_prompt = f"""
You are a task-extracting assistant.

From the following instruction, extract:
1. Full name of the person receiving the task(capitalized the first letter of each name)
2. Task title(generate a short title from the user message)
3. A short description of the task (you can generate one if there's enough context)
4. Due date (in format YYYY-MM-DD). 
   If the message contains a relative date (e.g., "next Monday", "tomorrow", "this Friday"), 
   convert it into the correct absolute date based on today's date ({today}). 
   If no date is mentioned, leave it blank.
   
Only output the values in order, one per line.

Message:
\"{user_input}\"
"""
    response = llm_call(extraction_prompt)
    lines = [line.strip() for line in response.strip().splitlines() if line.strip()]
    print("🔍 Extracted lines:", lines)

    # Extract values or mark missing
    assigned_to_name = lines[0] if len(lines) >= 1 and lines[0].lower() != "none" else None
    title = lines[1] if len(lines) >= 2 and lines[1].lower() != "unspecified task" else None
    description = lines[2] if len(lines) >= 3 and lines[2].lower() != "no description provided" else None
    due_date_str = lines[3] if len(lines) >= 4 and lines[3] else None

    # 🔁 Fix: If description is provided but title is missing → regenerate title from description
    if description and not title:
        title_prompt = f"""
You are an assistant generating a title from a task description.

Description:
\"{description}\"

Provide a 2-4 word task title:
"""
        title = llm_call(title_prompt).strip()

    # 🧩 Collect what's still missing
    missing = []
    if not assigned_to_name:
        missing.append("the assignee's full name")
    if not description:
        missing.append("a brief task description")
    if not due_date_str:
        missing.append("a due date (e.g., 2025-07-20)")

    if missing:
        clarification_msg = (
            f"⚠️ I need a bit more info to assign the task properly.\n\n"
            f"Please provide: {', '.join(missing)}."
        )
        return {"retrieved_data": clarification_msg}

    # ✅ Step 2: Save task
    session = SessionLocal()
    assigner = session.query(User).filter_by(id=session_user_id).first()
    if not assigner:
        return {"retrieved_data": "❌ Could not find the logged-in assigner in the system."}

    assignee = session.query(User).filter_by(full_name=assigned_to_name).first()
    if not assignee:
        return {"retrieved_data": f"❌ Could not find assignee '{assigned_to_name}' in the system."}

    try:
        task = Task(
            title=title,
            description=description,
            due_date=date.fromisoformat(due_date_str),
            assigned_by_id=assigner.id,
            assigned_to_id=assignee.id,
            status="open",
            assigned_date=date.today()
        )
        session.add(task)
        session.commit()
    except Exception as e:
        return {"retrieved_data": f"❌ Failed to save task: {e}"}

    return {
        "retrieved_data": (
            f"✅ Task assigned!\n\n"
            f"• Title: {title}\n"
            f"• Description: {description}\n"
            f"• Assigned by: {assigner.full_name}\n"
            f"• Assigned to: {assigned_to_name}\n"
            f"• Due Date: {due_date_str}"
        )
    }