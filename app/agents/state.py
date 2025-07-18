from typing import TypedDict, List, Optional
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage

class AgentState(TypedDict):
    messages: List[BaseMessage]
    query_type: Optional[str]
    retrieved_data: Optional[str]
    session_user_id: Optional[str]  
    target_employee: Optional[dict]  
    update_id : Optional[dict]
    memory_summary: Optional[str]



