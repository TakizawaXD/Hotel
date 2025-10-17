import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS

db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__, instance_relative_config=True)

    app.config.from_mapping(
        SECRET_KEY='dev',
        SQLALCHEMY_DATABASE_URI=f"sqlite:///{os.path.join(app.instance_path, 'database.db')}",
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
    )

    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    db.init_app(app)
    migrate.init_app(app, db, directory='migrations')
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    with app.app_context():
        from . import models
        from .api.habitaciones import habitaciones_bp
        from .api.clientes import clientes_bp
        from .api.reservas import reservas_bp
        from .api.auth import auth_bp  # <-- Importar el nuevo Blueprint

        app.register_blueprint(habitaciones_bp, url_prefix='/api')
        app.register_blueprint(clientes_bp, url_prefix='/api')
        app.register_blueprint(reservas_bp, url_prefix='/api')
        app.register_blueprint(auth_bp, url_prefix='/api') # <-- Registrar el Blueprint

    return app
