import React, { useState } from "react";
import { Form, Input, Button, Alert, Tooltip } from "antd";
import AuthService from "../../services/AuthService";
import { Link } from "react-router-dom";

const Login = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onFinish = async (values) => {
    setLoading(true);
    const { username, password } = values;

    const { success, user, error } = await AuthService.login(
      username,
      password
    );

    if (success) {
      onLogin(user);
    } else {
      setError(error || "Invalid username or password");
    }

    setLoading(false);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div>
      <h1 className="welcome">Welcome to UI Health</h1>
      <h2>Login</h2>
      {error && <Alert message={error} type="error" showIcon />}
      <Form
        name="login-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ width: "400px" }}
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Login
          </Button>
          <span style={{ marginLeft: "10px" }}>
            <Link to="/Signup">
              <Tooltip
                title={"Click here to Sign up for Patient only"}
                placement="right"
              >
                <Button type="primary">Signup</Button>
              </Tooltip>
            </Link>
          </span>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
