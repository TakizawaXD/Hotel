from app import create_app

app = create_app()

if __name__ == "__main__":
    # Esto es solo para desarrollo local, Gunicorn no lo usará.
    app.run(host='0.0.0.0', port=5000)
