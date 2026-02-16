from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash
signup_bp = Blueprint('signup', __name__ , url_prefix='/signup')
from app.Models import Organization , Role , User , db
from flask_jwt_extended import JWTManager
from app.Serializer import OrganizationSchema , RoleSchema
from marshmallow import ValidationError


@signup_bp.route('/organization/', methods=['GET'])
def get_organizations():
    try:
        query_organization= db.session.query(Organization).all()
        organization_schema = OrganizationSchema(many=True)
        return organization_schema.jsonify(query_organization)
    except ValidationError as err:
        return {"errors": err.messages}, 400
@signup_bp.route('/createorganization/', methods=['POST'])
def create_organization():
    payload = request.get_json()
    id = payload['id']
    name = payload['name']
    Insert = Organization()
    Insert.id = id
    Insert.name = name
    db.session.add(Insert)
    db.session.commit()
    return {'message': 'organization added successfully !!!!'}

@signup_bp.route('/createrole/', methods=['POST'])
def create_role():
    payload = request.get_json()
    id = payload['id']
    name = payload['name']
    Insert = Role()
    Insert.id = id
    Insert.name = name
    db.session.add(Insert)
    db.session.commit()
    return {'message': 'roles added successfully !!!!'}

@signup_bp.route('/role/', methods=['GET'])
def get_role():
    query_role = db.session.query(Role).all()
    role_schema = RoleSchema(many=True)
    return role_schema.jsonify(query_role)

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


