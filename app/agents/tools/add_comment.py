from app.utils.llm import llm_call
from app.agents.state import AgentState
from app.database import SessionLocal
from app.models import DailyUpdate


def add_comment(state: AgentState):
    print('Adding comment...')
    user_input = state["messages"][-1].content
    update_info = state.get("update_id")

    if not update_info or not update_info.get("id"):
        return {"retrieved_data": "❌ No update ID available. Please retrieve an update first."}

    update_id = update_info["id"]

    # Extract just the comment from the manager's input
    prompt = f"""
    Extract only the feedback comment from this message. 
    Ignore employee name or date if present.

    Message: "{user_input}"

    Respond with a single line: the comment only.
    """
    comment_text = llm_call(prompt)

    if not comment_text:
        return {"retrieved_data": "❌ Could not extract a comment from your message."}

    # Update the comment in DB
    with SessionLocal() as session:
        update = session.query(DailyUpdate).filter_by(id=update_id).first()
        if not update:
            return {"retrieved_data": f"❌ No daily update found with ID {update_id}"}

        update.comment = comment_text
        session.commit()

        return {
            "retrieved_data": (
                f"✅ Comment added to '{update.title}' on {update.date}.\n"
                f"📝 Comment: {comment_text}"
            )
        }
