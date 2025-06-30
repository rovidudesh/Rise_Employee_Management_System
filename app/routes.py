from flask import Blueprint, render_template, request, redirect, session, flash, url_for
from langchain_core.messages import HumanMessage
from app.agents.graph import chatbot_agent  # This is your compiled LangGraph agent
from app.agents.state import AgentState     # Your shared agent state structure
from flask import render_template
from app.models import User , DailyUpdate
from app.database import SessionLocal
from datetime import date
from werkzeug.security import check_password_hash  # Optional for future hashed passwords


main = Blueprint("main", __name__)

#Login
@main.route("/")
def index():
    return render_template("login.html")

@main.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form.get("email")
        pword = request.form.get("password")

        db = SessionLocal()
        user = db.query(User).filter_by(email=email).first()

        if user and user.pword == pword:
            # If using hashing in future: check_password_hash(user.pword, pword)
            session["user_id"] = user.id
            session["role"] = user.role
            session["full_name"] = user.full_name
            session["status"] = user.status  # Optional: track user status
            session["team"] = user.team  
            flash(f" Welcome back, {user.full_name}!")


            
            if user.role == "admin":
                return redirect("/admin")
            elif user.role == "manager":
                return redirect("/manager")
            elif user.role == "employee":
                return redirect("/employee")
        else:
            flash("❌ Invalid email or password.")
            print(f"Email: {email}, Password: {pword}")
            print(f"DB returned: {user.email if user else 'No user'}, Password in DB: {user.pword if user else 'N/A'}")
            return redirect("/login")

    return render_template("login.html")

#Logout
@main.route("/logout")
def logout():
    session.clear()  # Clears all session data
    flash(" Logged out successfully.")
    return redirect("/")


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
    