import React, { useState, useEffect } from "react";
import { Table, Spin, Button, message } from "antd";
import ApiService from "../../services/ApiService";
import AuthService from "../../services/AuthService";

const ViewNurseDetails = () => {
  const storedUser = AuthService.getUser();
  const nurseId = storedUser?.entity_id;

  const [nurseInfo, setNurseInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchNurseInfo = async () => {
      try {
        const response = await ApiService.getNurseById(nurseId);
        if (response) {
          setNurseInfo(response);
        }
      } catch (error) {
        console.error("Error fetching patient info:", error);
      }
    };

    if (nurseId) {
      fetchNurseInfo();
    }
  }, [nurseId]);

  const handleCancelSchedule = async (tId) => {
    try {
      setLoading(true);
      await ApiService.cancelNurseSchedule(nurseId, tId);
      const updatedSchedules = nurseInfo.schedules.filter((item) => {
        return item.Time_slot_id !== tId;
      });

      const NurseData = {
        ...nurseInfo,
        schedules: updatedSchedules,
      };
      setNurseInfo(NurseData);
      message.success("Schedule Deleted successfully");
    } catch (error) {
      console.error("Error canceling schedule:", error);
      message.error("Failed to cancel schedule");
    } finally {
      setLoading(false);
    }
  };

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
    {
      title: "Action",
      key: "Action",
      render: (record) => (
        <Button
          type="primary"
          danger
          onClick={() => handleCancelSchedule(record.Time_slot_id)}
          loading={loading}
        >
          Delete
        </Button>
      ),
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

export default ViewNurseDetails;
