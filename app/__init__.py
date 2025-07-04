from flask import Flask
from dotenv import load_dotenv
from .database import init_db
from flask_cors import CORS


def create_app():
    load_dotenv()  # Load environment variables from .env file

    app = Flask(__name__)
    
    # Configure CORS properly
    CORS(app, origins=["http://localhost:3000"], supports_credentials=True)

    app.secret_key = "your_secret_key_here"  

    # DB initialization
    init_db()

    # Register routes
    from .routes import main
    app.register_blueprint(main)

    return app
