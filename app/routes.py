from flask import Blueprint, request, jsonify
from langchain_core.messages import HumanMessage
from app.agents.graph import chatbot_agent  # This is your compiled LangGraph agent
from app.agents.state import AgentState     # Your shared agent state structure
from flask import render_template

main = Blueprint("main", __name__)

@main.route("/")
def index():
    return render_template('index.html')


@main.route("/get", methods=["GET", "POST"])
def chat():
    msg = request.form.get("msg")
    if not msg:
        return "❌ No message received."

    user_input = msg
    print(f"[USER] {user_input}")

    # Initial state passed to the LangGraph agent
    initial_state = {
        "messages": [HumanMessage(content=user_input)],
        "query_type": "",        # required by AgentState
        "retrieved_data": ""     # will be populated
    }

    try:
        # Run LangGraph agent
        final_state = chatbot_agent.invoke(initial_state)

        # Get the response from the state
        response = final_state.get("retrieved_data", "⚠️ No data returned.")
        print(f"[BOT] {response}")
        return response

    except Exception as e:
        print(f"[ERROR] {e}")
        return f"❌ Error: {str(e)}"
    