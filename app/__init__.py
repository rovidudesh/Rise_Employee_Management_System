from flask import Flask
from dotenv import load_dotenv
from .database import init_db

def create_app():
    load_dotenv()  # Load environment variables from .env file

    app = Flask(__name__)

    # DB initialization
    init_db()

    # Register routes
    from .routes import main
    app.register_blueprint(main)

    return app
