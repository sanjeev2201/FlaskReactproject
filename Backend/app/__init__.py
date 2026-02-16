from flask import Flask
from flask_cors import CORS
from app.Models import db
from flask_jwt_extended import JWTManager
from app.Serializer import ma
def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///Employee.db'
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config['JWT_SECRET_KEY'] = '567567tygjhyhiu098rtrtgjklkjkhjggyy'
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = 3600  # 1 hour
    
    CORS(app)
    db.init_app(app)   
    jwt = JWTManager(app)
    jwt.init_app(app)   
    ma.init_app(app)
    return app

app = create_app()

#...........................................
with app.app_context():
    db.create_all()
#...........................................
from app.Auth import auth_bp
from app.SignUp import signup_bp
from app.Dashboard import dashboard_bp

#<................................>

app.register_blueprint(auth_bp)
app.register_blueprint(signup_bp)
app.register_blueprint(dashboard_bp)