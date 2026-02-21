from flask import Blueprint,request,jsonify
from app.Serializer import UserSchema
from flask_jwt_extended import jwt_required , get_jwt
admin_bp = Blueprint('admin', __name__ , url_prefix='/api')

from app.Models import Organization , Role , User , db
from app.Serializer import OrganizationSchema , RoleSchema
from marshmallow import ValidationError
#........................................................>
@admin_bp.route('/organization/', methods=['GET'])
@jwt_required()
def get_organizations():
    try:
        query_organization= db.session.query(Organization).all()
        organization_schema = OrganizationSchema(many=True)
        return organization_schema.jsonify(query_organization)
    except ValidationError as err:
        return {"errors": err.messages}, 400
@admin_bp.route('/createorganization/', methods=['POST'])
@jwt_required()
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

@admin_bp.route('/createrole/', methods=['POST'])
@jwt_required()
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

@admin_bp.route('/role/', methods=['GET'])
@jwt_required()
def get_role():
    query_role = db.session.query(Role).filter_by(status=1).all()
    role_schema = RoleSchema(many=True)
    return role_schema.jsonify(query_role)

@admin_bp.route('/organization/<int:id>/', methods=['PUT'])
@jwt_required()
def organizationupdatebyadmin(id):
    payload = request.get_json()
    name = payload['name']
    Insert = Organization()
    Insert.id = id
    Insert.name = name
    merged_organization = db.session.merge(Insert)
    db.session.commit()
    return {"message": "Organization updation successful"}

@admin_bp.route('/deleteorganization/<int:id>/', methods=['DELETE'])
@jwt_required()
def deleteorganization(id):
    users = db.session.query(Organization).filter_by(id=id,status=1).first()
    users.status=False
    db.session.commit()
    print('organization deleted successfully !!!!!' , users)
    return {'message' : 'organization deleted successfully !!!!!'}
@admin_bp.route('/trashorganization/', methods=['GET'])
@jwt_required()
def trashorganization():
    query_qrganization = db.session.query(Organization).filter_by(status=0).all()
    organization_schema = OrganizationSchema(many=True)
    return organization_schema.jsonify(query_qrganization)


@admin_bp.route('/restoreorganization/<int:id>/', methods=['PATCH'])
@jwt_required()
def restoreorganization(id):
    users= db.session.query(Organization).filter_by(id=id,status=0).first()
    users.status=True
    db.session.commit()
    print('Organization restored successfully !!!!!' , users)
    return {'message' : 'Role deleted successfully !!!!!'}

@admin_bp.route('/roles/<int:id>/', methods=['PUT'])
@jwt_required()
def roleupdatebyadmin(id):
    payload = request.get_json()
    name = payload['name']
    Insert = Role()
    Insert.id = id
    Insert.name = name
    merged_role = db.session.merge(Insert)
    db.session.commit()
    return {"message": "Roles updation successful"}

@admin_bp.route('/deleterole/<int:id>/', methods=['DELETE'])
@jwt_required()
def deleterole(id):
    users = db.session.query(Role).filter_by(id=id,status=1).first()
    users.status=False
    db.session.commit()
    print('Role deleted successfully !!!!!' , users)
    return {'message' : 'Role deleted successfully !!!!!'}

@admin_bp.route('/trashrole/', methods=['GET'])
@jwt_required()
def trashrole():
    query_role = db.session.query(Role).filter_by(status=0).all()
    role_schema = RoleSchema(many=True)
    return role_schema.jsonify(query_role)


@admin_bp.route('/restorerole/<int:id>/', methods=['PATCH'])
@jwt_required()
def restorerole(id):
    users = db.session.query(Role).filter_by(id=id,status=0).first()
    users.status=True
    db.session.commit()
    print('Role deleted successfully !!!!!' , users)
    return {'message' : 'Role deleted successfully !!!!!'}

@admin_bp.route('/logout/', methods=['POST'])
@jwt_required()
def logout():
    try:
        # Get the JSON payload sent from the frontend
        data = request.get_json()
        
        # Extract the data
        access_token = data.get('AccessToken')
        refresh_token = data.get('RefreshToken')
        role = data.get('role')
        # print(access_token,refresh_token,role)
        print('token blacklisted')
        return jsonify({"message": "Logout successful"}), 200

    except Exception as e:
        print(f"Logout error: {e}")
        return jsonify({"message": "Logout failed", "error": str(e)}), 500


#........................................................>
@admin_bp.route('/users/<int:id>', methods=['GET'])
@jwt_required()
def get_user(id):
    user = User.query.get_or_404(id)
    user_schema = UserSchema()   
    return user_schema.jsonify(user)
@admin_bp.route('/userupdatebyadmin/<int:id>', methods=['PUT'])
@jwt_required()
def userupdationbyadmin(id):
    payload = request.json
    print(payload)
    Insert = User()
    Insert.id = id
    Insert.username=payload['username']
    Insert.email=payload['email']
    Insert.organization_id = payload['organization_id']
    roles_data = payload['roles']
    for role_id in roles_data:
        role = Role.query.get(role_id)
        if role:
            Insert.roles.append(role)
    merged_user = db.session.merge(Insert)
    db.session.commit()
    return {"message": "New Employee updation successful"}
@admin_bp.route('/deletebyadmin/<int:id>', methods=['DELETE'])
def deletebyadmin(id):
    users = db.session.query(User).filter_by(id=id,status=1).first()
    users.status=False
    db.session.commit()
    print('user deleted successfully !!!!!' , users)
    return {'message' : 'user deleted successfully !!!!!'}

@admin_bp.route('/restorebyadmin/<int:id>', methods=['PATCH'])
def restorebyadmin(id):
    users = db.session.query(User).filter_by(id=id,status=0).first()
    users.status=True
    db.session.commit()
    print('user restore successfully !!!!!' , users)
    return {'message' : 'user restore successfully !!!!!'}
    