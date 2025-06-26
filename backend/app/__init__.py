from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager

def create_app():
    app = Flask(__name__)
    app.config.from_object('app.config.Config')

    # initialize extensions
    CORS(app, origins = ["http://localhost:3000"]) 
    jwt = JWTManager(app)

    # initialize database when the app starts
    try:
        from .database import init_db
        init_db()
        print("Database initialized successfully.")
    except Exception as e:
        print(f"Error initializing database: {e}")

    # Import and register blueprints
    try:
        from .auth.routes import auth_bp
        from .employees.routes import employees_bp

        app.register_blueprint(auth_bp)
        app.register_blueprint(employees_bp)
        
        print("Auth routes registered successfully.")
    except ImportError as e:
        print(f"Blueprint registration error: {e}")

    return app