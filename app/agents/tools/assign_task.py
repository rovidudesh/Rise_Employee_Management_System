from app.utils.llm import llm_call
from app.agents.state import AgentState
from app.database import SessionLocal 
from app.models import DailyUpdate , Task , User
from datetime import date 


def assign_task(state: AgentState):
    print('Assigning task...')
    user_input = state["messages"][-1].content

    # Prompt LLM to return line-by-line output
    prompt = f"""
From the following task assignment message, extract the following details in order:

1. Full name of the person assigning the task (if not provided, use "Alice Johnson")
2. Full name of the person receiving the task
3. Title of the task
4. Description of the task
5. Due date (format: YYYY-MM-DD)

Only return these 5 items, one per line.

Message: "{user_input}"
"""

    response = llm_call(prompt)
    lines = [line.strip() for line in response.strip().splitlines() if line.strip()]
    
    # Debug print
    print("🔍 Extracted lines:", lines)

    if len(lines) < 5:
        return {"retrieved_data": "❌ Could not extract all required task information. Please rephrase."}

    assigned_by_name, assigned_to_name, title, description, due_date_str = lines[:5]

    # Fallback if assigner not mentioned
    if not assigned_by_name:
        assigned_by_name = "Alice Johnson"

    # Start DB session
    session = SessionLocal()

    assigner = session.query(User).filter_by(full_name=assigned_by_name).first()
    assignee = session.query(User).filter_by(full_name=assigned_to_name).first()

    if not assigner or not assignee:
        return {"retrieved_data": f"❌ Could not find assigner or assignee in the system.\nAssigner: {assigned_by_name}, Assignee: {assigned_to_name}"}

    # Create and commit task
    try:
        task = Task(
            title=title,
            description=description,
            due_date=date.fromisoformat(due_date_str),
            assigned_by_id=assigner.id,
            assigned_to_id=assignee.id,
            status="open"
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
            f"• Assigned by: {assigned_by_name}\n"
            f"• Assigned to: {assigned_to_name}\n"
            f"• Due Date: {due_date_str}"
        )
    }
