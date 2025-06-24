from app.utils.llm import llm_call
from app.agents.state import AgentState
from app.database import SessionLocal 
from app.models import DailyUpdate , User
from datetime import datetime


def retrieve_updates(state: AgentState):
    user_input = state["messages"][-1].content
    today = datetime.today().date()

    # Step 1: Extract employee name and date via LLM
    extraction_prompt = f"""
    Extract the employee's full name and date (in YYYY-MM-DD format) from:
    "{user_input}"
    Today is {today}.Try to extract the date from the text by comparing it with today.
    If no date is provided, use today: {today}.
    Return only the name on the first line, and the date on the second line.
    """
    result = llm_call(extraction_prompt).splitlines()
    emp_name, req_date = result[0].strip(), result[1].strip()

    # Start DB session
    session = SessionLocal()
    # Step 2: Query user and updates
    with SessionLocal() as session:
        user = session.query(User).filter(User.full_name == emp_name).first()

        if not user:
            return {"retrieved_data": f"No employee found with name: {emp_name}"}

        # Filter DailyUpdate by user ID and date
        updates = session.query(DailyUpdate).filter(
            DailyUpdate.user_id == user.id,
            DailyUpdate.date == req_date
        ).all()

        if not updates:
            return {"retrieved_data": f"No updates found for {emp_name} on {req_date}"}

        # Format updates
        updates_str = "\n".join(
            f"{u.date} - {u.title}: {u.work_done}" for u in updates
        )

    # Step 3: Summarize
    summary_prompt = f"Summarize the following work updates for {emp_name} on {req_date}:\n{updates_str}"
    summary = llm_call(summary_prompt)

    return {
        "retrieved_data": f"Summary for {emp_name} on {req_date}:\n\n{summary}",
        "target_employee": {"id": user.id, "name": user.full_name}
    }
