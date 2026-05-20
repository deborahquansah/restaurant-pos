from flask import Blueprint, request, jsonify
from models import inventory

inventory_bp = Blueprint('inventory', __name__)

# Get all inventory
@inventory_bp.route('/api/inventory', methods=['GET'])
def get_inventory():
    return jsonify(inventory)

# Update inventory item
@inventory_bp.route('/api/inventory/<int:item_id>', methods=['PUT'])
def update_inventory(item_id):
    data = request.get_json()
    item = next((i for i in inventory if i['id'] == item_id), None)

    if item:
        item['quantity'] = data.get('quantity', item['quantity'])
        return jsonify({"success": True, "item": item})
    else:
        return jsonify({"success": False, "message": "Item not found"}), 404

# Get low stock items
@inventory_bp.route('/api/inventory/low-stock', methods=['GET'])
def get_low_stock():
    low_stock_items = [i for i in inventory if i['quantity'] <= i['low_stock']]
    return jsonify(low_stock_items)