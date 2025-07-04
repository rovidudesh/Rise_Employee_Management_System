from app.utils.llm import llm_call
from app.agents.state import AgentState
from app.database import SessionLocal 
from app.models import DailyUpdate, Task, User
from datetime import date , datetime


def assign_task(state: AgentState):
    print('Assigning task...')
    user_input = state["messages"][-1].content
    session_user_id = state.get("session_user_id")  # Logged-in manager (assigner)
    today = datetime.today().date()

    # Prompt LLM to extract only assignee and task details (not assigner)
    prompt = f"""
From the following task assignment message, extract the following details in order:

1. Full name of the person receiving the task
2. Title of the task
3. Description of the task - generate a small description based on the context of the task.
4. Due date (format: YYYY-MM-DD)
Today is {today}.Try to extract the date from the text by comparing it with today.
    If no date is provided, use today: {today}.
    Return only the name on the first line, and the date on the second line.
Only return these 4 items, one per line.

Message: "{user_input}"
"""

    response = llm_call(prompt)
    lines = [line.strip() for line in response.strip().splitlines() if line.strip()]
    
    print("🔍 Extracted lines:", lines)

    if len(lines) < 4:
        return {"retrieved_data": "❌ Could not extract all required task information. Please rephrase."}

    assigned_to_name, title, description, due_date_str = lines[:4]

    session = SessionLocal()

    # Get assigner using session user ID
    assigner = session.query(User).filter_by(id=session_user_id).first()
    if not assigner:
        return {"retrieved_data": "❌ Could not find the logged-in assigner in the system."}

    # Get assignee by name
    assignee = session.query(User).filter_by(full_name=assigned_to_name).first()
    if not assignee:
        return {"retrieved_data": f"❌ Could not find assignee '{assigned_to_name}' in the system."}

    # Save the new task
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
