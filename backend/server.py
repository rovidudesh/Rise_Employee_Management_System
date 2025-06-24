from app import create_app

app = create_app()

if __name__ == "__main__":
    with app.app_context():
        print("Flask API server starting...")
        print("Manager creation endpoint: POST http://localhost:5000/api/auth/create_manager")
    app.run(debug=True, port=5000)