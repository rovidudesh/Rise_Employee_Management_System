from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
from .models import Base

# SQLite database URI
DATABASE_URL = "sqlite:///employee_task2.db"

# Create engine
engine = create_engine(DATABASE_URL, echo=False)

# Create session
SessionLocal = scoped_session(sessionmaker(autocommit=False, autoflush=False, bind=engine))



# Initialize tables
def init_db():
    Base.metadata.create_all(bind=engine)
    print("✅ Database initialized and session is ready.")


