from flask import Blueprint, render_template, request, redirect, session, flash, url_for, jsonify
from flask_cors import cross_origin, CORS
from langchain_core.messages import HumanMessage
from app.agents.graph import chatbot_agent  # This is your compiled LangGraph agent
from app.agents.state import AgentState     # Your shared agent state structure
from flask import render_template
from app.models import User, DailyUpdate, Task  # Add Task to imports
from app.database import SessionLocal
from datetime import date
from werkzeug.security import check_password_hash  # Optional for future hashed passwords
import os 

print("GEMINI_API_KEY:", os.getenv("GEMINI_API_KEY"))  # Debugging line to check if the key is set

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


# Add User API endpoint
@main.route("/api/admin/add-user", methods=["POST", "OPTIONS"])
@cross_origin(origins=["http://localhost:3000"], supports_credentials=True)
def add_user():
    if request.method == "OPTIONS":
        return jsonify({}), 200
    
    # Check if user is admin
    if session.get("role") != "admin":
        return jsonify({"error": "Unauthorized access"}), 403
    
    try:
        data = request.get_json()
        full_name = data.get("full_name")
        email = data.get("email")
        password = data.get("password")
        role = data.get("role")
        status = data.get("status")
        team = data.get("team")  # Optional field
        
        # Validate required fields
        if not all([full_name, email, password, role, status]):
            return jsonify({"error": "All fields are required (full_name, email, password, role, status)"}), 400
        
        # Validate role
        valid_roles = ["admin", "manager", "employee"]
        if role not in valid_roles:
            return jsonify({"error": f"Invalid role. Must be one of: {', '.join(valid_roles)}"}), 400
        
        # Validate status
        valid_statuses = ["active", "inactive"]
        if status not in valid_statuses:
            return jsonify({"error": f"Invalid status. Must be one of: {', '.join(valid_statuses)}"}), 400
        
        # Split full name into first and last name
        name_parts = full_name.strip().split()
        if len(name_parts) < 2:
            return jsonify({"error": "Full name must contain at least first and last name"}), 400
        
        f_name = name_parts[0]
        l_name = " ".join(name_parts[1:])  # Join remaining parts as last name
        
        db = SessionLocal()
        
        # Check if email already exists
        existing_user = db.query(User).filter(User.email == email).first()
        if existing_user:
            return jsonify({"error": "Email already exists"}), 409
        
        # Check if full name already exists
        existing_full_name = db.query(User).filter(User.full_name == full_name).first()
        if existing_full_name:
            return jsonify({"error": "Full name already exists"}), 409
        
        # Create new user
        new_user = User(
            f_name=f_name,
            l_name=l_name,
            full_name=full_name,
            email=email,
            pword=password,  # In production, hash this password
            role=role,
            team=team,
            status=status
        )
        
        db.add(new_user)
        db.commit()
        
        return jsonify({
            "message": "User created successfully",
            "user": {
                "id": new_user.id,
                "full_name": new_user.full_name,
                "email": new_user.email,
                "role": new_user.role,
                "team": new_user.team,
                "status": new_user.status
            }
        }), 201
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()

# Get all users API endpoint
@main.route("/api/admin/users", methods=["GET", "OPTIONS"])
@cross_origin(origins=["http://localhost:3000"], supports_credentials=True)
def get_all_users():
    if request.method == "OPTIONS":
        return jsonify({}), 200
    
    # Check if user is admin
    if session.get("role") != "admin":
        return jsonify({"error": "Unauthorized access"}), 403
    
    try:
        db = SessionLocal()
        users = db.query(User).all()
        
        users_list = []
        for user in users:
            users_list.append({
                "id": user.id,
                "full_name": user.full_name,
                "email": user.email,
                "role": user.role,
                "team": user.team,
                "status": user.status
            })
        
        return jsonify({
            "users": users_list
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()



# -----------------------------------------------------------------------------
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
        return "No message received."
    
    user_input = msg
    user_role = session.get("role", "employee")  # Default to employee if no role
    print(f"[LEGACY CHAT] {user_role.upper()} User: {user_input}")

    # Initial state with role context - same structure as your API endpoints
    initial_state = {
        "messages": [HumanMessage(content=user_input)],
        "query_type": "",
        "retrieved_data": "",
        "user_role": user_role,  # Pass the user's role to the chatbot
        "user_id": session.get("user_id"),
        "team": session.get("team")
    }

    try:
        # Use the same role-aware chatbot as your API endpoints
        final_state = chatbot_agent.invoke(initial_state)
        response = final_state.get("retrieved_data", "⚠️ No data returned.")
        print(f"[LEGACY CHAT] Bot Response: {response}")
        return response

    except Exception as e:
        print(f"[LEGACY CHAT ERROR] {e}")
        return f"Error: {str(e)}"

# Get manager team members API endpoint
@main.route("/api/manager/team-members", methods=["GET", "OPTIONS"])
@cross_origin(origins=["http://localhost:3000"], supports_credentials=True)
def get_manager_team_members():
    if request.method == "OPTIONS":
        return jsonify({}), 200
    
    # Check if user is manager
    if session.get("role") != "manager":
        return jsonify({"error": "Unauthorized access"}), 403
    
    try:
        manager_team = session.get("team")

        if not manager_team:
            return jsonify({"error": "Manager team not found"}), 400
        
        db = SessionLocal()

        # Get all employees in the same team as the manager
        employees = db.query(User).filter(
            User.team == manager_team,
            User.role == "employee"
        ).order_by(User.full_name).all()

        employees_list = []
        for employee in employees:
            employees_list.append({
                "id": employee.id,
                "full_name": employee.full_name,
                "email": employee.email,
                "role": employee.role,
                "team": employee.team,
                "status": employee.status
            })

        return jsonify({
            "employees": employees_list,
            "team": manager_team,
            "total_count": len(employees_list)
        }), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()

# ----------------------------------------------------------------------------------------
# Update user status API endpoint - Admin only
@main.route("/api/admin/update-status/<int:user_id>", methods=["PUT", "OPTIONS"])
@cross_origin(origins=["http://localhost:3000"], supports_credentials=True)
def update_user_status_api(user_id):
    if request.method == "OPTIONS":
        return jsonify({}), 200
    
    # Check if user is admin
    if session.get("role") != "admin":
        return jsonify({"error": "Unauthorized access"}), 403
    
    try:
        data = request.get_json()
        new_status = data.get("status")
        
        if not new_status:
            return jsonify({"error": "Status is required"}), 400
        
        # Validate status
        valid_statuses = ["active", "inactive"]
        if new_status not in valid_statuses:
            return jsonify({"error": f"Invalid status. Must be one of: {', '.join(valid_statuses)}"}), 400
        
        db = SessionLocal()
        user = db.query(User).get(user_id)
        
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        user.status = new_status
        db.commit()
        
        return jsonify({
            "message": f"Status for {user.full_name} updated to {new_status}",
            "user": {
                "id": user.id,
                "full_name": user.full_name,
                "email": user.email,
                "role": user.role,
                "team": user.team,
                "status": user.status
            }
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()

# Submit Daily Update API endpoint - Employee only
@main.route("/api/employee/submit-daily-update", methods=["POST", "OPTIONS"])
@cross_origin(origins=["http://localhost:3000"], supports_credentials=True)
def submit_daily_update():
    if request.method == "OPTIONS":
        return jsonify({}), 200
    
    # Check if user is employee
    if session.get("role") != "employee":
        return jsonify({"error": "Unauthorized access"}), 403
    
    try:
        data = request.get_json()
        title = data.get("title")
        date_str = data.get("date")  # Expected format: YYYY-MM-DD
        work_done = data.get("work_done")
        reference_link = data.get("reference_link")
        comment = data.get("comment")
        task_id = data.get("task_id")  # Optional - if related to a specific task
        
        # Validate required fields
        if not all([title, date_str, work_done]):
            return jsonify({"error": "Title, date, and work_done are required"}), 400
        
        # Parse date
        try:
            from datetime import datetime
            parsed_date = datetime.strptime(date_str, "%Y-%m-%d").date()
        except ValueError:
            return jsonify({"error": "Invalid date format. Use YYYY-MM-DD"}), 400
        
        # Get user ID from session
        user_id = session.get("user_id")
        
        db = SessionLocal()
        
        # Check if user exists and is active
        user = db.query(User).get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        if user.status != "active":
            return jsonify({"error": "User account is not active"}), 403
        
        # Check if task_id is provided and valid
        if task_id:
            task = db.query(Task).get(task_id)
            if not task:
                return jsonify({"error": "Task not found"}), 404
            
            # Check if task is assigned to this user
            if task.assigned_to_id != user_id:
                return jsonify({"error": "Task not assigned to this user"}), 403
        
        # Check if daily update already exists for this user and date
        existing_update = db.query(DailyUpdate).filter(
            DailyUpdate.user_id == user_id,
            DailyUpdate.date == parsed_date
        ).first()
        
        if existing_update:
            return jsonify({"error": "Daily update already submitted for this date"}), 409
        
        # Create new daily update
        daily_update = DailyUpdate(
            user_id=user_id,
            date=parsed_date,
            title=title,
            work_done=work_done,
            reference_link=reference_link if reference_link else None,
            comment=comment if comment else None,
            task_id=int(task_id) if task_id else None
        )
        
        db.add(daily_update)
        db.commit()
        
        return jsonify({
            "message": "Daily update submitted successfully",
            "daily_update": {
                "id": daily_update.id,
                "title": daily_update.title,
                "date": daily_update.date.strftime("%Y-%m-%d"),
                "work_done": daily_update.work_done,
                "reference_link": daily_update.reference_link,
                "comment": daily_update.comment,
                "task_id": daily_update.task_id
            }
        }), 201
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()

# Get Employee Daily Updates API endpoint
@main.route("/api/employee/daily-updates", methods=["GET", "OPTIONS"])
@cross_origin(origins=["http://localhost:3000"], supports_credentials=True)
def get_employee_daily_updates():
    if request.method == "OPTIONS":
        return jsonify({}), 200
    
    # Check if user is employee
    if session.get("role") != "employee":
        return jsonify({"error": "Unauthorized access"}), 403
    
    try:
        user_id = session.get("user_id")
        db = SessionLocal()
        
        # Get all daily updates for this user
        updates = db.query(DailyUpdate).filter(
            DailyUpdate.user_id == user_id
        ).order_by(DailyUpdate.date.desc()).all()
        
        updates_list = []
        for update in updates:
            updates_list.append({
                "id": update.id,
                "title": update.title,
                "date": update.date.strftime("%Y-%m-%d"),
                "work_done": update.work_done,
                "reference_link": update.reference_link,
                "comment": update.comment,
                "task_id": update.task_id
            })
        
        return jsonify({
            "daily_updates": updates_list
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()

# Get Employee Tasks API endpoint
@main.route("/api/employee/tasks", methods=["GET", "OPTIONS"])
@cross_origin(origins=["http://localhost:3000"], supports_credentials=True)
def get_employee_tasks():
    if request.method == "OPTIONS":
        return jsonify({}), 200
    
    # Check if user is employee
    if session.get("role") != "employee":
        return jsonify({"error": "Unauthorized access"}), 403
    
    try:
        user_id = session.get("user_id")
        db = SessionLocal()
        
        # Get all tasks assigned to this user
        tasks = db.query(Task).filter(
            Task.assigned_to_id == user_id
        ).order_by(Task.due_date.asc()).all()
        
        tasks_list = []
        for task in tasks:
            # Get assigner name
            assigner = db.query(User).get(task.assigned_by_id)
            assigner_name = assigner.full_name if assigner else "Unknown"
            
            tasks_list.append({
                "id": task.id,
                "title": task.title,
                "description": task.description,
                "assigned_date": task.assigned_date.strftime("%Y-%m-%d") if task.assigned_date else None,
                "due_date": task.due_date.strftime("%Y-%m-%d") if task.due_date else None,
                "status": task.status,
                "assigned_by": assigner_name
            })
        
        return jsonify({
            "tasks": tasks_list
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()

# Manager Chatbot API endpoint
@main.route("/api/manager/chatbot", methods=["POST", "OPTIONS"])
@cross_origin(origins=["http://localhost:3000"], supports_credentials=True)
def manager_chatbot_api():
    if request.method == "OPTIONS":
        return jsonify({}), 200
    
    # Check if user is manager
    if session.get("role") != "manager":
        return jsonify({"error": "Unauthorized access"}), 403
    
    try:
        data = request.get_json()
        user_input = data.get("message")
        
        if not user_input:
            return jsonify({"error": "Message is required"}), 400
        
        print(f"[MANAGER CHATBOT] User: {session.get('full_name')} - Input: {user_input}")

        # Initial state with role context for the single chatbot
        initial_state = {
            "messages": [HumanMessage(content=user_input)],
            "query_type": "",
            "retrieved_data": "",
            "user_role": "manager",  # The chatbot will use this to behave accordingly
            "user_id": session.get("user_id"),
            "team": session.get("team")
        }

        # Use the single role-aware chatbot
        final_state = chatbot_agent.invoke(initial_state)

        response = final_state.get("retrieved_data", "⚠️ No data returned.")
        print(f"[MANAGER CHATBOT] Bot Response: {response}")
        
        return jsonify({
            "success": True,
            "response": response
        }), 200

    except Exception as e:
        print(f"[MANAGER CHATBOT ERROR] {e}")
        return jsonify({
            "success": False,
            "error": f"Chatbot error: {str(e)}"
        }), 500

# Employee chatbot API endpoint
@main.route("/api/employee/chatbot", methods=["POST", "OPTIONS"])
@cross_origin(origins=["http://localhost:3000"], supports_credentials=True)
def employee_chatbot_api():
    if request.method == "OPTIONS":
        return jsonify({}), 200
    
    # Check if user is employee
    if session.get("role") != "employee":
        return jsonify({"error": "Unauthorized access"}), 403
    
    try:
        data = request.get_json()
        user_input = data.get("message")

        if not user_input:
            return jsonify({"error": "Message is required"}), 400
        
        print(f"[EMPLOYEE CHATBOT] User: {session.get('full_name')} - Input: {user_input}")

        # Initial state with employee role context - FIXED the field name
        initial_state = {
            "messages": [HumanMessage(content=user_input)],
            "query_type": "",
            "retrieved_data": "",
            "user_role": "employee",
            "session_user_id": session.get("user_id"),  # Changed from user_id to session_user_id
            "team": session.get("team")
        }

        # same chatbot with employee context
        final_state = chatbot_agent.invoke(initial_state)

        response = final_state.get("retrieved_data", "⚠️ No data returned.")
        print(f"[EMPLOYEE CHATBOT] Bot Response: {response}")

        return jsonify({
            "success": True,
            "response": response
        }), 200
    
    except Exception as e:
        print(f"[EMPLOYEE CHATBOT ERROR] {e}")
        return jsonify({
            "success": False,
            "error": f"Chatbot error: {str(e)}"
        }), 500
    
# Admin chatbot API endpoint
@main.route("/api/admin/chatbot", methods=["POST", "OPTIONS"])
@cross_origin(origins=["http://localhost:3000"], supports_credentials=True)
def admin_chatbot_api():
    if request.method == "OPTIONS":
        return jsonify({}), 200
    
    # check if user is admin
    if session.get("role") != "admin":
        return jsonify({"error": "Unauthorized access"}), 403
    
    try:
        data = request.get_json()
        user_input = data.get("message")

        if not user_input:
            return jsonify({"error": "Message is required"}), 400
        
        print(f"[ADMIN CHATBOT] User: {session.get('full_name')} - Input: {user_input}")

        # Initial state with admin role context
        initial_state = {
            "messages": [HumanMessage(content=user_input)],
            "query_type": "",
            "retrieved_data": "",
            "user_role": "admin",  # The chatbot will use this to behave accordingly
            "user_id": session.get("user_id"),
            "team": session.get("team")
        }

        # same chatbot with admin context
        final_state = chatbot_agent.invoke(initial_state)

        response = final_state.get("retrieved_data", "⚠️ No data returned.")
        print(f"[ADMIN CHATBOT] Bot Response: {response}")

        return jsonify({
            "success": True,
            "response": response
        }), 200
    
    except Exception as e:
        print(f"[ADMIN CHATBOT ERROR] {e}")
        return jsonify({
            "success": False,
            "error": f"Chatbot error: {str(e)}"
        }), 500
    
# legacy chatbot endpoint







