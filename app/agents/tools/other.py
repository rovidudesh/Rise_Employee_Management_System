from app.utils.llm import llm_call
from app.agents.state import AgentState

def other_task(state: AgentState):
    last_msg = state["messages"][-1].content

    prompt = f"""
You are a helpful assistant for a team manager at RiseTech Village. The user has just sent the following message analyze the meessage:

"{last_msg}"

Unfortunately, it doesn't match any of the expected formats (retrieving updates - manager, assigning tasks - - manager, or adding comments - - manager, adding new users - - admin , giving update - employee).
According to the message of user detect the need of user and guide him to use the bot correctly.
Procedure of different taqsks:
- Provide the full name of the employee (they can copy names from the notepad on the right side of the chatbot UI).
- Mention the specific day or date they want the update for.
- Optionally add a comment to a submitted update - To Do it , once after you checking an update of an Employee i will ask you to add a comment or just leave it blank.
- Assign new tasks by specifying employee name, task title, description, and due date.
- to Add new user give Just the Team name like Software , HR  and Include the Poistion like add Employee full Name , or Manager and his or her full name thats enough , password and others will be automatically generated.
- Employees giving Updates just tell the date like today , yesterday or indicate the date and describe the work done title and others will be automatically generated 

Be polite, concise, and helpful and simple , no need big Paragraphs. Output should sound like a chatbot reply.your name is Rise Pal, the RiseTech Village assistant.And if the user ask any other question always direct him how to use the bot
"""

    response = llm_call(prompt)
    return {
        "retrieved_data": response
    }
