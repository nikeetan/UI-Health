import React from "react";
import { Form, Input, Button, message, Select } from "antd";
import ApiService from "../../services/ApiService";
import { useNavigate } from "react-router-dom";
const { Option } = Select;

const SignUpPatient = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      await ApiService.createPatient(values);
      message.success("Patient registered successfully");
      form.resetFields();
      navigate("/");
    } catch (error) {
      message.error("An error occurred during registration");
    }
  };

  return (
    <div>
      <h2>Register for UI Health</h2>
      <Form
        form={form}
        onFinish={onFinish}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ width: "400px" }}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="First Name"
          name="First_Name"
          rules={[{ required: true, message: "Please input your first name!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Middle Name"
          name="Middle_Initial"
          rules={[
            { required: true, message: "Please input your Middle name!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Last Name"
          name="Last_Name"
          rules={[{ required: true, message: "Please input your last name!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Age"
          name="Age"
          rules={[{ required: true, message: "Please input your age!" }]}
        >
          <Input type="number" />
        </Form.Item>

        <Form.Item
          label="Gender"
          name="Gender"
          rules={[{ required: true, message: "Please select your gender!" }]}
        >
          <Select placeholder="Select gender">
            <Option value="Male">Male</Option>
            <Option value="Female">Female</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Race"
          name="Race"
          rules={[{ required: true, message: "Please input your race!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Occupation Class"
          name="Occupation_Class"
          rules={[
            { required: true, message: "Please input your occupation class!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Medical History"
          name="Medical_History_Description"
          rules={[
            {
              required: true,
              message: "Please input your medical history description!",
            },
          ]}
        >
          <Input.TextArea />
        </Form.Item>

        <Form.Item
          label="Phone Number"
          name="Phone_Number"
          rules={[
            { required: true, message: "Please input your phone number!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Address"
          name="Address"
          rules={[{ required: true, message: "Please input your address!" }]}
        >
          <Input.TextArea />
        </Form.Item>

        <Form.Item
          label="Username"
          name="username"
          initialValue=""
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          initialValue=""
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Sign Up
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SignUpPatient;
