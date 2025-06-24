from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from ..database import Base

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False)  # e.g., 'admin', 'employee', 'manager'
    team = Column(String(100), nullable=True)  # Add team field
    created_at = Column(DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<User(id={self.id}, username='{self.username}', role='{self.role}')>"
    
    def to_dict(self):
        """Convert user object to dictionary for JSON serialization."""
        return {
            'id': self.id,
            'username': self.username,
            'role': self.role,
            'team': self.team,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }