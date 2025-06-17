from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import os
from datetime import datetime, timedelta
import jwt
import uuid

app = Flask(__name__)
# Configure CORS to allow requests from the frontend
# In production, this will accept requests from the Render-hosted frontend
# In development, we still allow localhost requests
CORS(app, resources={
    r"/api/*": {
        "origins": ["*"],  # Allow all origins in production
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Configure SQLite Database
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'blood_donor.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your-secret-key'  # Change this to a random secret key in production

db = SQLAlchemy(app)

# Models
class User(db.Model):
    id = db.Column(db.String(36), primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    phone_number = db.Column(db.String(20), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    donor = db.relationship('Donor', uselist=False, back_populates='user', cascade='all, delete-orphan')
    
    def __init__(self, **kwargs):
        if 'id' not in kwargs:
            kwargs['id'] = str(uuid.uuid4())
        super(User, self).__init__(**kwargs)

class Donor(db.Model):
    id = db.Column(db.String(36), primary_key=True)
    user_id = db.Column(db.String(36), db.ForeignKey('user.id'), nullable=False)
    blood_group = db.Column(db.String(5), nullable=False)
    last_donation_date = db.Column(db.Date, nullable=True)
    available_for_donation = db.Column(db.Boolean, default=True)
    consent_to_contact = db.Column(db.Boolean, default=True)
    latitude = db.Column(db.Float, nullable=True)
    longitude = db.Column(db.Float, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    user = db.relationship('User', back_populates='donor')
    
    def __init__(self, **kwargs):
        if 'id' not in kwargs:
            kwargs['id'] = str(uuid.uuid4())
        super(Donor, self).__init__(**kwargs)

# Create tables
with app.app_context():
    db.create_all()

# Authentication helper functions
def generate_token(user_id):
    payload = {
        'exp': datetime.utcnow() + timedelta(days=1),
        'iat': datetime.utcnow(),
        'sub': user_id
    }
    return jwt.encode(
        payload,
        app.config.get('SECRET_KEY'),
        algorithm='HS256'
    )

def token_required(f):
    from functools import wraps
    
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(" ")[1]
            except IndexError:
                return jsonify({'message': 'Token is missing'}), 401
        
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        try:
            payload = jwt.decode(token, app.config.get('SECRET_KEY'), algorithms=['HS256'])
            current_user_id = payload['sub']
            current_user = User.query.filter_by(id=current_user_id).first()
            
            if not current_user:
                return jsonify({'message': 'Invalid token: User not found'}), 401
            
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token'}), 401
        
        return f(current_user, *args, **kwargs)
    
    return decorated

# API Routes
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Check if user already exists
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'User already exists'}), 409
    
    # Create user
    hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256')
    
    new_user = User(
        first_name=data['firstName'],
        last_name=data['lastName'],
        email=data['email'],
        password_hash=hashed_password,
        phone_number=data['phoneNumber'],
        city=data['city']
    )
    
    db.session.add(new_user)
    
    # Create donor if applicable
    if data.get('isDonor'):
        try:
            last_donation_date = datetime.strptime(data['lastDonationDate'], '%Y-%m-%d').date() if data.get('lastDonationDate') else None
        except ValueError:
            last_donation_date = None
            
        new_donor = Donor(
            user_id=new_user.id,
            blood_group=data['bloodGroup'],
            last_donation_date=last_donation_date,
            available_for_donation=data.get('availableForDonation', False),
            consent_to_contact=data.get('consentToContact', False),
            latitude=data.get('latitude'),
            longitude=data.get('longitude')
        )
        
        db.session.add(new_donor)
    
    db.session.commit()
    
    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not check_password_hash(user.password_hash, data['password']):
        return jsonify({'message': 'Invalid email or password'}), 401
    
    token = generate_token(user.id)
    
    return jsonify({
        'token': token,
        'user': {
            'id': user.id,
            'firstName': user.first_name,
            'lastName': user.last_name,
            'email': user.email,
            'phoneNumber': user.phone_number,
            'city': user.city,
            'isDonor': bool(user.donor)
        }
    })

@app.route('/api/profile', methods=['GET'])
@token_required
def get_profile(current_user):
    user_data = {
        'id': current_user.id,
        'firstName': current_user.first_name,
        'lastName': current_user.last_name,
        'email': current_user.email,
        'phoneNumber': current_user.phone_number,
        'city': current_user.city,
        'isDonor': bool(current_user.donor)
    }
    
    if current_user.donor:
        donor = current_user.donor
        user_data['donor'] = {
            'bloodGroup': donor.blood_group,
            'lastDonationDate': donor.last_donation_date.strftime('%Y-%m-%d') if donor.last_donation_date else None,
            'availableForDonation': donor.available_for_donation,
            'consentToContact': donor.consent_to_contact,
            'latitude': donor.latitude,
            'longitude': donor.longitude
        }
    
    return jsonify(user_data)

@app.route('/api/donors', methods=['GET'])
def get_donors():
    blood_group = request.args.get('bloodGroup')
    city = request.args.get('city')
    
    query = db.session.query(Donor, User).join(User)
    
    if blood_group:
        query = query.filter(Donor.blood_group == blood_group)
    
    if city:
        query = query.filter(User.city.ilike(f'%{city}%'))
    
    query = query.filter(Donor.available_for_donation == True, Donor.consent_to_contact == True)
    
    results = query.all()
    donors_list = []
    
    for donor, user in results:
        donors_list.append({
            'id': donor.id,
            'name': f"{user.first_name} {user.last_name}",
            'bloodGroup': donor.blood_group,
            'location': user.city,
            'lastDonated': donor.last_donation_date.strftime('%Y-%m-%d') if donor.last_donation_date else None,
            'contactNumber': user.phone_number,
            'available': donor.available_for_donation,
            'coordinates': [donor.latitude, donor.longitude] if donor.latitude and donor.longitude else None
        })
    
    return jsonify(donors_list)

@app.route('/api/donor/<id>', methods=['GET'])
def get_donor(id):
    donor = Donor.query.filter_by(id=id).first()
    
    if not donor:
        return jsonify({'message': 'Donor not found'}), 404
    
    user = User.query.filter_by(id=donor.user_id).first()
    
    donor_data = {
        'id': donor.id,
        'name': f"{user.first_name} {user.last_name}",
        'bloodGroup': donor.blood_group,
        'location': user.city,
        'lastDonated': donor.last_donation_date.strftime('%Y-%m-%d') if donor.last_donation_date else None,
        'contactNumber': user.phone_number,
        'available': donor.available_for_donation
    }
    
    return jsonify(donor_data)

@app.route('/api/update-profile', methods=['PUT'])
@token_required
def update_profile(current_user):
    data = request.get_json()
    
    # Update user details
    if 'firstName' in data:
        current_user.first_name = data['firstName']
    if 'lastName' in data:
        current_user.last_name = data['lastName']
    if 'phoneNumber' in data:
        current_user.phone_number = data['phoneNumber']
    if 'city' in data:
        current_user.city = data['city']
    
    # Handle donor information
    if 'isDonor' in data:
        if data['isDonor'] and not current_user.donor:
            # Create new donor profile
            try:
                last_donation_date = datetime.strptime(data['lastDonationDate'], '%Y-%m-%d').date() if data.get('lastDonationDate') else None
            except ValueError:
                last_donation_date = None
                
            new_donor = Donor(
                user_id=current_user.id,
                blood_group=data['bloodGroup'],
                last_donation_date=last_donation_date,
                available_for_donation=data.get('availableForDonation', False),
                consent_to_contact=data.get('consentToContact', False),
                latitude=data.get('latitude'),
                longitude=data.get('longitude')
            )
            db.session.add(new_donor)
        
        elif current_user.donor:
            # Update existing donor profile
            if 'bloodGroup' in data:
                current_user.donor.blood_group = data['bloodGroup']
            if 'lastDonationDate' in data:
                try:
                    current_user.donor.last_donation_date = datetime.strptime(data['lastDonationDate'], '%Y-%m-%d').date()
                except ValueError:
                    pass
            if 'availableForDonation' in data:
                current_user.donor.available_for_donation = data['availableForDonation']
            if 'consentToContact' in data:
                current_user.donor.consent_to_contact = data['consentToContact']
            if 'latitude' in data and 'longitude' in data:
                current_user.donor.latitude = data['latitude']
                current_user.donor.longitude = data['longitude']
    
    db.session.commit()
    
    return jsonify({'message': 'Profile updated successfully'})

if __name__ == '__main__':
    app.run(debug=True)
