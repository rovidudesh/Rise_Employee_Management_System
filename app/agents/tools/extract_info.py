from app.database import SessionLocal
from app.models import User
from app.utils.llm import llm_call
from app.agents.state import AgentState

def extract_info(state: AgentState) -> dict:
    message = state["messages"][-1].content
    session_user_id = state.get("session_user_id")

    session = SessionLocal()
    manager = session.query(User).filter_by(id=session_user_id).first()

    # You can use LLM to extract target employee name
    prompt = f"""
From this query, extract the full name of the employee mentioned (if any).

Query: "{message}"

Return only the name.
If no employee is mentioned, return an empty string.
"""
    employee_name = llm_call(prompt)

    target_employee = None
    if employee_name:
        target = session.query(User).filter_by(full_name=employee_name).first()
        if target:
            target_employee = {
                "id": target.id,
                "full_name": target.full_name,
                "email": target.email
            }

    return {
        "session_user_id": session_user_id,
        "target_employee": target_employee
    }
