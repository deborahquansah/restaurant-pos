from flask import Blueprint, request, jsonify
from models import users

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

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

@auth_bp.route('/api/users', methods=['GET'])
def get_users():
    safe_users = [{"id": u['id'], "name": u['name'], "username": u['username'], "role": u['role']} for u in users]
    return jsonify(safe_users)

@auth_bp.route('/api/users', methods=['POST'])
def add_user():
    data = request.get_json()
    name = data.get('name')
    username = data.get('username')
    password = data.get('password')
    role = data.get('role')

    existing = next((u for u in users if u['username'] == username), None)
    if existing:
        return jsonify({"success": False, "message": "Username already exists"}), 400

    new_user = {
        "id": len(users) + 1,
        "name": name,
        "username": username,
        "password": password,
        "role": role
    }
    users.append(new_user)
    return jsonify({"success": True, "user": {"id": new_user['id'], "name": new_user['name'], "role": new_user['role']}}), 201