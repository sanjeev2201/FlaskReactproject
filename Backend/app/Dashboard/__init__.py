from flask import Blueprint,request,jsonify
from app.Models import User , db 
from app.Serializer import UserSchema
from flask_jwt_extended import jwt_required, get_jwt_identity , get_jwt
dashboard_bp = Blueprint('dashboard', __name__ , url_prefix='/api')


@dashboard_bp.route('/dashboard/', methods=['GET'])
@jwt_required()
def get_users():
    Userroles = get_jwt()
    if "Admin" not in Userroles["roles"]:
        current_user = get_jwt_identity()
        print('access deny userid : ' ,current_user)
        users_schema = UserSchema(many=True) # use for single schema
        users = db.session.query(User).filter_by(id=current_user).all()
        return users_schema.jsonify(users)
        
    users_schema = UserSchema(many=True)
    users = db.session.query(User).all()
    return users_schema.jsonify(users)
    
@dashboard_bp.route('/users/<int:id>', methods=['GET'])
# @jwt_required()
def get_user(id):
    user = User.query.get_or_404(id)
    user_schema = UserSchema()   # not many=True
    return user_schema.jsonify(user)



