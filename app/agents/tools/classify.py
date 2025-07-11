from app.utils.llm import llm_call
from app.agents.state import AgentState

def classify_query(state: AgentState):
    last_msg = state["messages"][-1].content
    prompt = f"""
You are a classifier that determines the type of query a user has sent.  
Classify the user's message into ONE of the categories below.  
⚠️ Very important: If any required details are missing or unclear, classify it as `"other"`.

---

Here are the categories and their required fields:

1. **retrieve_updates**  
   → If the query asks about work updates of an employee.  
   ✅ Required:  
     - Employee name  
     - Date of the update (in any clear format like "today", "July 2 2025", "2025.04.16" or any format etc.)  
   ❌ If either is missing → classify as "other".

2. **assign_task**  
   → If the query is about assigning a task to someone.  
   ✅ Required:  
     - Employee name  
     - Task title or description  
     - Due date  
   ❌ If any of these are missing → classify as "other".

3. **create_user**  
   → If the query is about adding new user, employee or manager.  
   ✅ Required:  
     - Full name of the employee 
     - Role (e.g.,employee, manager , admin uppercase or lowercase any)   
     - Team or department (software, HR, Operations, etc. - uppercase or lowercase any)
   ❌ If any of these are missing → classify as "other".

4. **submit_update**  
   → If the message describes work done (like a progress update).  
   ✅ Required:  
     - A specific date ("today", "yesterday", or "2024-07-03" format)  
     - A clear description of the work done  
   ❌ If either is missing → classify as "other".

5. **other**  
   → If the query does not clearly match any of the above **OR** is incomplete or vague.

   first try to analyze and understand the query because the user may not give the query with perfect format ,and try to configure catergory excatly
---

Query:  
"{last_msg}"

👉 Respond with **only one** of the following (no punctuation, quotes, or extra text):  
`retrieve_updates`, `assign_task`, `create_user`, `submit_update`, `other`
"""

    query_type = llm_call(prompt).strip().lower()
    return {"query_type": query_type}
