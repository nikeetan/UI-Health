from flask import Blueprint
from flask import Flask, jsonify, render_template, request, url_for, redirect
from model import Vaccine, db
from datetime import time

admin_bp = Blueprint('admin', __name__)
from model import User, Nurse, Patient

@admin_bp.route('/nurse', methods=['POST'])
def create_nurse():
    try:
        data = request.json
        email = data['email']
        if not email:
                return jsonify({'error': 'Email is required'}), 400

        first_name = data.get('First_Name')
        middle_initial = data.get('Middle_Initial')
        employee_id = data.get('EmployeeID')
        last_name = data.get('Last_Name')
        age = data.get('Age')
        gender = data.get('Gender')
        phone_number = data.get('Phone_Number')
        address = data.get('Address')
        nurse_username = data.get('username')
        nurse_password = data.get('password')

        new_user = User(username=nurse_username, email=email, role_id = 2)
        new_user.set_password(nurse_password)  # Set the password using the set_password method
        db.session.add(new_user)
        db.session.commit()

        new_nurse = Nurse(
            EmployeeID=employee_id,
            First_Name=first_name,
            Middle_Initial=middle_initial,
            Last_Name=last_name,
            Age=age,
            Gender=gender,
            Phone_Number=phone_number,
            Address=address,
            user_id=new_user.id
        )
        db.session.add(new_nurse)
        db.session.commit()
        return jsonify({'message': 'Nurse registered successfully','statusCode': 200})
    
    except Exception as e:
        print(f"Error creating nurse: {str(e)}")
        db.session.rollback()
        return jsonify({'error': 'Internal Server Error'}), 500

@admin_bp.route('/nurse/<int:id>', methods=['PUT'])
def update_nurse(id):
    try:
        nurse = Nurse.query.get(id)
        if nurse:
            data = request.json
            nurse.First_Name = data.get('First_Name')
            nurse.Middle_Initial = data.get('Middle_Initial')
            nurse.Last_Name = data.get('Last_Name')
            nurse.Age = data.get('Age')
            nurse.Gender = data.get('Gender')
            db.session.commit()
            return jsonify({'message': 'Nurse updated successfully', 'statusCode': 200})
        return {'message': 'Nurse not found'}, 404
    except Exception as e:
        print(f"Error updating nurse: {str(e)}")
        db.session.rollback()
        return jsonify({'error': 'Internal Server Error'}), 500
    
@admin_bp.route('/patient/<int:patient_id>', methods=['GET'])
def get_patient(patient_id):
    try:
        patient = Patient.query.get(patient_id)

        if patient:
            patient_data = {
                'SSN': patient.SSN,
                'First_Name': patient.First_Name,
                'Middle_Initial': patient.Middle_Initial,
                'Last_Name': patient.Last_Name,
                'Age': patient.Age,
                'Gender': patient.Gender,
                'Race': patient.Race,
                'Occupation_Class': patient.Occupation_Class,
                'Medical_History_Description': patient.Medical_History_Description,
                'Phone_Number': patient.Phone_Number,
                'Address': patient.Address,
                'user_id': patient.user_id
            }

            return jsonify(patient_data)
        else:
            return jsonify({'error': 'Patient not found'}), 404

    except Exception as e:
        print(f"Error getting patient: {str(e)}")
        return jsonify({'error': 'Internal Server Error'}), 500
    
@admin_bp.route('/vaccines', methods=['GET'])
def get_vaccines():
    try:
        vaccines = Vaccine.query.all()
        vaccine_list = []
        for vaccine in vaccines:
            vaccine_data = {
                'VaccineID': vaccine.VaccineID,
                'Name': vaccine.Name,
                'Company': vaccine.Company,
                'Number_of_Doses': vaccine.Number_of_Doses,
                'Description': vaccine.Description,
                'Availability': vaccine.Availability,
                'OnHold': vaccine.OnHold
            }
            vaccine_list.append(vaccine_data)
        return jsonify(vaccine_list)

    except Exception as e:
        print(f"Error getting vaccines: {str(e)}")
        return jsonify({'error': 'Internal Server Error'}), 500
    
@admin_bp.route('/patient-info/<int:patient_id>', methods=['GET'])
def get_patient_info(patient_id):
    try:
        patient = Patient.query.get(patient_id)

        if not patient:
            return jsonify({'error': 'Patient not found'}), 404

        patient_info = {
            'SSN': patient.SSN,
            'First_Name': patient.First_Name,
            'Middle_Initial': patient.Middle_Initial,
            'Last_Name': patient.Last_Name,
            'Age': patient.Age,
            'Gender': patient.Gender,
            'Race': patient.Race,
            'Occupation_Class': patient.Occupation_Class,
            'Medical_History_Description': patient.Medical_History_Description,
            'Phone_Number': patient.Phone_Number,
            'Address': patient.Address,
            'user_id': patient.user_id
            }

        scheduled_times = []
        for schedule in patient.vaccination_schedules:
            if schedule.Status == "Scheduled":
                scheduled_times.append({
                    'ScheduleID': schedule.ScheduleID,
                    'VaccineName': schedule.vaccine.Name,
                    'Date': schedule.time_slot.Date.strftime('%Y-%m-%d'),
                    'StartTime': schedule.time_slot.StartTime.strftime('%H:%M:%S'),
                    'EndTime': schedule.time_slot.EndTime.strftime('%H:%M:%S'),
                    'Status': schedule.Status,
                    'DoseNumber': schedule.DoseNumber
                })

        vaccination_history = []
        for record in patient.vaccination_records:
            vaccination_history.append({
                'RecordID': record.RecordID,
                'VaccineName': record.vaccine.Name,
                'TimeSlotID': record.TimeSlotID,
                'DoseNumber': record.DoseNumber,
                'status': 'Completed',
                'Vaccination_Time': record.Vaccination_Time.strftime('%Y-%m-%d %H:%M:%S')
            })

        result = {
            'patient_info': patient_info,
            'scheduled_times': scheduled_times,
            'vaccination_history': vaccination_history
        }

        return jsonify(result)

    except Exception as e:
        print(f"Error getting patient information: {str(e)}")
        return jsonify({'error': 'Internal Server Error'}), 500
    
@admin_bp.route('/nurse', methods=['GET'])
def get_all_nurses():
    nurses = Nurse.query.all()
    nurse_list = []

    for nurse in nurses:
        nurse_data = {
            'EmployeeID': nurse.EmployeeID,
            'Name':  f"{nurse.First_Name} {nurse.Middle_Initial or ''} {nurse.Last_Name}",
            'Age': nurse.Age,
            'Gender': nurse.Gender,
            'Phone_Number': nurse.Phone_Number,
            'Address': nurse.Address
        }
        nurse_list.append(nurse_data)

    return jsonify(nurse_list)


@admin_bp.route('/nurse/<int:nurse_id>', methods=['GET'])
def get_nurse(nurse_id):
    # Fetch nurse information from the database by EmployeeID
    nurse = Nurse.query.get(nurse_id)

    if nurse:
        schedule_info=[]
        for schedule in nurse.nurse_schedule:
            data = {
                'Time_slot_id': schedule.TimeSlotDetails.SlotID,
                'Date': schedule.TimeSlotDetails.Date,
                'StartTime':schedule.TimeSlotDetails.StartTime.strftime("%H:%M:%S"),
                'EndTime': schedule.TimeSlotDetails.EndTime.strftime("%H:%M:%S"),
            }
            schedule_info.append(data)

        nurse_info = {
            'EmployeeID': nurse.EmployeeID,
            'First_Name': nurse.First_Name,
            'Middle_Initial': nurse.Middle_Initial,
            'Last_Name': nurse.Last_Name,
            'Age': nurse.Age,
            'Gender': nurse.Gender,
            'Phone_Number': nurse.Phone_Number,
            'Address': nurse.Address,
            'schedules': schedule_info,
        }
        return jsonify(nurse_info)
    else:
        return jsonify({'error': 'Nurse not found'}), 404

@admin_bp.route('/nurse/<int:nurse_id>',methods=['DELETE'])
def delete_nurse(nurse_id):
    nurse = Nurse.query.get(nurse_id)
    user = nurse.user
    if nurse:
        db.session.delete(nurse)
        db.session.commit()
    if user:
        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': 'Nurse deleted successfully'}), 200
    else:
        return jsonify({'error': 'Nurse not found'}), 404

@admin_bp.route('/patients', methods=['GET'])
def get_all_patients():
    patients = Patient.query.all()
    patient_list = []

    for patient in patients:
        patient_data = {
            'SSN': patient.SSN,
            'First_Name': patient.First_Name,
            'Middle_Initial': patient.Middle_Initial,
            'Last_Name': patient.Last_Name,
            'Age': patient.Age,
            'Gender': patient.Gender,
            'Race': patient.Race,
            'Occupation_Class': patient.Occupation_Class,
            'Medical_History_Description': patient.Medical_History_Description,
            'Phone_Number': patient.Phone_Number,
            'Address': patient.Address
        }
        patient_list.append(patient_data)

    return jsonify(patient_list)


@admin_bp.route('/vaccine/add', methods=['POST'])
def add_vaccine():
    data = request.get_json()

    name = data.get('Name')
    company = data.get('Company')
    number_of_doses = data.get('Number_of_Doses')
    description = data.get('Description')
    availability = data.get('Availability', 0)
    on_hold = data.get('OnHold', 0)

    new_vaccine = Vaccine(
        Name=name,
        Company=company,
        Number_of_Doses=number_of_doses,
        Description=description,
        Availability=availability,
        OnHold=on_hold
    )
    db.session.add(new_vaccine)
    db.session.commit()
    return jsonify({'message': 'Vaccine added successfully','statusCode': 200})

@admin_bp.route('/update_vaccine/<int:vaccine_id>', methods=['PUT'])
def update_vaccine(vaccine_id):
    try:
        vaccine = Vaccine.query.get(vaccine_id)
        if vaccine:
            data = request.json
            vaccine.Availability = data.get('Availability', 0)
            vaccine.OnHold = data.get('OnHold', 0)
            vaccine.Name = data.get('Name')
            vaccine.Company = data.get('Company')
            vaccine.Number_of_Doses = data.get('Number_of_Doses')
            vaccine.Description = data.get('Description')
            db.session.commit()
            return jsonify({'message': 'Vaccine updated successfully'})
        return {'message': 'Vaccine not found'}, 404
    except Exception as e:
        print(f"Error updating Vaccine: {str(e)}")
        db.session.rollback()
        return jsonify({'error': 'Internal Server Error'}), 500
    
@admin_bp.route('/vaccine/<int:vaccine_id>', methods=['GET'])
def get_vaccine(vaccine_id):
    try:
        vaccine = Vaccine.query.get(vaccine_id)
        if vaccine:
            vaccine_data = {
                'VaccineID': vaccine.VaccineID,
                'Name': vaccine.Name,
                'Company': vaccine.Company,
                'Number_of_Doses': vaccine.Number_of_Doses,
                'Description': vaccine.Description,
                'Availability': vaccine.Availability,
                'OnHold': vaccine.OnHold
            }
        return jsonify(vaccine_data)

    except Exception as e:
        print(f"Error getting vaccine: {str(e)}")
        return jsonify({'error': 'Internal Server Error'}), 500