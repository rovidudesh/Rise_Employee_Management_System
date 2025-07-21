from app.utils.llm import llm_call
from app.agents.state import AgentState
from app.database import SessionLocal
from app.models import DailyUpdate, User
from datetime import date


def submit_update(state: AgentState):
    user_input = state["messages"][-1].content
    session_user_id = state.get("session_user_id")
    memory_summary = state.get("memory_summary", "")

    if not session_user_id:
        return {"retrieved_data": "❌ Session user ID missing. Cannot submit update."}

    # Combine context
    full_context = f"""
📌 Summary of Previous Conversation:
{memory_summary}

🆕 Latest User Message:
{user_input}
"""

    # STEP 1️⃣: Extract update fields (with strict formatting)
    extraction_prompt = f"""
You're an assistant helping an employee submit their daily work update.

Below is the full conversation context:
-------------------------
{full_context}
-------------------------

🎯 Your job is to extract the following three fields **ONLY if the user clearly mentions them**:

1. title — a short label for the work done (max 10 words)
2. summary — a detailed description of the work completed
3. reference — a link (URL) if mentioned

If any field is **missing or unclear**, return it as: ''

Return in exactly this format:

title: <title or blank('')>
summary: <summary or blank('')>
reference: <URL or 'None'>

📌 Do NOT fabricate or guess. Only extract what is explicitly mentioned.
"""

    # Extract lines
    lines = [line.strip() for line in llm_call(extraction_prompt).splitlines() if line.strip()]

    extracted = {"title": "", "work_done": "", "reference_link": "None"}

    for line in lines:
        if line.lower().startswith("title:"):
            extracted["title"] = line[6:].strip()
        elif line.lower().startswith("summary:"):
            extracted["work_done"] = line[8:].strip()
        elif line.lower().startswith("reference:"):
            extracted["reference_link"] = line[10:].strip()

    # STEP 2️⃣: Clarify if title or work summary is missing
    if extracted["title"] == "" or extracted["work_done"] == "":
        clarification_prompt = f"""
You're helping an employee submit their daily update to RisePal.

The following information is currently available:
- Title: {extracted['title'] or '❌ missing'}
- Work Summary: {extracted['work_done'] or '❌ missing'}
- Reference Link: {extracted['reference_link'] or 'None'}

Please generate a short and friendly message asking ONLY for the missing fields.if any field is missing ask the user user to give an small description of the work done today and a title for it.
Do NOT fill in or assume anything.
"""

        clarification_msg = llm_call(clarification_prompt)
        return {"retrieved_data": f"👋 RisePal needs a bit more info:\n\n{clarification_msg}"}

    # Normalize reference link
    reference_link = extracted["reference_link"]
    reference_link = None if reference_link.lower() == "none" else reference_link

    session = SessionLocal()

    # Verify user exists
    user = session.query(User).filter_by(id=session_user_id).first()
    if not user:
        return {"retrieved_data": "❌ Could not find the logged-in employee in the system."}

    # STEP 3️⃣: Save update
    try:
        update = DailyUpdate(
            user_id=user.id,
            date=date.today(),
            title=extracted["title"],
            work_done=extracted["work_done"],
            reference_link=reference_link
        )
        session.add(update)
        session.commit()
    except Exception as e:
        return {"retrieved_data": f"❌ Failed to save update: {e}"}
    finally:
        session.close()

    return {
        "retrieved_data": (
            f"✅ Update submitted successfully!\n\n"
            f"• Title: {extracted['title']}\n"
            f"• Date: {date.today()}\n"
            f"• Summary: {extracted['work_done']}\n"
            + (f"• Reference: {reference_link}" if reference_link else "")
        )
    }