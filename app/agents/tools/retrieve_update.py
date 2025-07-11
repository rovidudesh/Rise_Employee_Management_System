from app.utils.llm import llm_call
from app.agents.state import AgentState
from app.database import SessionLocal 
from app.models import DailyUpdate, User
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
    Return only the name on the first line (convert the name to first letter uppercase in the given first and last name), and the date on the second line.
    """
    result = llm_call(extraction_prompt).splitlines()
    
    if len(result) < 2:
        return {"retrieved_data": "❌ Could not extract both name and date. Please rephrase."}

    emp_name, req_date = result[0], result[1]

    with SessionLocal() as session:
        user = session.query(User).filter(User.full_name == emp_name).first()
        if not user:
            return {"retrieved_data": f"❌ No employee found with name: {emp_name}"}

        # Step 2: Query only the latest update of that day (by created time or ID)
        update = (
            session.query(DailyUpdate)
            .filter(DailyUpdate.user_id == user.id, DailyUpdate.date == req_date)
            .order_by(DailyUpdate.id.desc())
            .first()
        )

        if not update:
            return {"retrieved_data": f"ℹ️ No updates found for {emp_name} on {req_date}"}

        # Step 3: Summarize this update
        update_info = f"{update.date} - {update.title}: {update.work_done}"
        summary_prompt = f"Summarize the following work update for {emp_name} on {req_date}:\n{update_info}"
        summary = llm_call(summary_prompt)

        return {
            "retrieved_data": f"📋 Summary for {emp_name} on {req_date}:\n\n{summary}",
            "target_employee": {
                "id": user.id,
                "name": user.full_name
            },
            "update_id": {
                "id": update.id,
                "date": str(update.date),
                "title": update.title
            }
        }
