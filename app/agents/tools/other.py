from app.utils.llm import llm_call
from app.agents.state import AgentState
from app.database import SessionLocal
from app.models import User


def other_task(state: AgentState):
    last_msg = state["messages"][-1].content
    session_user_id = state.get("session_user_id")

    # Get role from database using session_user_id
    db = SessionLocal()
    user = db.query(User).filter_by(id=session_user_id).first()
    session_role = user.role.lower() if user else "user"
    db.close()

    prompt = f"""
You are **Rise Pal**, the friendly assistant at **RiseTech Village**.
The current user role is: **{session_role.upper()}**

The user just said:
"{last_msg}"

Respond based on the type of message:

**1. If the message is a casual greeting like 'hi', 'hello', 'hey':**
- Generate similar messages like mentioned below: eg:"Hi! I'm Rise Pal, your assistant here.How can i help you today?", 
"Hello! I'm Rise Pal, your friendly assistant. What can I do for you today?",
 "Hey there! I'm Rise Pal, your helpful assistant. How can I assist you today?"
 If you want to know how to use Rise Pal, just say 'how to use Rise Pal'. just say how to use Rise Pal."


**2. If the message asks 'how to use Rise Pal':**
Provide a short, point-wise guide based on the user role:

- **ADMIN**:
  - ➕ Add new users
  - ✅ Just give the team name and say: `add Employee Jake James for HR team` or `add Manager John Doe for Software team`

- **MANAGER**:
  - 📌 Assign tasks → say the employee's name, task title, description, and due date
  - 📅 Retrieve updates → say employee name + date

- **EMPLOYEE**:
  - 📝 Submit updates → say "today" or the date + describe your work

**3. If the message seems incomplete or unclear:**
- Kindly guide them on what's missing.
- Example: "Looks like you're assigning a task. Please include the employee name and due date."

✨ Keep it simple, polite, and bullet-point friendly. Avoid long paragraphs. Only show what’s relevant to their role.
"""
    response = llm_call(prompt)
    return {
        "retrieved_data": response
    }

