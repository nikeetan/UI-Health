import React, { useState, useEffect } from "react";
import { Table, Spin } from "antd";
import { useParams } from "react-router-dom";
import ApiService from "../../../services/ApiService";

const ViewNurse = () => {
  const { id } = useParams();
  const [nurseInfo, setNurseInfo] = useState(null);

  useEffect(() => {
    const fetchNurseInfo = async () => {
      try {
        const response = await ApiService.getNurseById(id);

        if (response) {
          setNurseInfo(response);
        }
      } catch (error) {
        console.error("Error fetching patient info:", error);
      }
    };

    if (id) {
      fetchNurseInfo();
    }
  }, [id]);

  if (!nurseInfo) {
    return <Spin size="large" />;
  }

  const {
    EmployeeID,
    First_Name,
    Middle_Initial,
    Last_Name,
    Age,
    Gender,
    Phone_Number,
    Address,
    schedules,
  } = nurseInfo;

  const scheduleColumns = [
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
  ];

  return (
    <>
      <div>
        <h2>Nurse Information</h2>
        <div>
          <strong>Employee ID:</strong> {EmployeeID}
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
      <Table dataSource={schedules} columns={scheduleColumns} />
    </>
  );
};

export default ViewNurse;
