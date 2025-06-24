from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import timedelta
from ..database import SessionLocal
from ..models.user import User

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
            identity=user.id,
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