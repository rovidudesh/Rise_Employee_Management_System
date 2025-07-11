from app.utils.llm import llm_call
from app.agents.state import AgentState
from app.database import SessionLocal
from app.models import User


def create_user(state: AgentState):
    user_input = state["messages"][-1].content

    # LLM prompt to extract new user details
    prompt = f"""
From the following text, extract and return exactly these 6 lines:

1. First name - extract the first name of the user by analyzing the text(make the first letter uppercase)
2. Last name -  extract the last name of the user second name by analyzing the text(make the first letter uppercase)
3. Email- generate an email based on the first and last name and finally use @risetechvillage.com
4. Password - generate a password like firstname123
5. Role - (admin, manager, or employee)-(make the first letter uppercase)
6. Team - extract the just the team name like Software , HR , Operations -(make the first letter uppercase)

Text: "{user_input}"

Only return the values, one per line, in the exact order listed.
"""

    lines = [line.strip() for line in llm_call(prompt).splitlines() if line.strip()]
    if len(lines) < 6:
        return {"retrieved_data": "❌ Failed to extract all required user details. Please try again."}

    first_name, last_name, email, password, role, team = lines
    full_name = f"{first_name} {last_name}".strip()

    session = SessionLocal()

    # Check for duplicate email
    if session.query(User).filter_by(email=email).first():
        return {"retrieved_data": f"❌ A user with email `{email}` already exists."}

    # Create user
    try:
        new_user = User(
            f_name=first_name,
            l_name=last_name,
            full_name=full_name,
            email=email,
            pword=password,  # Consider hashing in production
            role=role.lower(),
            team=team,
            status="active"
        )
        session.add(new_user)
        session.commit()
    except Exception as e:
        return {"retrieved_data": f"❌ Error while creating user: {e}"}

    return {
        "retrieved_data": (
            f"✅ User created successfully!\n\n"
            f"• Name: {full_name}\n"
            f"• Email: {email}\n"
            f"• Role: {role.capitalize()}\n"
            f"• Team: {team}"
        )
    }
