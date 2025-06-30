from app.database import SessionLocal, engine
from app.models import Base, User, Task, DailyUpdate
from datetime import date

# Recreate the tables (only for development; be careful in production)
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

session = SessionLocal()

# --- USERS ---
admin = User(
    f_name="Admin",
    l_name="User",
    full_name="Admin User",
    email="admin@therisevillage.com",
    role="admin",
    team="Operations",
    pword="admin123"
)

manager = User(
    f_name="Alice",
    l_name="Johnson",
    full_name="Alice Johnson",
    email="alice.johnson@therisevillage.com",
    role="manager",
    team="Engineering",
    pword="alice123"
)

employee1 = User(
    f_name="Sam",
    l_name="Wilson",
    full_name="Sam Wilson",
    email="sam.wilson@therisevillage.com",
    role="employee",
    team="Engineering",
    pword="sam123"
)

employee2 = User(
    f_name="Taylor",
    l_name="Smith",
    full_name="Taylor Smith",
    email="taylor.smith@therisevillage.com",
    role="employee",
    team="Engineering",
    pword="taylor123"
)

session.add_all([admin, manager, employee1, employee2])
session.commit()

# --- TASKS ---
task1 = Task(
    title="Optimize Backend",
    description="Improve database queries and indexing.",
    assigned_date=date(2025, 6, 10),
    due_date=date(2025, 6, 15),
    status="open",
    assigned_by_id=manager.id,
    assigned_to_id=employee1.id
)

task2 = Task(
    title="Frontend Redesign",
    description="Update the UI components using Tailwind.",
    assigned_date=date(2025, 6, 11),
    due_date=date(2025, 6, 17),
    status="open",
    assigned_by_id=manager.id,
    assigned_to_id=employee2.id
)

session.add_all([task1, task2])
session.commit()

# --- DAILY UPDATES ---
update1 = DailyUpdate(
    user_id=employee1.id,
    date=date(2025, 6, 12),
    title="Database Optimization",
    task_id=task1.id,
    work_done="Refactored ORM and added proper indexing.",
    reference_link="https://github.com/org/repo/pull/123",
    comment="Ready for review"
)

update2 = DailyUpdate(
    user_id=employee2.id,
    date=date(2025, 6, 13),
    title="UI Enhancements",
    task_id=task2.id,
    work_done="Refined dashboard layout and improved responsiveness.",
    reference_link=None,
    comment=None
)

session.add_all([update1, update2])
session.commit()

print("✅ Dummy data added successfully.")
