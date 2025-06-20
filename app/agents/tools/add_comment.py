from app.utils.llm import llm_call
from app.agents.state import AgentState
from app.database import SessionLocal , Session , User 
from app.models import DailyUpdate
from datetime import date 

session = SessionLocal()

def add_comment(state: AgentState):
    print('Adding comment...')
    user_input = state["messages"][-1].content

    # Extract name, date, and comment using LLM
    prompt = f"""
    From the following message, extract:
    1. The full name of the employee
    2. The date of the daily update (YYYY-MM-DD format)
    3. The comment to be added

    Message: "{user_input}"
    
    Respond with:
    Line 1: Full name
    Line 2: Date (YYYY-MM-DD)
    Line 3: Comment text
    """
    lines = llm_call(prompt).splitlines()
    if len(lines) < 3:
        return {"retrieved_data": "❌ Could not parse the name, date, and comment."}

    name, date_str, comment_text = lines[0], lines[1], lines[2]
    
    # Query and update
    session = Session()
    user = session.query(User).filter_by(full_name=name).first()
    if not user:
        return {"retrieved_data": f"❌ No employee found with name: {name}"}

    update = session.query(DailyUpdate).filter_by(user_id=user.id, date=date.fromisoformat(date_str)).first()
    if not update:
        return {"retrieved_data": f"❌ No update found for {name} on {date_str}"}

    update.comment = comment_text
    session.commit()
    return {"retrieved_data": f"✅ Comment added to {name}'s update on {date_str}."}
    