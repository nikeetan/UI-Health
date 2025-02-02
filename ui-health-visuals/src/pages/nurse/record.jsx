import React, { useState, useEffect } from "react";
import { Select, Table, Space, Button, message } from "antd";
import AuthService from "../../services/AuthService";
import ApiService from "../../services/ApiService";

const { Option } = Select;

const VaccinationRecord = () => {
  const storedUser = AuthService.getUser();
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [vaccinationDetails, setVaccinationDetails] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await ApiService.getPatients();
        setPatients(response);
      } catch (error) {
        message.error("An error occurred while fetching patients");
      }
    };

    fetchPatients();
  }, []);

  const handleVaccinationRecord = async (scheduleID) => {
    try {
      const selectedVaccination = vaccinationDetails.find(
        (item) => item.ScheduleID === scheduleID
      );

      if (!selectedVaccination) {
        message.error("Selected vaccination details not found");
        return;
      }

      const { VaccineId, TimeSlotID, DoseNumber } = selectedVaccination;
      const patientSSN = selectedPatient.SSN;
      const nurseID = storedUser?.entity_id;
      const now = new Date();
      const vaccinationTime = `${now.toISOString().slice(0, 19).replace("T", " ")}`;
      const payload = {
        patient_ssn: patientSSN,
        nurse_id: nurseID,
        vaccine_id: VaccineId,
        time_slot_id: TimeSlotID,
        dose_number: DoseNumber,
        vaccination_time: vaccinationTime,
      };
      const response = await ApiService.recordVaccination(payload);
      const updatedSchedule = vaccinationDetails.filter((item)=>item.ScheduleID !== scheduleID)
      setVaccinationDetails(updatedSchedule);
      message.success(response.message);
    } catch (error) {
      message.error(error || "An error occurred while recording vaccination");
    }
  };

  const handlePatientSelect = async (value) => {
    try {
      const response = await ApiService.getPatientDetailsWithNurse(
        storedUser?.entity_id,
        value
      );
      setVaccinationDetails(response.scheduled_times);
      setSelectedPatient(response.patient_info);
    } catch (error) {
      message.error("An error occurred while fetching vaccination details");
    }
  };

  const columns = [
    {
      title: "Vaccine Name",
      dataIndex: "VaccineName",
      key: "VaccineName",
    },
    {
      title: "Dose Number",
      dataIndex: "DoseNumber",
      key: "DoseNumber",
    },
    {
      title: "Date",
      dataIndex: "Date",
      key: "Date",
    },
    {
      title: "Start Time",
      dataIndex: "StartTime",
      key: "StartTime",
    },
    {
      title: "End Time",
      dataIndex: "EndTime",
      key: "EndTime",
    },
    {
      title: "Action",
      key: "action",
      render: (record) => (
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => handleVaccinationRecord(record.ScheduleID)}
          >
            Record Vaccination
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h1>Record a vaccination</h1>
      <div>
        <h3>Patient:</h3>
        <Select
          style={{ width: 200, marginBottom: 16 }}
          placeholder="Select a patient"
          onChange={handlePatientSelect}
        >
          {patients.map((patient) => (
            <Option key={patient.SSN} value={patient.SSN}>
              {`${patient.First_Name} ${patient.Middle_Initial || ""} ${
                patient.Last_Name
              }`}
            </Option>
          ))}
        </Select>
      </div>

      {selectedPatient && (
        <div>
          <h2>Patient Information</h2>
          <p>
            <strong>SSN:</strong> {selectedPatient.SSN}
          </p>
          <p>
            <strong>Name:</strong> {selectedPatient.Name}
          </p>
          <p>
            <strong>Age:</strong> {selectedPatient.Age}
          </p>
          <p>
            <strong>Gender:</strong> {selectedPatient.Gender}
          </p>
        </div>
      )}

      <h2>Vaccination Details</h2>
      <Table columns={columns} dataSource={vaccinationDetails} />
    </div>
  );
};

export default VaccinationRecord;
