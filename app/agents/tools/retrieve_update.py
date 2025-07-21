from app.utils.llm import llm_call
from app.agents.state import AgentState
from app.database import SessionLocal
from app.models import DailyUpdate, User
from datetime import datetime


def retrieve_updates(state: AgentState):
    user_input = state["messages"][-1].content
    memory_summary = state.get("memory_summary", "")
    today = datetime.today().date()

    # 🧠 STEP 1: Combine context and extract name + date
    full_context = f"""
📌 Memory Summary:
{memory_summary}

🆕 Latest User Message:
{user_input}

Today is {today}.
"""

    extraction_prompt = f"""
You're a helpful assistant extracting required information for retrieving an employee's daily update.

Use the following conversation context:
--------------------------
{full_context}
--------------------------

Your task:
- Extract the employee's full name (First Last) with capitalized initials.
- Extract the requested date in YYYY-MM-DD format.
- If no date is mentioned, use today's date: {today}.

Return in **exactly** this format:
name: <full name or ''>
date: <YYYY-MM-DD or ''>
"""

    lines = [line.strip() for line in llm_call(extraction_prompt).splitlines() if line.strip()]
    extracted = {"name": "", "date": ""}

    for line in lines:
        if line.lower().startswith("name:"):
            extracted["name"] = line[5:].strip()
        elif line.lower().startswith("date:"):
            extracted["date"] = line[5:].strip()

    # ❓ STEP 2: Clarify if missing
    if not extracted["name"] or not extracted["date"]:
        clarification_prompt = f"""
You're assisting a manager trying to retrieve an employee's daily update.

However, some required fields are missing:
- Name: {extracted['name'] or '❌ missing'}
- Date: {extracted['date'] or '❌ missing'}

👉 Write a **polite clarification message** asking ONLY for the missing parts. Do not assume anything.
"""
        clarification_message = llm_call(clarification_prompt)
        return {"retrieved_data": f"🤖 RisePal needs more info:\n\n{clarification_message}"}

    emp_name = extracted["name"]
    req_date = extracted["date"]

    # 📦 STEP 3: Retrieve & summarize
    with SessionLocal() as session:
        user = session.query(User).filter(User.full_name == emp_name).first()
        if not user:
            return {"retrieved_data": f"❌ No employee found with the name '{emp_name}'."}

        update = (
            session.query(DailyUpdate)
            .filter(DailyUpdate.user_id == user.id, DailyUpdate.date == req_date)
            .order_by(DailyUpdate.id.desc())
            .first()
        )

        if not update:
            return {"retrieved_data": f"ℹ️ No updates found for {emp_name} on {req_date}."}

        summary_prompt = f"""
You're summarizing a daily work update for manager view.

Employee: {emp_name}
Date: {update.date}

Work Details:
• Title: {update.title}
• Summary: {update.work_done}

📝 Write a clear and short summary for this update.
"""
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