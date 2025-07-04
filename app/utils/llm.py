from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv
import os
load_dotenv()

GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
TAVILY_API_KEY = os.getenv('TAVILY_API_KEY')

llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash",
                            google_api_key=GEMINI_API_KEY , 
                            temperature=0.7)

def llm_call(prompt: str) -> str:
    response = llm.invoke(prompt)
    return response.content