from flask import Blueprint, render_template, request, redirect, session, flash, url_for, jsonify
from flask_cors import cross_origin, CORS
from langchain_core.messages import HumanMessage
from app.agents.graph import chatbot_agent  # This is your compiled LangGraph agent
from app.agents.state import AgentState     # Your shared agent state structure
from flask import render_template
from app.models import User , DailyUpdate
from app.database import SessionLocal
from datetime import date
from werkzeug.security import check_password_hash  # Optional for future hashed passwords

main = Blueprint("main", __name__)

# login route
@main.route("/api/login", methods=["POST", "OPTIONS"])
@cross_origin(origins=["http://localhost:3000"], supports_credentials=True)
def login():
    if request.method == "OPTIONS":
        # Handle preflight request
        return jsonify({}), 200
        
    try:
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")
        
        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400
        
        db = SessionLocal()
        user = db.query(User).filter(User.email == email).first()
        
        if user and user.pword == password:  # Simple password check (consider hashing in production)
            session["user_id"] = user.id
            session["role"] = user.role
            session["team"] = user.team
            session["full_name"] = user.full_name
            
            return jsonify({
                "message": "Login successful",
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "role": user.role,
                    "team": user.team,
                    "full_name": user.full_name
                }
            }), 200
        else:
            return jsonify({"error": "Invalid credentials"}), 401
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()

# check user session
@main.route("/api/user", methods=["GET", "OPTIONS"])
@cross_origin(origins=["http://localhost:3000"], supports_credentials=True)
def get_user():
    if request.method == "OPTIONS":
        return jsonify({}), 200
        
    try:
        if "user_id" in session:
            return jsonify({
                "authenticated": True,
                "user": {
                    "id": session.get("user_id"),
                    "role": session.get("role"),
                    "team": session.get("team"),
                    "full_name": session.get("full_name")
                }
            }), 200
        else:
            return jsonify({"authenticated": False}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500

#Logout
@main.route("/api/logout", methods=["POST", "OPTIONS"])
@cross_origin(origins=["http://localhost:3000"], supports_credentials=True)
def api_logout():
    if request.method == "OPTIONS":
        return jsonify({}), 200
        
    try:
        session.clear()
        return jsonify({"message": "Logout successful"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


#Admin Page - Add User
@main.route("/admin" , methods=["GET", "POST"])
def admin_dashboard():
    if session.get("role") != "admin":
        return "Unauthorized", 403

    db = SessionLocal()

    if request.method == "POST":
        # Handle Add User form
        f_name = request.form.get("f_name")
        l_name = request.form.get("l_name")
        full_name = f"{f_name} {l_name}"
        email = request.form.get("email")
        pword = request.form.get("password")
        role = request.form.get("role")
        team = request.form.get("team")
        status = request.form.get("status")

        new_user = User(
            f_name=f_name,
            l_name=l_name,
            full_name=full_name,
            email=email,
            pword=pword,
            role=role,
            team=team,
            status=status
        )

        db.add(new_user)
        db.commit()
        flash(" New user added successfully!")

    # GET: Fetch all users
    users = db.query(User).all()
    return render_template("admin_dashboard.html", users=users)

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

#Employee Page
@main.route("/employee", methods=["GET", "POST"])
def employee_dashboard():
    if session.get("role") != "employee":
        return "Unauthorized", 403

    db = SessionLocal()
    user_id = session.get("user_id")  # Assuming login sets this

    if request.method == "POST":
        title = request.form.get("title")
        work_done = request.form.get("work_done")
        reference_link = request.form.get("reference_link")
        comment = request.form.get("comment")
        task_id = request.form.get("task_id")

        daily_update = DailyUpdate(
            user_id=user_id,
            date=date.today(),
            title=title,
            work_done=work_done,
            reference_link=reference_link or None,
            comment=comment or None,
            task_id=int(task_id) if task_id else None
        )

        db.add(daily_update)
        db.commit()
        flash(" Daily update submitted!")

    return render_template("employee_dashboard.html")

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






