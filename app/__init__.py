from flask import Flask
from dotenv import load_dotenv
from .database import init_db
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from datetime import timedelta
import os


def create_app():
    load_dotenv()  # Load environment variables from .env file

    app = Flask(__name__)
    
    # Add explicit CORS configuration for all routes and methods
    CORS(app, resources={r"/*": {"origins": "*", "methods": ["GET", "POST", "OPTIONS"]}})

    # Configure JWT
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "your_temporary_secret_key")
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours = 8)
    jwt = JWTManager(app)

    app.secret_key = "your_secret_key_here"  


    # DB initialization
    init_db()

    # Register routes
    from .routes import main
    app.register_blueprint(main)

    return app
