from flask.cli import FlaskGroup
from app import create_app, db

app = create_app()
cli = FlaskGroup(app)

@cli.command("init_db")
def init_db():
    db.create_all()
    print("Base de datos inicializada.")

if __name__ == '__main__':
    cli()
