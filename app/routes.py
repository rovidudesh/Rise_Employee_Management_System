from flask import Blueprint, current_app, render_template, request, redirect, session, flash, url_for,jsonify
from langchain_core.messages import HumanMessage
from app.agents.graph import chatbot_agent  # This is your compiled LangGraph agent
from app.agents.state import AgentState     # Your shared agent state structure
from flask import render_template
from app.models import User , DailyUpdate
from app.database import SessionLocal
from datetime import date
from werkzeug.security import check_password_hash  # Optional for future hashed passwords
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from sqlalchemy.exc import IntegrityError



main = Blueprint("main", __name__, url_prefix='/api')

#Login
@main.route("/login", methods=["POST"])
def api_login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    print(f"API login attempt with email: {email}")

    db = SessionLocal()
    try:
        user = db.query(User).filter_by(email=email).first()

        if user and user.pword == password:
            print(f"Api login successful for user: {user.full_name}")

            # Create access token with user identity
            access_token = create_access_token(identity={
                "id": user.id,
                "email": user.email,
                "role": user.role
            })

            # Return user details and token
            return jsonify({
                "success": True,
                "user": {
                    "id": user.id,
                    "full_name": user.full_name,
                    "role": user.role,
                    "status": user.status,
                    "team": user.team
                },
                "token": access_token,
                "message": f"Welcome back, {user.full_name}!"
            })
        else:
            print(f"API Login failed for email: {email}")
            return jsonify({
                "success": False,
                "message": "Invalid email or password"
            }),401
        
    except Exception as e:
        print(f"API Login error: {str(e)}")
        return jsonify({
            "success": False,
            "message": "An error occurred during login."
        }), 500

    finally:
        db.close()

#Logout
@main.route("/logout")
def logout():
    session.clear()  # Clears all session data
    flash(" Logged out successfully.")
    return redirect("/")


#Admin Page - Add User


#Updating User Status
@main.route("/admin/update_status/<int:user_id>", methods=["POST"])
def update_user_status(user_id):
    if session.get("role") != "admin":
        return "Unauthorized", 403

    new_status = request.form.get("status")
    db = SessionLocal()
    user = db.query(User).get(user_id)
    if user:
        user.status = new_status
        db.commit()
        flash(f" Status for {user.full_name} updated to {new_status}")
    return redirect("/admin")



#Employee - submit task


#Manager Page
@main.route("/manager")
def manager_dashboard():
    if session.get("role") != "manager":
        return "Unauthorized", 403

    db = SessionLocal()
    team = session.get("team")

    employees = db.query(User).filter(
        User.role == "employee",
        User.team == team
    ).all()

    return render_template("manager_dashboard.html", employees=employees)


# Chat route for LangGraph agent
@main.route("/manager/chat")
def chatbot():
    return render_template('chat.html')


@main.route("/get", methods=["GET", "POST"])
def chat():
    msg = request.form.get("msg")
    if not msg:
        return " No message received."

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
        return f" Error: {str(e)}"




