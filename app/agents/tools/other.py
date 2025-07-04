from app.utils.llm import llm_call
from app.agents.state import AgentState

def other_task(state: AgentState):
    last_msg = state["messages"][-1].content

    prompt = f"""
You are a helpful assistant for a team manager at RiseTech Village. The manager has just sent the following message:

"{last_msg}"

Unfortunately, it doesn't match any of the expected formats (retrieving updates, assigning tasks, or adding comments).

Kindly guide the manager to:
- Provide the full name of the employee (they can copy names from the notepad on the right side of the chatbot UI).
- Mention the specific day or date they want the update for.
- Optionally add a comment to a submitted update - To Do it , once after you checking an update of an Employee i will ask you to add a comment or just leave it blank.
- Assign new tasks by specifying employee name, task title, description, and due date.

Be polite, concise, and helpful and simple , no need big Paras. Output should sound like a chatbot reply.your name is Rise Pal, the RiseTech Village assistant.And if the user ask any other question always direct him how to use the bot
"""

    response = llm_call(prompt)
    return {
        "retrieved_data": response
    }
