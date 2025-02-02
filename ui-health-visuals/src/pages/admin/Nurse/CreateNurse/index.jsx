import React from "react";
import { Form, Input, Button, message, Select } from "antd";
import { Option } from "antd/es/mentions";
import ApiService from "../../../../services/ApiService";

const RegisterNurse = () => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
        const response = await ApiService.registerNurse(values);
        if (response) {
          if (response.statusCode === 200) {
            message.success("Nurse registered successfully");
            form.resetFields();
          } else {
            message.error(response.error || "An error occurred during registration");
          }
        } else {
          message.error("An error occurred during registration");
        }
      } catch (error) {
        message.error("An error occurred during registration");
      }
    };

  const validateConfirmPassword = ({ getFieldValue }) => ({
    validator(_, value) {
      if (!value || getFieldValue("password") === value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error("The two passwords do not match"));
    },
  });

  return (
    <>
      <h1>Register a Nurse</h1>
      <div>
        <Form
          form={form}
          name="registerNurseForm"
          onFinish={onFinish}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ width: "400px" }} // Adjust the width as needed
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Email is required" },
              { type: "email", message: "Please enter a valid email address" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="First Name"
            name="First_Name"
            rules={[{ required: true, message: "Fame is required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Middle Initial" name="Middle_Initial">
            <Input />
          </Form.Item>

          <Form.Item
            label="Employee ID"
            name="EmployeeID"
            rules={[{ required: true, message: "Employee SSN is required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Last Name" name="Last_Name">
            <Input />
          </Form.Item>

          <Form.Item label="Age" name="Age">
            <Input type="number" min={1} max={99} maxLength={2} />
          </Form.Item>

          <Form.Item
            label="Gender"
            name="Gender"
            rules={[{ required: true, message: "Gender is required" }]}
          >
            <Select placeholder="Select gender">
              <Option value="Male">Male</Option>
              <Option value="Female">Female</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="Phone_Number"
            rules={[
              {
                pattern: /^\d{10}$/,
                message: "Please enter a valid phone number",
              },
            ]}
          >
            <Input type="number" maxLength={10} />
          </Form.Item>

          <Form.Item label="Address" name="Address">
            <Input />
          </Form.Item>

          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Username is required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Password is required" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            rules={[
              { required: true, message: "Please confirm your password" },
              validateConfirmPassword,
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Register Nurse
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default RegisterNurse;
