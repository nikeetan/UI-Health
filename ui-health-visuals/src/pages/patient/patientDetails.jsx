import React, { useState, useEffect } from "react";
import { Table, Spin, Button, message } from "antd";
import ApiService from "../../services/ApiService";
import AuthService from "../../services/AuthService";

const ViewPatientDetailsID = () => {
  const storedUser = AuthService.getUser();
  const patientId = storedUser?.entity_id;

  const [patientInfo, setPatientInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [schedule, setSchedules] = useState([]);
  const [vaccineHistory, setVaccineHistory] = useState([]);


  useEffect(() => {
    const fetchPatientInfo = async () => {
      try {
        const response = await ApiService.getPatientInfo(patientId);
        if (response) {
          setPatientInfo(response.patient_info);
          setSchedules(response.scheduled_times);
          setVaccineHistory(response.vaccination_history)
        }
      } catch (error) {
        console.error("Error fetching patient info:", error);
      }
    };

    if (patientId) {
      fetchPatientInfo();
    }
  }, [patientId]);

  const handleCancelSchedule = async (id) => {
    try {
        console.log(id);
      setLoading(true);
      await ApiService.cancelpatientSchedule(id);
      const updatedSchedules = schedule.filter((item) => {
        return item.ScheduleID !== id;
      });
      setSchedules(updatedSchedules);
      message.success("Schedule Deleted successfully");
    } catch (error) {
      console.error("Error canceling schedule:", error);
      message.error("Failed to cancel schedule");
    } finally {
      setLoading(false);
    }
  };

  if (!patientInfo) {
    return <Spin size="large" />;
  }

  const {
    SSN,
    First_Name,
    Middle_Initial,
    Last_Name,
    Age,
    Gender,
    Phone_Number,
    Address,
  } = patientInfo;

  const scheduleColumns = [
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
      title: "StartTime",
      dataIndex: "StartTime",
      key: "StartTime",
    },
    {
      title: "EndTime",
      dataIndex: "EndTime",
      key: "EndTime",
    },
    {
      title: "Action",
      key: "Action",
      render: (record) => (
        <Button
          type="primary"
          danger
          onClick={() => handleCancelSchedule(record.ScheduleID)}
          loading={loading}
        >
          Delete
        </Button>
      ),
    },
  ];

  const vaccinationHistoryColumns = [
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
      title: "Vaccination Time",
      dataIndex: "Vaccination_Time",
      key: "Vaccination_Time",
    },
  ];

  return (
    <>
      <div>
        <h2>Patient Information</h2>
        <div>
          <strong>Patient ID:</strong> {SSN}
        </div>
        <div>
          <strong>First Name:</strong> {First_Name}
        </div>
        <div>
          <strong>Middle Initial:</strong> {Middle_Initial}
        </div>
        <div>
          <strong>Last Name:</strong> {Last_Name}
        </div>
        <div>
          <strong>Age:</strong> {Age}
        </div>
        <div>
          <strong>Gender:</strong> {Gender}
        </div>
        <div>
          <strong>Phone Number:</strong> {Phone_Number}
        </div>
        <div>
          <strong>Address:</strong> {Address}
        </div>
      </div>
      <h2>Schedules</h2>
      <Table dataSource={schedule} columns={scheduleColumns} />

      <h2>Vaccination History</h2>
      <Table
        dataSource={vaccineHistory}
        columns={vaccinationHistoryColumns}
      />
    </>
  );
};

export default ViewPatientDetailsID;
