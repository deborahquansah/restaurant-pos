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