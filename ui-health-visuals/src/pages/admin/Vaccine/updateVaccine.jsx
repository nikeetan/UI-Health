import React, { useState, useEffect } from "react";
import { Form, Input, Button, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import ApiService from "../../../services/ApiService";

const UpdateVaccine = () => {
  const navigate = useNavigate();
  const { vaccineId } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVaccineDetails = async () => {
      try {
        const response = await ApiService.getVaccineById(vaccineId);
        if (response) {
          form.setFieldsValue({
            Name: response.Name,
            Company: response.Company,
            Number_of_Doses: response.Number_of_Doses,
            Description: response.Description,
            Address: response.Address,
            Availability: response.Availability,
            OnHold: response.OnHold,
          });
        }
      } catch (error) {
        console.error("Error fetching vaccine details:", error);
      }
    };
    fetchVaccineDetails();
  }, [vaccineId, form]);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      await ApiService.updateVaccine(vaccineId, values);
      message.success("Vaccine details updated successfully");
      navigate("/admin/vaccines")
    } catch (error) {
      console.error("Error updating vaccine:", error);
      message.error("Failed to update vaccine details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Update Vaccine Details</h1>
      <Form
        form={form}
        onFinish={onFinish}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 12 }}
      >
        <Form.Item label="Name" name="Name">
          <Input />
        </Form.Item>
        <Form.Item label="Company" name="Company">
          <Input />
        </Form.Item>
        <Form.Item label="Number of Doses" name="Number_of_Doses">
          <Input />
        </Form.Item>
        <Form.Item label="Description" name="Description">
          <Input />
        </Form.Item>
        <Form.Item label="Availability" name="Availability">
          <Input />
        </Form.Item>
        <Form.Item label="On Hold" name="OnHold">
          <Input />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 6, span: 12 }}>
          <Button type="primary" htmlType="submit" loading={loading}>
            Update Vaccine
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UpdateVaccine;
