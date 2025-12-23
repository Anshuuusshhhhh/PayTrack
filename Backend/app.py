from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import datetime
from sqlalchemy import func
from werkzeug.security import generate_password_hash, check_password_hash



# Initialize App
app = Flask(__name__)
CORS(app)

# CONFIGURATION (Change these to match your local MySQL)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:password@localhost/assignment_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'super-secret-key' # Change this in production

db = SQLAlchemy(app)
jwt = JWTManager(app)

# --- MODELS ---
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False) # In real life, hash this!
    balance = db.Column(db.Float, nullable=False, server_default="1000")

class AuditLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    receiver_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20), default="SUCCESS")

# --- ROUTES ---

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({"msg": "Username and password required"}), 400
        
    # Check if user already exists
    if User.query.filter_by(username=username).first():
        return jsonify({"msg": "Username already exists"}), 400
    
    # Create new user with a 'Welcome Bonus'
    hashed_password = generate_password_hash(password)
    new_user = User(username=username, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({"msg": "User created successfully! Please login."}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    # Simple check (In real life, verify hash)
    user = User.query.filter_by(username=data['username']).first()
    if user and check_password_hash(user.password, data['password']):
        token = create_access_token(identity=str(user.id))
        return jsonify(access_token=token)
    return jsonify({"msg": "Bad credentials"}), 401

# --- THE AI GENERATED BOILERPLATE FOR TRANSFER ---
@app.route('/transfer', methods=['POST'])
@jwt_required()
def transfer():
    current_user_id = int(get_jwt_identity())
    data = request.json
    receiver_id = data.get('receiver_id')
    amount = data.get('amount')

    if amount <= 0:
        return jsonify({"msg": "Amount must be positive"}), 400

    try:
        # START TRANSACTION
        # 1. Lock the Sender Row (prevent race conditions)
        sender = db.session.query(User).filter(User.id == current_user_id).with_for_update().first()
        
        # 2. Lock the Receiver Row
        receiver = db.session.query(User).filter(User.id == receiver_id).with_for_update().first()

        # 3. Validation
        if not sender or not receiver:
            db.session.rollback()
            return jsonify({"msg": "User not found"}), 404
        
        if sender.balance < amount:
            db.session.rollback()
            return jsonify({"msg": "Insufficient funds"}), 400

        # 4. Execute Transfer
        sender.balance -= amount
        receiver.balance += amount

        # 5. Write to Audit Log (Separate Table Approach)
        log = AuditLog(sender_id=sender.id, receiver_id=receiver.id, amount=amount)
        db.session.add(log)

        # 6. COMMIT EVERYTHING
        db.session.commit()
        
        return jsonify({
            "msg": "Transfer successful", 
            "new_balance": sender.balance,
            "tx_id": log.id
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Transaction failed", "error": str(e)}), 500

# --- HISTORY ENDPOINT ---
@app.route('/history', methods=['GET'])
@jwt_required()
def history():
    current_user_id = int(get_jwt_identity())
    # Fetch where user is sender OR receiver
    logs = AuditLog.query.filter(
        (AuditLog.sender_id == current_user_id) | (AuditLog.receiver_id == current_user_id)
    ).order_by(AuditLog.timestamp.desc()).all()
    
    output = []
    for log in logs:
        output.append({
            "id": log.id,
            "sender": log.sender_id,
            "receiver": log.receiver_id,
            "amount": log.amount,
            "timestamp": log.timestamp,
            "type": "SENT" if log.sender_id == current_user_id else "RECEIVED"
        })
    return jsonify(output)

@app.route('/dashboard-stats', methods=['GET'])
@jwt_required()
def dashboard_stats():
    current_user_id = int(get_jwt_identity())

    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404

    total_sent = db.session.query(
        func.coalesce(func.sum(AuditLog.amount), 0)
    ).filter(
        AuditLog.sender_id == current_user_id
    ).scalar()

    total_received = db.session.query(
        func.coalesce(func.sum(AuditLog.amount), 0)
    ).filter(
        AuditLog.receiver_id == current_user_id
    ).scalar()

    tx_count = db.session.query(
        func.count(AuditLog.id)
    ).filter(
        (AuditLog.sender_id == current_user_id) |
        (AuditLog.receiver_id == current_user_id)
    ).scalar()

    return jsonify({
        "username": user.username,
        "balance": round(user.balance, 2),
        "total_sent": round(total_sent, 2),
        "total_received": round(total_received, 2),
        "tx_count": tx_count
    })

if __name__ == '__main__':
    with app.app_context():
        db.create_all() # Creates tables if they don't exist
    app.run(debug=True)