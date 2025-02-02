from flask import Blueprint, request, jsonify
#from app.models.user import User
from model import User
from app import db

user_bp = Blueprint('user', __name__)

@user_bp.route('/user/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()
    if user and user.check_password(password):
        entity_id = None
        name = ['']
        if(user.role_id == 2):
            entity_id = user.nurses[0].EmployeeID
            name = f"{user.nurses[0].First_Name} {user.nurses[0].Middle_Initial or ''} {user.nurses[0].Last_Name}",

        elif user.role_id == 3:
            entity_id = user.patient[0].SSN
            name = f"{user.patient[0].First_Name} {user.patient[0].Middle_Initial or ''} {user.patient[0].Last_Name}",
            
        user_data = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'role_id': user.role_id,
            'entity_id': entity_id,
            'name': name[0]
        }
        return jsonify({'success':True,'user': user_data, 'message': 'Login successful'})
    else:
        return jsonify({'success':False,'error': 'Invalid username or password'}), 401

