from app.utils.llm import llm_call
from app.agents.state import AgentState
from app.database import SessionLocal
from app.models import DailyUpdate, User
from datetime import date


def submit_update(state: AgentState):
    user_input = state["messages"][-1].content
    session_user_id = state.get("session_user_id")

    if not session_user_id:
        return {"retrieved_data": "❌ Session user ID missing. Cannot submit update."}

    # Prompt LLM to extract title, work summary, optional reference link
    prompt = f"""
From the following message, extract and return the following in order:

1. A short title summarizing the work (max 10 words)
2. A detailed description of the work done
3. (Optional) Reference link if available, otherwise say "None"

Text: "{user_input}"

Return exactly 3 lines in this format:
<Title>
<Work Done>
<Reference Link or 'None'>
"""
    lines = [line.strip() for line in llm_call(prompt).splitlines() if line.strip()]
    if len(lines) < 3:
        return {"retrieved_data": "❌ Could not extract required update details. Please try again."}

    title, work_done, reference_link = lines
    reference_link = None if reference_link.lower() == "none" else reference_link

    session = SessionLocal()

    # Verify user exists
    user = session.query(User).filter_by(id=session_user_id).first()
    if not user:
        return {"retrieved_data": "❌ Could not find the logged-in employee in the system."}

    try:
        update = DailyUpdate(
            user_id=user.id,
            date=date.today(),
            title=title,
            work_done=work_done,
            reference_link=reference_link
        )
        session.add(update)
        session.commit()
    except Exception as e:
        return {"retrieved_data": f"❌ Failed to save update: {e}"}

    return {
        "retrieved_data": (
            f"✅ Update submitted successfully!\n\n"
            f"• Title: {title}\n"
            f"• Date: {date.today()}\n"
            f"• Summary: {work_done}\n"
            + (f"• Reference: {reference_link}" if reference_link else "")
        )
    }
