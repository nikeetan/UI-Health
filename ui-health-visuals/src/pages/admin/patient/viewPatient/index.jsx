import React, { useState, useEffect } from "react";
import { Table, Spin } from "antd";
import { useParams } from "react-router-dom";
import ApiService from "../../../../services/ApiService";

const PatientInfo = () => {
  const { patientId } = useParams();
  const [patientInfo, setPatientInfo] = useState(null);

  useEffect(() => {
    const fetchPatientInfo = async () => {
      try {
        const response = await ApiService.getPatientInfo(patientId);

        if (response) {
          setPatientInfo(response);
        }
      } catch (error) {
        console.error("Error fetching patient info:", error);
      }
    };

    if (patientId) {
      fetchPatientInfo();
    }
  }, [patientId]);

  if (!patientInfo) {
    return <Spin size="large" />;
  }

  const {
    patient_info: {
      SSN,
      First_Name,
      Middle_Initial,
      Last_Name,
      Age,
      Gender,
      Race,
      Occupation_Class,
      Medical_History_Description,
      Phone_Number,
      Address,
    },
    scheduled_times,
    vaccination_history,
  } = patientInfo;

  const scheduledColumns = [
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
      title: "Status",
      dataIndex: "Status",
      key: "Status",
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
          <strong>SSN:</strong> {SSN}
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
          <strong>Race:</strong> {Race}
        </div>
        <div>
          <strong>Occupation Class:</strong> {Occupation_Class}
        </div>
        <div>
          <strong>Medical History Description:</strong>{" "}
          {Medical_History_Description}
        </div>
        <div>
          <strong>Phone Number:</strong> {Phone_Number}
        </div>
        <div>
          <strong>Address:</strong> {Address}
        </div>
      </div>
      <h2>Scheduled Times</h2>
      <Table dataSource={scheduled_times} columns={scheduledColumns} />

      <h2>Vaccination History</h2>
      <Table
        dataSource={vaccination_history}
        columns={vaccinationHistoryColumns}
      />
    </>
  );
};

export default PatientInfo;
