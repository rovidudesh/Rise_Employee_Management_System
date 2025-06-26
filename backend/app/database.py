from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Database URL from config or default to SQLite
DATABASE_URL = os.environ.get('DATABASE_URL', 'sqlite:///employee_management.db')

# Create SQLAlchemy engine
engine = create_engine(DATABASE_URL, echo=True)

# Create SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create Base class for models
Base = declarative_base()

def init_db():
    """Initialize database tables."""
    # Import all models to ensure they are registered with Base
    from .models import User,Task, employee, manager 

    # Create all tables
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully.")

def get_db_session():
    """Get database session fo dependency injection."""
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()

