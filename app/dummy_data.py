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
    email="admin@risetechvillage.com",
    role="admin",
    team="Operations",
    pword="admin123"
)

session.add_all([admin])
session.commit()


print("✅ Dummy data added successfully.")
