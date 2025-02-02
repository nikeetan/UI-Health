from flask import Blueprint
from flask import Flask, jsonify, render_template, request, url_for, redirect
from model import VaccinationSchedule, Vaccine, db
from datetime import time

nurse_bp = Blueprint('nurse', __name__)
from model import User, Nurse, Patient, TimeSlot, NurseSchedule, VaccinationRecord

@nurse_bp.route('/nurseAction/nurse/<int:id>', methods=['PUT'])
def update_nurse(id):
    try:
        nurse = Nurse.query.get(id)
        if nurse:
            data = request.json
            nurse.Address = data.get('Address')
            nurse.Phone_Number = data.get('Phone_Number')
            db.session.commit()
            return jsonify({'message': 'Nurse updated successfully'})
        return {'message': 'Nurse not found'}, 404
    except Exception as e:
        print(f"Error updating nurse: {str(e)}")
        db.session.rollback()
        return jsonify({'error': 'Internal Server Error'}), 500
    
@nurse_bp.route('/nurseAction/schedule-time', methods=['POST'])
def schedule_time():
    try:
        data = request.json
        nurse_id = data.get('nurse_id')
        time_slot_id = data.get('time_slot_id')

        nurse = Nurse.query.get(nurse_id)
        time_slot = TimeSlot.query.get(time_slot_id)

        if nurse is None or time_slot is None:
            return jsonify({'message': 'Invalid nurse or time slot'}), 400

        if len(time_slot.nurse_schedule) < 12:
            if not any(schedule.NurseEmployeeID == nurse_id for schedule in time_slot.nurse_schedule):
                nurse_schedule = NurseSchedule(NurseEmployeeID=nurse_id, TimeSlotID=time_slot_id)
                db.session.add(nurse_schedule)
                db.session.commit()
                return jsonify({'message': 'Nurse scheduled successfully'})
            else:
                return jsonify({'message': 'Nurse is already scheduled for this time slot'}), 400
        else:
            return jsonify({'message': 'Time slot is full, cannot schedule more nurses'}), 400

    except Exception as e:
        print(f"Error scheduling time: {str(e)}")
        db.session.rollback()
        return jsonify({'error': 'Internal Server Error'}), 500
    
@nurse_bp.route('/nurseAction/<int:nurse_id>/patient-info/<int:patient_id>', methods=['GET'])
def get_patient_info(nurse_id,patient_id):
    try:
        nurse = Nurse.query.get(nurse_id);
        patient = Patient.query.get(patient_id)

        if not patient:
            return jsonify({'error': 'Patient not found'}), 404
        if not nurse:
            return jsonify({'error': 'Nurse not found'}), 404

        patient_info = {
            'SSN': patient.SSN,
            'Name':  f"{patient.First_Name} {patient.Middle_Initial or ''} {patient.Last_Name}",
            'Age': patient.Age,
            'Gender': patient.Gender,
            }
        
        
        scheduled_times = []
        for schedule in patient.vaccination_schedules:
            if schedule.Status == "Scheduled":
                nurse_scheduled = any(
                    ns.NurseEmployeeID == nurse_id for ns in schedule.time_slot.nurse_schedule
                )
                if nurse_scheduled:
                    scheduled_times.append({
                        'ScheduleID': schedule.ScheduleID,
                        'VaccineName': schedule.vaccine.Name,
                        'VaccineId': schedule.VaccineID,
                        'TimeSlotID': schedule.TimeSlotID,
                        'DoseNumber': schedule.DoseNumber,
                        'Date': schedule.time_slot.Date.strftime('%Y-%m-%d'),
                        'StartTime': schedule.time_slot.StartTime.strftime('%H:%M:%S'),
                        'EndTime': schedule.time_slot.EndTime.strftime('%H:%M:%S'),
                    })

        result = {
            'patient_info': patient_info,
            'scheduled_times': scheduled_times
        }

        return jsonify(result)

    except Exception as e:
        print(f"Error getting patient information: {str(e)}")
        return jsonify({'error': 'Internal Server Error'}), 500

@nurse_bp.route('/nurseAction/record-vaccination', methods=['POST'])
def record_vaccination():
    try:
        data = request.json
        patient_ssn = data.get('patient_ssn')
        nurse_id = data.get('nurse_id')
        vaccine_id = data.get('vaccine_id')
        time_slot_id = data.get('time_slot_id')
        dose_number = data.get('dose_number')
        vaccination_time = data.get('vaccination_time')

        nurse = Nurse.query.get(nurse_id)
        patient = Patient.query.get(patient_ssn)
        vaccine = Vaccine.query.get(vaccine_id)
        time_slot = TimeSlot.query.get(time_slot_id)

        if None in (nurse, patient, vaccine, time_slot):
            return jsonify({'message': 'Invalid nurse, patient, vaccine, or time slot'}), 400

        vaccination_record = VaccinationRecord(
            PatientSSN=patient_ssn,
            NurseEmployeeID=nurse_id,
            VaccineID=vaccine_id,
            TimeSlotID=time_slot_id,
            DoseNumber=dose_number,
            Vaccination_Time=vaccination_time
        )

        db.session.add(vaccination_record)
        db.session.commit()

        vaccine.OnHold -= 1
        vaccine.Availability -= 1
        db.session.commit()

        vaccination_schedule = (
            VaccinationSchedule.query
            .filter_by(PatientSSN=patient_ssn, TimeSlotID=time_slot_id, VaccineID = vaccine_id, DoseNumber= dose_number)
            .first()
        )
        
        if vaccination_schedule:
            db.session.delete(vaccination_schedule)
            db.session.commit()

        return jsonify({'message': 'Vaccination recorded successfully'})

    except Exception as e:
        print(f"Error recording vaccination: {str(e)}")
        db.session.rollback()
        return jsonify({'error': 'Internal Server Error'}), 500

@nurse_bp.route('/nurseAction/nurse/<int:nurse_id>/timeslot/<int:timeslot_id>', methods=['DELETE'])
def cancel_nurse_timeslot(nurse_id, timeslot_id):
    nurse_schedule = NurseSchedule.query.filter_by(NurseEmployeeID=nurse_id, TimeSlotID=timeslot_id).first()

    if nurse_schedule:
        db.session.delete(nurse_schedule)
        db.session.commit()
        return jsonify({'message': 'Nurse schedule timeslot canceled successfully'})
    else:
        return jsonify({'error': 'Nurse schedule timeslot not found'}), 404

