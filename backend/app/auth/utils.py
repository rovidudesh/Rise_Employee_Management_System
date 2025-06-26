from functools import wraps
from flask import request, jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity, get_jwt
from ..database import SessionLocal
from ..models.user import User

def token_required(f):
    """Decorator to check if JWT token is valid"""
    @wraps(f)
    def decorated(*args, **kwargs):
        try:
            verify_jwt_in_request()
            return f(*args, **kwargs)
        except Exception as e:
            print(f"Token verification error: {e}")  # Debug print
            return jsonify({"error": "Invalid or missing token"}), 401
    return decorated

def manager_required(f):
    """Decorator to check if user is a manager"""
    @wraps(f)
    def decorated(*args, **kwargs):
        try:
            verify_jwt_in_request()
            current_user_id = get_jwt_identity()
            claims = get_jwt()
            
            print(f"Current user ID: {current_user_id}")  # Debug print
            print(f"Claims: {claims}")  # Debug print
            
            if claims.get('role') != 'manager':
                return jsonify({"error": "Manager access required"}), 403
                
            return f(*args, **kwargs)
        except Exception as e:
            print(f"Manager verification error: {e}")  # Debug print
            return jsonify({"error": "Invalid token or insufficient permissions"}), 401
    return decorated

def get_current_user():
    """Get current user from JWT token"""
    try:
        verify_jwt_in_request()
        current_user_id = get_jwt_identity()
        
        session = SessionLocal()
        try:
            user = session.query(User).filter(User.id == current_user_id).first()
            return user
        finally:
            session.close()
    except Exception:
        return None