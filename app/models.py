from sqlalchemy import create_engine, Column, Integer, String, Text, Date, ForeignKey, DateTime
from sqlalchemy.orm import declarative_base, relationship, sessionmaker
from datetime import date, datetime

Base = declarative_base()


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    f_name = Column(String, nullable=False)
    l_name = Column(String, nullable=False)
    full_name = Column(String, nullable=False, unique=True)  # Optional redundancy for ease
    email = Column(String, nullable=False, unique=True) # Unique email for each user
    role = Column(String, nullable=False)  # 'admin', 'manager', 'employee'
    team = Column(String)
    status = Column(String, default="active")  # 'active', 'inactive', etc.
    pword = Column(String, nullable=False)  # Hashed password ideally

    # Relationships
    updates = relationship("DailyUpdate", back_populates="user", cascade="all, delete-orphan")
    assigned_tasks = relationship("Task", back_populates="assignee", foreign_keys='Task.assigned_to_id')
    created_tasks = relationship("Task", back_populates="assigner", foreign_keys='Task.assigned_by_id')


class Task(Base):
    __tablename__ = 'tasks'

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    assigned_date = Column(Date)
    due_date = Column(Date)
    status = Column(String, default="open")  # 'open', 'in_progress', 'completed'

    # Foreign Keys
    assigned_to_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    assigned_by_id = Column(Integer, ForeignKey('users.id'), nullable=False)

    # Relationships
    assignee = relationship("User", back_populates="assigned_tasks", foreign_keys=[assigned_to_id])
    assigner = relationship("User", back_populates="created_tasks", foreign_keys=[assigned_by_id])
    updates = relationship("DailyUpdate", back_populates="task")


class DailyUpdate(Base):
    __tablename__ = 'daily_updates'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    date = Column(Date, nullable=False)
    title = Column(String, nullable=False)
    task_id = Column(Integer, ForeignKey('tasks.id'), nullable=True)
    work_done = Column(Text, nullable=False)
    reference_link = Column(Text, nullable=True)
    comment = Column(Text, nullable=True)

    # Relationships
    user = relationship("User", back_populates="updates")
    task = relationship("Task", back_populates="updates")

class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True)
    session_id = Column(String, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    sender = Column(String, nullable=False)  # 'user' or 'bot'
    message = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", backref="chat_messages")
