from sqlalchemy import create_engine, Column, Integer, String, Text, Date, ForeignKey
from sqlalchemy.orm import declarative_base, relationship, sessionmaker
from datetime import date

# --- Setup Base ---
Base = declarative_base()

# --- Models ---
class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    full_name = Column(String, nullable=False, unique=True)
    role = Column(String)
    team = Column(String)

    daily_updates = relationship("DailyUpdate", back_populates="user")
    assigned_tasks = relationship("Task", back_populates="assigned_to", foreign_keys="Task.assigned_to_id")
    created_tasks = relationship("Task", back_populates="assigned_by", foreign_keys="Task.assigned_by_id")

class DailyUpdate(Base):
    __tablename__ = 'daily_updates'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    date = Column(Date, nullable=False)
    title = Column(String)
    work_done = Column(Text)
    reference_links = Column(Text)
    comment = Column(Text)

    user = relationship("User", back_populates="daily_updates")

class Task(Base):
    __tablename__ = 'tasks'
    id = Column(Integer, primary_key=True)
    title = Column(String) 
    description = Column(Text)
    due_date = Column(Date)
    status = Column(String, default="open")
    assigned_to_id = Column(Integer, ForeignKey('users.id'))
    assigned_by_id = Column(Integer, ForeignKey('users.id'))

    assigned_to = relationship("User", back_populates="assigned_tasks", foreign_keys=[assigned_to_id])
    assigned_by = relationship("User", back_populates="created_tasks", foreign_keys=[assigned_by_id])

# --- Create new database ---
engine = create_engine("sqlite:///employee_task2.db", echo=False)
Base.metadata.create_all(engine)

# --- Bind session ---
Session = sessionmaker(bind=engine)
session = Session()

print("✅ Fresh DB 'employee_task2.db' initialized and session is ready.")