from flask import Blueprint,request,jsonify
from app.Models import User , db 
from app.Serializer import UserSchema
from flask_jwt_extended import jwt_required, get_jwt_identity , get_jwt
dashboard_bp = Blueprint('dashboard', __name__ , url_prefix='/api')


@dashboard_bp.route('/dashboard/', methods=['GET'])
@jwt_required()
def get_users():
    Userroles = get_jwt()
    if "Admin" in Userroles["roles"]:
        current_user = get_jwt_identity()
        users = db.session.query(User).filter_by(id=current_user,status=1).first()
        organization_id = users.organization_id
        users_schema = UserSchema(many=True)
        current_page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        offset_value = (current_page - 1) * per_page
        # Active users with pagination
        users = db.session.query(User).filter_by(status=True,organization_id=int(organization_id)).offset(offset_value).limit(per_page).all()
        
        trash_users = db.session.query(User).filter_by(status=False,organization_id=int(organization_id)).all()

        # Counts
        active_count = db.session.query(User).filter_by(status=True,organization_id=int(organization_id)).count()
        trash_count = db.session.query(User).filter_by(status=False,organization_id=int(organization_id)).count()
        total_users = db.session.query(User).filter_by(organization_id=int(organization_id)).count()

        # Total pages
        total_pages = (active_count + per_page - 1) // per_page
        if len(users)>0:
            # Serialize data properly
            response_data = {
                "data": users_schema.dump(users),
                "current_page": current_page,
                "pages": total_pages,
                "TrashAllusers": users_schema.dump(trash_users),
                "AllUsers": total_users,
                "ActiveUsers": active_count,
                "TrashUsers": trash_count
            }
            # print(response_data)
            return jsonify(data=response_data)

    
        else:
            response_data = {"data":[],"TrashAllusers":users_schema.dump(trash_users),'AllUsers':total_users,'ActiveUsers':0,'TrashUsers':trash_count}
            return jsonify(response_data)
    # other than admin user
    else:   
        current_user = get_jwt_identity()
        # print('access deny userid : ' ,current_user)
        users_schema = UserSchema(many=True)
        users = db.session.query(User).filter_by(id=current_user,status=1).all()
        response_data = {
                "data": users_schema.dump(users),
            }
        # print(response_data)
        return jsonify(data=response_data)
    




