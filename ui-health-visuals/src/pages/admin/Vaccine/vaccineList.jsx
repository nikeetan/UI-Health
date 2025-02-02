import React, { useState, useEffect } from "react";
import { Table, Space, Spin, Button } from "antd";
import ApiService from "../../../services/ApiService";
import { useNavigate } from "react-router-dom";

const VaccineList = () => {
  const [vaccines, setVaccines] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const fetchVaccines = async () => {
      try {
        const response = await ApiService.getVaccines();
        setVaccines(response);
      } catch (error) {
        console.error("Error fetching vaccines:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVaccines();
  }, []);

  const showUpdateModal = (vaccine) => {
    navigate(`/admin/vaccine/update/${vaccine.VaccineID}`);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "Name",
      key: "Name",
    },
    {
      title: "Company",
      dataIndex: "Company",
      key: "Company",
    },
    {
      title: "Number of Doses",
      dataIndex: "Number_of_Doses",
      key: "Number_of_Doses",
    },
    {
      title: "Description",
      dataIndex: "Description",
      key: "Description",
    },
    {
      title: "Availability",
      dataIndex: "Availability",
      key: "Availability",
    },
    {
      title: "On Hold",
      dataIndex: "OnHold",
      key: "OnHold",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => showUpdateModal(record)}>
            Update
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <h1>Vaccines</h1>
      <Spin spinning={loading}>
        <Table
          dataSource={vaccines}
          columns={columns}
          rowKey={(record) => record.VaccineID}
        />
      </Spin>
    </>
  );
};

export default VaccineList;
