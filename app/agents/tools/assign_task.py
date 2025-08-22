from app.utils.llm import llm_call
from app.agents.state import AgentState
from app.database import SessionLocal
from app.models import Task, User
from datetime import date, datetime


def assign_task(state: AgentState):
    print("Assigning task...")
    user_input = state["messages"][-1].content
    session_user_id = state.get("session_user_id")
    description_only = state.get("memory_description", "").strip()
    today = datetime.today().date()

    # 🧠 1. Extraction Prompt
    extraction_prompt = f"""
You are a helpful assistant extracting task details from user input.

From the following instruction, extract:
1. Full name of the assignee (capitalize first letters)
2. Task title — generate a short, relevant title if not explicitly mentioned
3. Short task description — summarize from message if not explicitly stated
4. Due date (absolute format: YYYY-MM-DD). If a relative date is mentioned
   (e.g., "next Monday", "tomorrow"), convert it using today's date: {today}.
   If no due date is found, leave it blank.

Respond with each item on a new line.

Instruction:
\"\"\"{description_only}\n{user_input}\"\"\"
"""

    try:
        response = llm_call(extraction_prompt)
        lines = [line.strip() for line in response.strip().splitlines() if line.strip()]
        print("🔍 Extracted lines:", lines)
    except Exception as e:
        return {"retrieved_data": f"❌ Failed to extract task details: {e}"}

    # 2. Parse values
    assigned_to_name = lines[0] if len(lines) > 0 and lines[0].lower() != "none" else None
    title = lines[1] if len(lines) > 1 and lines[1].lower() != "unspecified task" else None
    description = lines[2] if len(lines) > 2 and lines[2].lower() != "no description provided" else None
    due_date_str = lines[3] if len(lines) > 3 and lines[3] else None

    # 3. Auto-generate title if missing but description is present
    if not title and description:
        title_prompt = f"""
You are a task title generator.

Given this task description:
\"{description}\"

Return a short, 2-4 word task title:
"""
        try:
            title = llm_call(title_prompt).strip()
        except Exception as e:
            title = "Untitled Task"
            print(f"[TITLE GEN ERROR] {e}")

    # 4. Identify missing required fields
    missing = []
    if not assigned_to_name:
        missing.append("the assignee’s full name")
    if not description:
        missing.append("a short task description")
    if not due_date_str:
        missing.append("a due date (e.g., 2025-07-20)")

    if missing:
        clarification_msg = (
            f"👋 Hey Rise Pal! I still need the following to assign this task:\n"
            f"👉 {', '.join(missing)}.\n\n"
            f"Please provide the missing detail(s)."
        )
        return {"retrieved_data": clarification_msg}

    # 5. Commit task to DB
    session = SessionLocal()
    assigner = session.query(User).filter_by(id=session_user_id).first()
    if not assigner:
        return {"retrieved_data": "❌ Could not find the assigner in the system."}

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
            assigned_date=today
        )
        session.add(task)
        session.commit()
    except Exception as e:
        session.rollback()
        return {"retrieved_data": f"❌ Failed to save task: {e}"}
    finally:
        session.close()

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
