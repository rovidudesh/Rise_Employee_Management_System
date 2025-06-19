from typing import TypedDict, List, Optional
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage

class AgentState(TypedDict):
    messages: List[BaseMessage]
    query_type: Optional[str]
    retrieved_data: Optional[str]
