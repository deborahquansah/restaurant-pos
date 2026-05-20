from flask import Blueprint, request, jsonify
from models import users

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    # Find user
    user = next((u for u in users if u['username'] == username and u['password'] == password), None)

    if user:
        return jsonify({
            "success": True,
            "user": {
                "id": user['id'],
                "name": user['name'],
                "role": user['role']
            }
        })
    else:
        return jsonify({
            "success": False,
            "message": "Invalid username or password"
        }), 401