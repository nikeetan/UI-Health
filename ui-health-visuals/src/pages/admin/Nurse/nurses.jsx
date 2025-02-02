import React, { useState, useEffect } from 'react';
import { Spin } from 'antd';
import { Table, Button, Space,message } from 'antd';
import { Link } from 'react-router-dom';
import ApiService from '../../../services/ApiService';

const NurseList = () => {
  const [loading, setLoading] = useState(false);
  const [nurses, setNurses] = useState([]);

  useEffect(() => {
    const fetchNurses = async () => {
      setLoading(true);
      try {
        const data = await ApiService.getAllNurses();
        setNurses(data);
      } catch (error) {
        console.error('Error fetching nurses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNurses();
  }, []);

  const handleDelete = async (id) => {
    try {
      await ApiService.deleteNurse(id);
      const updatedNurses = nurses.filter((nurse) => nurse.EmployeeID !== id);
      setNurses(updatedNurses);
      message.success("Nurse Deleted successfully!");

    } catch (error) {
    message.error("Error deleting nurse");
    }
  };

  const columns = [
    {
      title: 'Employee ID',
      dataIndex: 'EmployeeID',
      key: 'EmployeeID',
    },
    {
      title: 'Name',
      dataIndex: 'Name',
      key: 'Name',
      render: (text, record) => (
        <Link to={`/admin/nurse/${record.EmployeeID}`}>{text}</Link>
      ),
    },
    {
      title: 'Age',
      dataIndex: 'Age',
      key: 'Age',
    },
    {
      title: 'Gender',
      dataIndex: 'Gender',
      key: 'Gender',
    },
    {
      title: 'Phone Number',
      dataIndex: 'Phone_Number',
      key: 'Phone_Number',
    },
    {
      title: 'Address',
      dataIndex: 'Address',
      key: 'Address',
    },
    {
        title: 'Actions',
        key: 'actions',
        render: (text, record) => (
          <Space size="middle">
            <Button type="primary">
              <Link to={`/admin/update-nurse/${record.EmployeeID}`}>Update</Link>
            </Button>
            <Button danger onClick={() => handleDelete(record.EmployeeID)}>
              Delete
            </Button>
          </Space>
        ),
      }
  ];

  return (
    <div>
      <h1>Nurse List</h1>
      <Spin spinning={loading}>
        <Table dataSource={nurses} columns={columns} />
      </Spin>
    </div>
  );
};

export default NurseList;
