#from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
import os
load_dotenv()

GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
TAVILY_API_KEY = os.getenv('TAVILY_API_KEY')

#llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash",google_api_key=GEMINI_API_KEY , temperature=0.7)

llm = ChatOpenAI(
    model="gpt-4",
    api_key=GEMINI_API_KEY,
    temperature=0.7,
)

# Debug: Check if API key is loaded 
print(f"API Key loaded: {'Yes' if GEMINI_API_KEY else 'No'}")
print(f"API Key starts with: {GEMINI_API_KEY[:10] if GEMINI_API_KEY else 'None'}...")


def llm_call(prompt: str) -> str:
    response = llm.invoke(prompt)
    return response.content