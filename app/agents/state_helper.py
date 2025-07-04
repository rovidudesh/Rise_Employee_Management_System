from app.utils.llm import llm_call
from app.agents.state import AgentState
from langchain_core.messages import HumanMessage, AIMessage

# --- Message serializers ---
def serialize_messages(messages):
    return [{"type": "human" if isinstance(m, HumanMessage) else "ai", "content": m.content} for m in messages]

def deserialize_messages(data):
    messages = []
    for msg in data:
        if msg["type"] == "human":
            messages.append(HumanMessage(content=msg["content"]))
        else:
            messages.append(AIMessage(content=msg["content"]))
    return messages
