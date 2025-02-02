from flask import Blueprint
from flask import Flask, jsonify, render_template, request, url_for, redirect
from sqlalchemy import desc
from model import Vaccine, db
from datetime import time
from model import User, Nurse, Patient, TimeSlot, NurseSchedule, VaccinationRecord, VaccinationSchedule

patient_bp = Blueprint('patient', __name__)

@patient_bp.route('/patientAction/patient', methods=['POST'])
def create_patient():
    try:
        data = request.json
        email = data['email']
        if not email:
            return jsonify({'error': 'Email is required'}), 400

        first_name = data.get('First_Name')
        middle_initial = data.get('Middle_Initial')
        last_name = data.get('Last_Name')
        age = data.get('Age')
        gender = data.get('Gender')
        race = data.get('Race')
        occupation_class = data.get('Occupation_Class')
        medical_history_description = data.get('Medical_History_Description')
        phone_number = data.get('Phone_Number')
        address = data.get('Address')
        patient_username = data.get('username')
        patient_password = data.get('password')

        new_user = User(username=patient_username, email=email, role_id=3)
        new_user.set_password(patient_password)
        db.session.add(new_user)
        db.session.commit()

        new_patient = Patient(
            First_Name=first_name,
            Middle_Initial=middle_initial,
            Last_Name=last_name,
            Age=age,
            Gender=gender,
            Race=race,
            Occupation_Class=occupation_class,
            Medical_History_Description=medical_history_description,
            Phone_Number=phone_number,
            Address=address,
            user_id=new_user.id
        )

        db.session.add(new_patient)
        db.session.commit()

        return jsonify({'message': 'Patient registered successfully'})

    except Exception as e:
        print(f"Error creating patient: {str(e)}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@patient_bp.route('/patientAction/delete_scheduled_time/<int:id>', methods=['DELETE'])
def delete_scheduled_time(id):
    try:
        scheduled_vaccination = VaccinationSchedule.query.get(id)
        if scheduled_vaccination:
            vaccine = Vaccine.query.get(scheduled_vaccination.VaccineID)
            vaccine.OnHold -= 1
            db.session.commit()

            db.session.delete(scheduled_vaccination)
            db.session.commit()
            return jsonify({'message': 'Schedule appointment has been deleted successfully'}), 200
        else:
            return jsonify({'error': 'appointment not found'}), 404
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Exception occurred'}), 500
    
@patient_bp.route('/patientAction/schedule_vaccination', methods=['POST'])
def schedule_vaccination():
    try:
        data = request.json
        patient_ssn = data.get('patient_ssn')
        vaccine_id = data.get('vaccine_id')
        time_slot_id = data.get('time_slot_id')

        patient = Patient.query.get(patient_ssn)
        vaccine = Vaccine.query.get(vaccine_id)
        time_slot = TimeSlot.query.get(time_slot_id)

        existing_schedule = (
            db.session.query(VaccinationSchedule)
            .filter_by(
                PatientSSN=patient_ssn,
                TimeSlotID=time_slot_id,
                VaccineID = vaccine_id
            )
            .first()
        )

        if existing_schedule:
            return jsonify({'error': 'Patient already has a scheduled vaccination for the selected time slot'}), 400

        if None in (patient, vaccine, time_slot):
            return jsonify({'message': 'Invalid patient, vaccine, or time slot'}), 400

        max_capacity = min(10 * len(time_slot.nurse_schedule), 100)

        scheduled_patients_count = VaccinationSchedule.query.filter_by(TimeSlotID=time_slot_id).count()
        if scheduled_patients_count >= max_capacity:
            return jsonify({'error': 'Time slot is fully booked'}), 400
        
        if ((vaccine.Availability - vaccine.OnHold) <= 0 ):
            return jsonify({'error': 'No vaccine stock available'}), 400
        
        recent_vaccinated_record = (
            VaccinationRecord.query
            .filter_by(PatientSSN=patient_ssn)
            .order_by(desc(VaccinationRecord.DoseNumber))
            .first()
        )

        if not recent_vaccinated_record:
            recent_dose_number = 0
        else:
            recent_dose_number = recent_vaccinated_record.DoseNumber

        if (recent_dose_number+1 > vaccine.Number_of_Doses): 
            return jsonify({'error': 'You got vaccinated for required number of doses'}), 400
        
        vaccination_schedule = VaccinationSchedule(
            PatientSSN=patient_ssn,
            TimeSlotID=time_slot_id,
            VaccineID = vaccine_id,
            DoseNumber= recent_dose_number + 1,  # Assuming this is the first dose
            Status='Scheduled'
        )

        db.session.add(vaccination_schedule)
        db.session.commit()

        vaccine.OnHold += 1
        db.session.commit()

        return jsonify({'message': 'Vaccination scheduled successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@patient_bp.route('/patientAction/patient/<int:ssn>', methods=['PUT'])
def update_patient(ssn):
    patient = Patient.query.get(ssn)

    if not patient:
        return jsonify({'error': 'Patient not found'}), 404

    data = request.get_json()
    patient.First_Name = data.get('First_Name', patient.First_Name)
    patient.Middle_Initial = data.get('Middle_Initial', patient.Middle_Initial)
    patient.Last_Name = data.get('Last_Name', patient.Last_Name)
    patient.Age = data.get('Age', patient.Age)
    patient.Gender = data.get('Gender', patient.Gender)
    patient.Race = data.get('Race', patient.Race)
    patient.Occupation_Class = data.get('Occupation_Class', patient.Occupation_Class)
    patient.Medical_History_Description = data.get('Medical_History_Description', patient.Medical_History_Description)
    patient.Phone_Number = data.get('Phone_Number', patient.Phone_Number)
    patient.Address = data.get('Address')
    db.session.commit()

    return jsonify({'message': 'Patient information updated successfully'})

@patient_bp.route('/time-slots', methods=['GET'])
def get_all_time_slots():
    time_slots = TimeSlot.query.all()
    if time_slots:
        time_slot_info = []
        for slot in time_slots:
            data = {
                'SlotID': slot.SlotID,
                'Date': slot.Date.strftime("%Y-%m-%d"),
                'StartTime': slot.StartTime.strftime("%H:%M:%S"),
                'EndTime': slot.EndTime.strftime("%H:%M:%S"),
            }
            time_slot_info.append(data)
        return jsonify({'time_slots': time_slot_info})
    else:
        return jsonify({'message': 'No time slots available'}), 404

@patient_bp.route('/patient/time-slots', methods=['GET'])
def get_time_slots():
    time_slots = TimeSlot.query.all()
    if time_slots:
        time_slot_info = []
        for slot in time_slots:
            if len(slot.nurse_schedule) > 0:
                data = {
                    'SlotID': slot.SlotID,
                    'Date': slot.Date.strftime("%Y-%m-%d"),
                    'StartTime': slot.StartTime.strftime("%H:%M:%S"),
                    'EndTime': slot.EndTime.strftime("%H:%M:%S"),
                }
                time_slot_info.append(data)
        return jsonify({'time_slots': time_slot_info})
    else:
        return jsonify({'message': 'No time slots available'}), 404
