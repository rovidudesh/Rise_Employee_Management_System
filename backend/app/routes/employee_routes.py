from flask import Blueprint, request, jsonify
from backend.app.database import get_db

employee_bp = Blueprint('employee', __name__)

@employee_bp.route('/', methods=['GET'])
def get_employees():
    db = get_db()
    employees = db.execute('SELECT * FROM employee').fetchall()
    return jsonify([dict(row) for row in employees])

