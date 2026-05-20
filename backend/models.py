from datetime import datetime

# Users (Cashier, Kitchen, Manager)
users = [
    {"id": 1, "name": "Admin", "username": "admin", "password": "admin123", "role": "manager"},
    {"id": 2, "name": "Cashier 1", "username": "cashier1", "password": "cashier123", "role": "cashier"},
    {"id": 3, "name": "Kitchen 1", "username": "kitchen1", "password": "kitchen123", "role": "kitchen"},
]

# Menu Items
menu_items = [
    {"id": 1, "name": "Jollof Rice", "price": 35.00, "category": "Main", "available": True},
    {"id": 2, "name": "Fried Rice", "price": 35.00, "category": "Main", "available": True},
    {"id": 3, "name": "Grilled Chicken", "price": 45.00, "category": "Main", "available": True},
    {"id": 4, "name": "Kelewele", "price": 15.00, "category": "Side", "available": True},
    {"id": 5, "name": "Malt", "price": 10.00, "category": "Drink", "available": True},
    {"id": 6, "name": "Water", "price": 5.00, "category": "Drink", "available": True},
]

# Orders
orders = []

# Inventory
inventory = [
    {"id": 1, "item": "Rice (kg)", "quantity": 50, "unit": "kg", "low_stock": 10},
    {"id": 2, "item": "Chicken (kg)", "quantity": 20, "unit": "kg", "low_stock": 5},
    {"id": 3, "item": "Cooking Oil (L)", "quantity": 15, "unit": "L", "low_stock": 3},
    {"id": 4, "item": "Malt (cans)", "quantity": 48, "unit": "cans", "low_stock": 10},
    {"id": 5, "item": "Water (bottles)", "quantity": 100, "unit": "bottles", "low_stock": 20},
]