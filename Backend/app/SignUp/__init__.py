from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash
signup_bp = Blueprint('signup', __name__ , url_prefix='/signup')
from app.Models import Organization , Role , User , db





@signup_bp.route('/Register/', methods=['POST'])
def Register():
    payload = request.get_json()
    username = payload['username']
    email = payload['email']
    password = payload['password']
    hashed_password = generate_password_hash(password)
    organization_id = payload['organization']
    roles_data = payload['roles']
    Insert = User()
    Insert.username=username
    Insert.email=email
    Insert.password = hashed_password
    Insert.organization_id = organization_id
    # Insert.roles = roles
    # Add roles properly
    for role_id in roles_data:
        role = Role.query.get(role_id)
        if role:
            Insert.roles.append(role)
    db.session.add(Insert)
    db.session.commit()
    return {"message": "New Employee added successful"}


