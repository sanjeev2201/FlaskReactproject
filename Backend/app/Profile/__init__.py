import os
from flask import Blueprint, request, jsonify, current_app, url_for
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from app.Models import User,db


# Create a Blueprint (register this in your main app.py)
profile_bp = Blueprint('profile', __name__, url_prefix='/api')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@profile_bp.route('/profile/', methods=['GET'])
@jwt_required()
def get_profile():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({"message": "User not found"}), 404

    # Safely get role name
    role_name = user.roles[0].name if user.roles else "User"

    # Construct image URL
    profile_image_url = None
    if hasattr(user, 'profile_image') and user.profile_image:
        profile_image_url = url_for('static', filename=f'profile_pics/{user.profile_image}', _external=True)

    return jsonify({
        "username": user.username,
        "email": user.email,
        "role": role_name,
        # Ensure you add 'location' and 'about' columns to your User model
        "location": getattr(user, 'location', ''), 
        "about": getattr(user, 'about', ''),
        "profile_image": profile_image_url
    }), 200

@profile_bp.route('/profile/', methods=['PUT'])
@jwt_required()
def update_profile():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404
    
    # Check if the request is multipart/form-data (File Upload)
    if request.content_type and 'multipart/form-data' in request.content_type:
        user.username = request.form.get('username', user.username)
        user.email = request.form.get('email', user.email)
        
        if hasattr(user, 'location'):
            user.location = request.form.get('location', user.location)
        if hasattr(user, 'about'):
            user.about = request.form.get('about', user.about)

        # Handle Image Upload
        if 'profile_image' in request.files:
            file = request.files['profile_image']
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                unique_filename = f"user_{current_user_id}_{filename}"
                
                # Define upload path (app/static/profile_pics)
                upload_folder = os.path.join(current_app.root_path, 'static', 'profile_pics')
                os.makedirs(upload_folder, exist_ok=True)
                
                file.save(os.path.join(upload_folder, unique_filename))
                
                if hasattr(user, 'profile_image'):
                    user.profile_image = unique_filename
    else:
        # Handle standard JSON request
        data = request.get_json()
        user.username = data.get('username', user.username)
        user.email = data.get('email', user.email)
        
    try:
        db.session.commit()
        
        # Construct image URL to return
        profile_image_url = None
        if hasattr(user, 'profile_image') and user.profile_image:
            profile_image_url = url_for('static', filename=f'profile_pics/{user.profile_image}', _external=True)

        return jsonify({
            "message": "Profile updated successfully",
            "profile_image": profile_image_url
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error updating profile", "error": str(e)}), 500
