def init_employee_table(db):
    db.execute("""
               CREATE TABLE IF NOT EXISTS employee (
                   id INTEGER PRIMARY KEY AUTOINCREMENT,
                   name TEXT NOT NULL,
                   department TEXT NOT NULL,
                   email TEXT NOT NULL UNIQUE,
               )
               """)