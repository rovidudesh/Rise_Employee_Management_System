from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity
from datetime import datetime
from ..database import SessionLocal
from ..models.user import User
from ..models.task import Task
from ..auth.utils import token_required

employees_bp = Blueprint('employees', __name__, url_prefix='/api/employees')

@employees_bp.route('/submit-task', methods=['POST'])
@token_required
def submit_task():
    """Endpoint for employees to submit tasks"""
    data = request.get_json()
    
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    required_fields = ['title', 'department', 'date', 'priority', 'time_spent']
    missing_fields = [field for field in required_fields if not data.get(field)]
    
    if missing_fields:
        return jsonify({"error": f"Missing required fields: {', '.join(missing_fields)}"}), 400
    
    # Validate priority
    if data.get('priority') not in ['low', 'medium', 'high']:
        return jsonify({"error": "Invalid priority. Must be 'low', 'medium', or 'high'"}), 400
    
    # Validate time_spent is a number
    try:
        time_spent = float(data.get('time_spent'))
        if time_spent <= 0:
            return jsonify({"error": "Time spent must be a positive number"}), 400
    except (ValueError, TypeError):
        return jsonify({"error": "Time spent must be a valid number"}), 400
    
    # Parse date
    try:
        task_date = datetime.fromisoformat(data.get('date').replace('Z', '+00:00'))
    except ValueError:
        return jsonify({"error": "Invalid date format. Use ISO format (YYYY-MM-DDTHH:MM:SS)"}), 400
    
    current_user_id = get_jwt_identity()
    
    session = SessionLocal()
    try:
        # Verify user exists and get user info
        user = session.query(User).filter(User.id == int(current_user_id)).first()
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        # Create new task
        new_task = Task(
            title=data.get('title'),
            description=data.get('description', ''),
            department=data.get('department'),
            date=task_date,
            priority=data.get('priority'),
            time_spent=time_spent,
            submitted_by=int(current_user_id)
        )
        
        session.add(new_task)
        session.commit()
        
        return jsonify({
            "message": "Task submitted successfully",
            "task": new_task.to_dict()
        }), 201
        
    except Exception as e:
        session.rollback()
        return jsonify({"error": f"Database error: {str(e)}"}), 500
    finally:
        session.close()

@employees_bp.route('/my-tasks', methods=['GET'])
@token_required
def get_my_tasks():
    """Get all tasks submitted by the current employee"""
    current_user_id = get_jwt_identity()
    
    session = SessionLocal()
    try:
        tasks = session.query(Task).filter(Task.submitted_by == int(current_user_id)).order_by(Task.created_at.desc()).all()
        
        return jsonify({
            "message": "Tasks retrieved successfully",
            "tasks": [task.to_dict() for task in tasks]
        }), 200
        
    except Exception as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500
    finally:
        session.close()

