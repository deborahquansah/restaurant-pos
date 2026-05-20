from flask import Flask
from flask_socketio import SocketIO
from flask_cors import CORS
from routes.auth import auth_bp
from routes.orders import orders_bp
from routes.inventory import inventory_bp
from routes.reports import reports_bp

app = Flask(__name__)
app.config['SECRET_KEY'] = 'restaurant-pos-secret-key'

CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# Register blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(orders_bp)
app.register_blueprint(inventory_bp)
app.register_blueprint(reports_bp)

@app.route('/')
def index():
    return 'Restaurant POS Backend is Running! 🍽️'

if __name__ == '__main__':
    socketio.run(app, debug=True)