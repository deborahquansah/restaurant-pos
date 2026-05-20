from flask import Blueprint, request, jsonify
from models import orders
from datetime import datetime

reports_bp = Blueprint('reports', __name__)

# Get daily sales report
@reports_bp.route('/api/reports/daily', methods=['GET'])
def daily_report():
    today = datetime.now().strftime("%Y-%m-%d")
    today_orders = [o for o in orders if o['created_at'].startswith(today)]

    total_sales = sum(o['total'] for o in today_orders)
    total_orders = len(today_orders)

    return jsonify({
        "date": today,
        "total_orders": total_orders,
        "total_sales": total_sales,
        "orders": today_orders
    })

# Get weekly sales report
@reports_bp.route('/api/reports/weekly', methods=['GET'])
def weekly_report():
    all_orders = orders
    total_sales = sum(o['total'] for o in all_orders)
    total_orders = len(all_orders)

    return jsonify({
        "total_orders": total_orders,
        "total_sales": total_sales,
        "orders": all_orders
    })

# Get sales by payment method
@reports_bp.route('/api/reports/payment-methods', methods=['GET'])
def payment_methods_report():
    cash = sum(o['total'] for o in orders if o['payment_method'] == 'cash')
    card = sum(o['total'] for o in orders if o['payment_method'] == 'card')
    momo = sum(o['total'] for o in orders if o['payment_method'] == 'momo')

    return jsonify({
        "cash": cash,
        "card": card,
        "momo": momo
    })