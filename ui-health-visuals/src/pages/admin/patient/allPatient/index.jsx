import React, { useState, useEffect } from "react";
import { Table, Spin } from "antd";
import ApiService from "../../../../services/ApiService";
import { Link } from "react-router-dom";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchPatients = async () => {
      try {
        const response = await ApiService.getPatients();
        setPatients(response);
      } catch (error) {
        console.error("Error fetching vaccines:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const columns = [
    {
      title: "SSN",
      dataIndex: "SSN",
      key: "SSN",
    },
    {
      title: "First Name",
      dataIndex: "First_Name",
      key: "First_Name",
      render: (text, record) => (
        <Link to={`/admin/patient/${record.SSN}`}>{text}</Link>
      ),
    },
    {
      title: "Middle Initial",
      dataIndex: "Middle_Initial",
      key: "Middle_Initial",
    },
    {
      title: "Last Name",
      dataIndex: "Last_Name",
      key: "Last_Name",
    },
    {
      title: "Age",
      dataIndex: "Age",
      key: "Age",
    },
    {
      title: "Gender",
      dataIndex: "Gender",
      key: "Gender",
    },
    {
      title: "Race",
      dataIndex: "Race",
      key: "Race",
    },
    {
      title: "Occupation Class",
      dataIndex: "Occupation_Class",
      key: "Occupation_Class",
    },
    {
      title: "Medical History Description",
      dataIndex: "Medical_History_Description",
      key: "Medical_History_Description",
    },
    {
      title: "Phone Number",
      dataIndex: "Phone_Number",
      key: "Phone_Number",
    },
    {
      title: "Address",
      dataIndex: "Address",
      key: "Address",
    },
  ];

  return (
    <>
      <h1>Patients</h1>
      <Spin spinning={loading}>
        <Table
          dataSource={patients}
          columns={columns}
          rowKey={(record) => record.SSN}
        />
      </Spin>
    </>
  );
};

export default Patients;
