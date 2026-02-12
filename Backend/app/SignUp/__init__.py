from flask import Blueprint, request, jsonify
signup_bp = Blueprint('signup', __name__ , url_prefix='/signup')

@signup_bp.route('/organization/', methods=['GET'])
def get_organizations():
    data = [
        {"id": 1, "name": "Adansa"},
        {"id": 2, "name": "RealBook"},
        {"id": 3, "name": "digitalinfo"}
    ]
    return jsonify(data)

@signup_bp.route('/role/', methods=['GET'])
def get_role():
    data = [
        {"id": 1, "name": "Admin"},
        {"id": 2, "name": "Employee"},
        # {"id": 3, "name": "Organization C"}
    ]
    return jsonify(data)

@signup_bp.route('/Register/', methods=['POST'])
def Register():
    payload = request.get_json()
    print(payload)
    return {"message": "New Employee added successful"}