from app.database import SessionLocal, init_db
from app.models import User, DailyUpdate, Task
from datetime import date


# Initialize database tables
init_db()

# Open session
session = SessionLocal()

# --- USERS ---
manager = User(full_name="Alice Johnson", role="manager", team="Engineering")
employee1 = User(full_name="Sam Wilson", role="employee", team="Engineering")
employee2 = User(full_name="Taylor Smith", role="employee", team="Engineering")

session.add_all([manager, employee1, employee2])
session.commit()

# --- DAILY UPDATES ---
update1 = DailyUpdate(
    user_id=employee1.id,
    date=date(2025, 6, 12),
    title="Security Patch Deployment",
    work_done="Applied critical patches to production systems.",
    reference_links="https://github.com/org/repo/pull/123",
    comment="Need review from security team"
)

update2 = DailyUpdate(
    user_id=employee2.id,
    date=date(2025, 6, 13),
    title="UI Redesign",
    work_done="Completed new dashboard design in Figma.",
    reference_links="https://figma.com/file/xyz",
    comment=None
)

session.add_all([update1, update2])
session.commit()

# --- TASKS ---
task1 = Task(
    title="Optimize DB Queries",
    description="Refactor ORM queries for better performance.",
    due_date=date(2025, 6, 20),
    assigned_by_id=manager.id,
    assigned_to_id=employee1.id
)

task2 = Task(
    title="Update CI/CD Pipeline",
    description="Migrate from Jenkins to GitHub Actions.",
    due_date=date(2025, 6, 22),
    assigned_by_id=manager.id,
    assigned_to_id=employee2.id
)

session.add_all([task1, task2])
session.commit()

print("✅ Dummy data inserted into employee_task2.db.")
