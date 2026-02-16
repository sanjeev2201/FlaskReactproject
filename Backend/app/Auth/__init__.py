from flask import Blueprint,request,jsonify
auth_bp = Blueprint('auth', __name__ , url_prefix='/auth')
from app.Models import User
from werkzeug.security import check_password_hash
from werkzeug.security import generate_password_hash
from app.Models import  db
from flask_jwt_extended import create_access_token , create_refresh_token
#<...............................................>

@auth_bp.route('/login/', methods=['POST'])
def login():
    payload = request.get_json()
    useremail = payload['email']
    userpassword = payload['password']
    print(userpassword)
    user =db.session.query(User).filter_by(email=useremail).first()

    if user and check_password_hash(user.password, userpassword):
            access_token = create_access_token(
                identity=user.id,   # store user id
                additional_claims={
                   "roles": [role.name for role in user.roles]
                }
            )
            refresh_token = create_refresh_token(identity=user.id)
            data = {
                    'access_token':access_token,
                    'refresh_token':refresh_token,
                    'roles' : [role.name for role in user.roles]
                    }
            return jsonify(data)
    
    return jsonify({"message": "Invalid credentials"}), 401
    
#<.............................................>


@auth_bp.route('/resetpwd/', methods=['POST'])
def ResetPassword():
    payload = request.get_json()
    useremail = payload['email']
    userpassword = payload['password'].strip()
    user =db.session.query(User).filter_by(email=useremail).first()
    print('reset user emailid : ' , user)
    user.password = generate_password_hash(userpassword)
    db.session.commit()
    return {"message": "Password updated successfully"}