# models.py
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum, Time
from sqlalchemy.orm import relationship
from sqlalchemy import DateTime
from flask_bcrypt import Bcrypt 

db = SQLAlchemy()
bcrypt = Bcrypt()

class Role(db.Model):
    __tablename__ = 'role'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)

class User(db.Model):
    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    role_id = db.Column(db.Integer, db.ForeignKey('role.id'), nullable=False)
    password = db.Column(db.String(60), nullable=False)  # Store hashed passwords
    nurses = relationship('Nurse', back_populates='user') 
    patient = relationship('Patient', back_populates='user') 

    def set_password(self, password):
        self.password = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password, password)
    
class Vaccine(db.Model):
    __tablename__ = 'vaccine'

    VaccineID = Column(Integer, primary_key=True)
    Name = Column(String(80), nullable=False)
    Company = Column(String(120))
    Number_of_Doses = Column(Integer, nullable=False)
    Description = Column(String(255))
    Availability = Column(Integer, default=0)
    OnHold = Column(Integer, default=0)

# Define the Nurse model.
class Nurse(db.Model):
    __tablename__ = 'nurse'

    EmployeeID = Column(Integer, primary_key=True)
    First_Name = Column(String(80), nullable=False)
    Middle_Initial = Column(String(1))
    Last_Name = Column(String(80), nullable=False)
    Age = Column(Integer)
    Gender = Column(String(10))
    Phone_Number = Column(String(20))
    Address = Column(String(255))
    user_id = Column(Integer, ForeignKey('user.id'))
    user = relationship('User')
    nurse_schedule = relationship('NurseSchedule', back_populates='nurse') 

# Define the TimeSlot model.
class TimeSlot(db.Model):
    __tablename__ = 'time_slot'

    SlotID = Column(Integer, primary_key=True)
    Date = Column(DateTime)
    StartTime = Column(Time, nullable=False)
    EndTime = Column(Time, nullable=False)
    Maximum_Capacity = Column(Integer, default=100, nullable=False)
    nurse_schedule = relationship('NurseSchedule', back_populates='time_slot')

# Define the Patient model.
class Patient(db.Model):
    __tablename__ = 'patient'

    SSN = Column(Integer, primary_key=True)
    First_Name = Column(String(80), nullable=False)
    Middle_Initial = Column(String(1))
    Last_Name = Column(String(80), nullable=False)
    Age = Column(Integer)
    Gender = Column(String(10))
    Race = Column(String(30))
    Occupation_Class = Column(String(50))
    Medical_History_Description = Column(String(255))
    Phone_Number = Column(String(20))
    Address = Column(String(255))
    user_id = Column(Integer, ForeignKey('user.id'))
    user = relationship('User')
    vaccination_schedules = relationship('VaccinationSchedule', back_populates='patient')
    vaccination_records = relationship('VaccinationRecord', back_populates='patient')

# Define the VaccinationRecord model.
class VaccinationRecord(db.Model):
    __tablename__ = 'vaccination_record'

    RecordID = Column(Integer, primary_key=True)
    PatientSSN = Column(Integer, ForeignKey('patient.SSN'))
    NurseEmployeeID = Column(Integer, ForeignKey('nurse.EmployeeID'))
    VaccineID = Column(Integer, ForeignKey('vaccine.VaccineID'))
    TimeSlotID = Column(Integer, ForeignKey('time_slot.SlotID'))
    DoseNumber = Column(Integer, nullable=False)
    Vaccination_Time = Column(DateTime)
    patient = relationship('Patient', back_populates='vaccination_records')

    patient = relationship('Patient')
    nurse = relationship('Nurse')
    vaccine = relationship('Vaccine')
    time_slot = relationship('TimeSlot')

# Define the NurseSchedule model.
class NurseSchedule(db.Model):
    __tablename__ = 'nurse_schedule'

    ScheduleID = Column(Integer, primary_key=True)
    NurseEmployeeID = Column(Integer, ForeignKey('nurse.EmployeeID'))
    TimeSlotID = Column(Integer, ForeignKey('time_slot.SlotID'))
    TimeSlotDetails = relationship('TimeSlot', back_populates='nurse_schedule') 

    nurse = relationship('Nurse')
    time_slot = relationship('TimeSlot')

# Define the VaccinationSchedule model.
class VaccinationSchedule(db.Model):
    __tablename__ = 'vaccination_schedule'

    ScheduleID = Column(Integer, primary_key=True)
    PatientSSN = Column(Integer, ForeignKey('patient.SSN'))
    VaccineID = Column(Integer, ForeignKey('vaccine.VaccineID'))
    TimeSlotID = Column(Integer, ForeignKey('time_slot.SlotID'))
    DoseNumber = Column(Integer, nullable=False)
    Status = Column(Enum('Scheduled', 'Completed', 'Canceled'))
    patient = relationship('Patient', back_populates='vaccination_schedules')

    patient = relationship('Patient')
    vaccine = relationship('Vaccine')
    time_slot = relationship('TimeSlot')
