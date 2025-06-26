from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import timedelta
from ..database import SessionLocal
from ..models.user import User
from .utils import manager_required

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/create_manager', methods=['POST'])
def create_manager():
    """Endpoint to create a manager manually."""
    data = request.get_json()

    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    required_fields = ['username', 'password']
    missing_fields = [field for field in required_fields if not data.get(field)]

    if missing_fields:
        return jsonify({"error": f"Missing required fields: {', '.join(missing_fields)}"}), 400
    
    session = SessionLocal()
    try: 
        # check if user already exists
        existing_user = session.query(User).filter(User.username == data.get('username')).first()
        if existing_user:
            return jsonify({"error": "User with this name already exists"}), 409
        
        # create password hash
        password_hash = generate_password_hash(data.get('password'))

        # create new manager
        new_manager = User(
            full_name=data.get('full_name'),
            email=data.get('email'),
            username=data.get('username'),
            password_hash=password_hash,
            role='manager',
            team=data.get('team', 'Management')
        )

        session.add(new_manager)
        session.commit()

        return jsonify({
            "message": "Manager created successfully",
            "user": {
                "id": new_manager.id,
                "username": new_manager.username,
                "role": new_manager.role,
                "team": new_manager.team
            }
        }), 201
    
    except Exception as e:
        session.rollback()
        return jsonify({"error": f"Database error: {str(e)}"}), 500
    finally:
        session.close()

@auth_bp.route('/login', methods=['POST'])
def login():
    """Login endpoint for both managers and employees"""
    data = request.get_json()
    
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    required_fields = ['username', 'password']
    missing_fields = [field for field in required_fields if not data.get(field)]
    
    if missing_fields:
        return jsonify({"error": f"Missing required fields: {', '.join(missing_fields)}"}), 400
    
    session = SessionLocal()
    try:
        # Find user by username
        user = session.query(User).filter(User.username == data.get('username')).first()
        
        if not user:
            return jsonify({"error": "Invalid credentials"}), 401
        
        # Check password
        if not check_password_hash(user.password_hash, data.get('password')):
            return jsonify({"error": "Invalid credentials"}), 401
        
        # Create JWT token with user role
        access_token = create_access_token(
            identity=str(user.id),
            additional_claims={"role": user.role, "username": user.username},
            expires_delta=timedelta(hours=24)
        )
        
        return jsonify({
            "message": "Login successful",
            "access_token": access_token,
            "user": {
                "id": user.id,
                "username": user.username,
                "role": user.role,
                "team": user.team
            }
        }), 200
        
    except Exception as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500
    finally:
        session.close()

@auth_bp.route('/create-employee', methods=['POST'])
@manager_required
def create_employee():
    """Endpoint to create an employee manually."""
    data = request.get_json()

    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    required_fields = ['full_name', 'email', 'username', 'password', 'role']
    missing_fields = [field for field in required_fields if not data.get(field)]

    if missing_fields:
        return jsonify({"error": f"Missing required fields: {', '.join(missing_fields)}"}), 400
    
    # Validate role
    if data.get('role') not in ['employee', 'manager']:
        return jsonify({"error": "Invalid role. Must be 'employee' or 'manager'"}), 400
    
    session = SessionLocal()
    try:
        # Check if username already exists
        existing_username = session.query(User).filter(User.username == data.get('username')).first()
        if existing_username:
            return jsonify({"error": "Username already exists"}), 409
        
        # Check if email already exists
        existing_email = session.query(User).filter(User.email == data.get('email')).first()
        if existing_email:
            return jsonify({"error": "Email already exists"}), 409
        
        # Create password hash
        password_hash = generate_password_hash(data.get('password'))

        # Create new employee
        new_employee = User(
            full_name=data.get('full_name'),
            email=data.get('email'),
            username=data.get('username'),
            password_hash=password_hash,
            role=data.get('role'),
            team=data.get('team', 'General')
        )

        session.add(new_employee)
        session.commit()

        return jsonify({
            "message": f"{data.get('role').capitalize()} created successfully",
            "user": new_employee.to_dict()
        }), 201
    
    except Exception as e:
        session.rollback()
        return jsonify({"error": f"Database error: {str(e)}"}), 500
    finally:
        session.close()

@auth_bp.route('/test-token', methods=['GET'])
@manager_required
def test_token():
    """Test endpoint to verify JWT token is working"""
    return jsonify({"message": "Token is valid, you are authenticated as manager!"}), 200