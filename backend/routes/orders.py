from flask import Blueprint, request, jsonify
from flask_socketio import emit
from models import orders, menu_items
from datetime import datetime

orders_bp = Blueprint('orders', __name__)

# Get all orders
@orders_bp.route('/api/orders', methods=['GET'])
def get_orders():
    return jsonify(orders)

# Get menu items
@orders_bp.route('/api/menu', methods=['GET'])
def get_menu():
    return jsonify(menu_items)

# Add new menu item
@orders_bp.route('/api/menu', methods=['POST'])
def add_menu_item():
    data = request.get_json()
    name = data.get('name')
    price = data.get('price')
    category = data.get('category')
    available = data.get('available', True)

    if not name or not price or not category:
        return jsonify({"success": False, "message": "All fields are required"}), 400

    new_item = {
        "id": len(menu_items) + 1,
        "name": name,
        "price": float(price),
        "category": category,
        "available": available
    }
    menu_items.append(new_item)
    return jsonify({"success": True, "item": new_item}), 201

# Create new order
@orders_bp.route('/api/orders', methods=['POST'])
def create_order():
    data = request.get_json()
    order = {
        "id": len(orders) + 1,
        "items": data.get('items'),
        "total": data.get('total'),
        "payment_method": data.get('payment_method'),
        "status": "pending",
        "cashier": data.get('cashier'),
        "branch": data.get('branch'),
        "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    orders.append(order)
    return jsonify({"success": True, "order": order}), 201

# Update order status (kitchen marks as done)
@orders_bp.route('/api/orders/<int:order_id>/status', methods=['PUT'])
def update_order_status(order_id):
    data = request.get_json()
    order = next((o for o in orders if o['id'] == order_id), None)

    if order:
        order['status'] = data.get('status')
        return jsonify({"success": True, "order": order})
    else:
        return jsonify({"success": False, "message": "Order not found"}), 404