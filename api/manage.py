from flask.cli import FlaskGroup

from project import create_app, db
from project.models import Users

app = create_app()
cli = FlaskGroup(create_app=create_app)


@app.shell_context_processor
def make_shell_context():
    return dict(
        Users=Users,
    )


@app.cli.command()
def deploy():
    # Add Admin user
    Users.initiate_admin_user()


if __name__ == "__main__":
    cli()
