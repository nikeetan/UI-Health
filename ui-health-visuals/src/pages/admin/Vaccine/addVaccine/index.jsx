import React from "react";
import { Form, Input, InputNumber, Button, message } from "antd";
import ApiService from "../../../../services/ApiService";

const AddVaccineForm = () => {
  const [form] = Form.useForm();
  const onFinish = async (values) => {
    try {
      const response = await ApiService.addVaccine(values);
      if (response) {
        if (response.statusCode === 200) {
          message.success("Vaccine registered successfully");
          form.resetFields();
        } else {
          message.error(
            response.error || "An error occurred during registration"
          );
        }
      } else {
        message.error("An error occurred during registration");
      }
    } catch (error) {
      message.error("An error occurred during registration");
    }
  };
  return (
    <>
      <h1>Add Vaccine</h1>
      <Form
        form={form}
        name="addVaccineForm"
        onFinish={onFinish}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ width: "400px" }} // Adjust the width as needed
        initialValues={{ Availability: 0, OnHold: 0 }}
      >
        <Form.Item
          label="Name"
          name="Name"
          rules={[{ required: true, message: "Please enter the vaccine name" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Company"
          name="Company"
          rules={[{ required: true, message: "Please enter the company name" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Doses Required"
          name="Number_of_Doses"
          rules={[
            { required: true, message: "Please enter the Doses Required" },
            { type: "number", message: "Please enter a valid number" },
          ]}
        >
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item label="Description" name="Description">
          <Input.TextArea />
        </Form.Item>

        <Form.Item
          label="Availability"
          name="Availability"
          rules={[
            { type: "number", message: "Please enter a valid number" },
            { pattern: /^\d+$/, message: "Please enter a valid number" },
          ]}
        >
          <InputNumber min={0} />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Add Vaccine
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default AddVaccineForm;
