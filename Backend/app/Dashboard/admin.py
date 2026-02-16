from flask import Blueprint,request,jsonify
from app.Models import Role, User , db 
from app.Serializer import UserSchema
from flask_jwt_extended import jwt_required
admin_bp = Blueprint('admin', __name__ , url_prefix='/api')

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
    