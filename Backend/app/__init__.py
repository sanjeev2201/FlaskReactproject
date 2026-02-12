from flask import Flask
from flask_cors import CORS


def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///Employee.db'
    app.config['JWT_SECRET_KEY'] = '567567tygjhyhiu098rtrtgjklkjkhjggyy'
    CORS(app)
    return app

app = create_app()

from app.Auth import auth_bp
from app.SignUp import signup_bp




app.register_blueprint(auth_bp)
app.register_blueprint(signup_bp)