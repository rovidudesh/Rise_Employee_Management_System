from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float
from datetime import datetime
from ..database import Base

class Task(Base):
    __tablename__ = 'tasks'
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    department = Column(String(100), nullable=False)
    date = Column(DateTime, nullable=False)
    priority = Column(String(20), nullable=False)  # 'low', 'medium', 'high'
    time_spent = Column(Float, nullable=False)  # Hours spent on task
    submitted_by = Column(Integer, ForeignKey('users.id'), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        """Convert task object to dictionary for JSON serialization"""
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'department': self.department,
            'date': self.date.isoformat() if self.date else None,
            'priority': self.priority,
            'time_spent': self.time_spent,
            'submitted_by': self.submitted_by,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }