from flask import Blueprint
signup_bp = Blueprint('signup', __name__ , url_prefix='/signup')

@signup_bp.route('/Register', methods=['POST'])
def Register():
    return {"message": "New Employee added successful"}