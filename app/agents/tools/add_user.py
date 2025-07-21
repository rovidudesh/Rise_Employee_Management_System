from app.utils.llm import llm_call
from app.agents.state import AgentState
from app.database import SessionLocal
from app.models import User

def create_user(state: AgentState):
    user_input = state["messages"][-1].content
    memory_summary = state.get("memory_summary", "")

    # ✨ Step 1: Combine context
    full_context = f"""
📌 Summary of Previous Conversation:
{memory_summary}

🆕 Latest User Message:
{user_input}
"""

    # ✂️ STEP 1: Extract fields (no logic)
    extraction_prompt = f"""
You are a data extractor helping an admin add a new employee.

Below is the full conversation context:
-------------------------
{full_context}
-------------------------

From this, extract the following fields if clearly mentioned:
- First Name (capitalized)
- Last Name (capitalized)
- Role (Admin, Manager, Employee)
- Team (e.g., HR, Software, Marketing)

Return in **exactly** this format:
f_name: <first_name or blank('')>
l_name: <last_name or blank('')>
role: <role or blank('')>
team: <team or blank('')>
"""

    raw_output = llm_call(extraction_prompt)
    print("[DEBUG] Extracted Output:\n", raw_output)

    # Parse extracted fields
    extracted = {"f_name": "", "l_name": "", "role": "", "team": ""}
    for line in raw_output.splitlines():
        if ":" in line:
            key, val = line.split(":", 1)
            key = key.strip()
            val = val.strip()
            if key in extracted:
                extracted[key] = val

    # Check if all required fields are available
    if all(extracted.values()):
        f_name = extracted["f_name"]
        l_name = extracted["l_name"]
        role = extracted["role"]
        team = extracted["team"]
        full_name = f"{f_name} {l_name}"
        email = f"{f_name.lower()}.{l_name.lower()}@risetechvillage.com"
        password = f"{f_name.lower()}123"

        session = SessionLocal()

        # Check for duplicate email
        if session.query(User).filter_by(email=email).first():
            return {"retrieved_data": f"❌ A user with email `{email}` already exists."}

        try:
            new_user = User(
                f_name=f_name,
                l_name=l_name,
                full_name=full_name,
                email=email,
                pword=password,  # ⚠️ Replace with hashed password in production
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

    # 🛑 STEP 2: Missing values → Ask for clarification
    clarification_prompt = f"""
You're helping an admin add a user. The following information is available:

- First Name: {extracted['f_name'] or '❌ missing'}
- Last Name: {extracted['l_name'] or '❌ missing'}
- Role: {extracted['role'] or '❌ missing'}
- Team: {extracted['team'] or '❌ missing'}

Your task:
👉 If **any** field is missing, generate a polite and concise message asking the user ONLY for those fields.
👉 DO NOT guess or fabricate any values.
👉 Mention any known names in your clarification.

Format: A clear, user-friendly sentence asking for the missing parts.
"""

    clarification = llm_call(clarification_prompt)

    return {"retrieved_data": f"👋 RisePal needs a bit more info:\n\n{clarification}"}