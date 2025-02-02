import { useEffect, useState } from "react";
import ApiService from "../../services/ApiService";
import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import AuthService from "../../services/AuthService";

const showSuccessMessage = () => {
  message.success("Nurse Information Updated successful!");
};

const UpdateNurse = () => {
  const navigate = useNavigate();
  const storedUser = AuthService.getUser()
  const id = storedUser?.entity_id
  const [nurse, setNurse] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchNurseDetails = async () => {
      try {
        const nurseDetails = await ApiService.getNurseById(id);
        setNurse(nurseDetails);
        form.setFieldsValue({
           First_Name: nurseDetails.First_Name,
           Middle_Initial: nurseDetails.Middle_Initial,
           Last_Name: nurseDetails.Last_Name,
           Age: nurseDetails.Age,
           Gender: nurseDetails.Gender,
          Phone_Number:nurseDetails.Phone_Number,
          Address:nurseDetails.Address
        });
      } catch (error) {
        console.error("Error fetching nurse details:", error);
      }
    };

    fetchNurseDetails();
  }, [id, form]);

  const onFinish = async (values) => {
    try {
        const updatedData = {
            Phone_Number: values.Phone_Number,
            Address: values.Address
          };
      await ApiService.updateDetails(id, updatedData);
      showSuccessMessage();
      navigate("/nurse");
    } catch (error) {
      message.error(
        error || "An Error Occured During Updating Nurse Information"
      );
    }
  };
  return (
    <div>
      <h1>Update Nurse Details</h1>
      {nurse && (
        <Form
          form={form}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ width: "400px" }}
          name="updateNurseForm"

          onFinish={onFinish}
        >
          <Form.Item label="Employee ID">
            <Input value={nurse.EmployeeID} disabled />
          </Form.Item>
          <Form.Item label="First Name">
            <Input value={nurse.First_Name} disabled />
          </Form.Item>

          <Form.Item label="Middle Initial" >
            <Input value={nurse.Middle_Initial}disabled />
          </Form.Item>
          <Form.Item label="Last Name">
            <Input value={nurse.Last_Name} disabled/>
          </Form.Item>
          <Form.Item label="Age">
            <Input value={nurse.Age} disabled/>
          </Form.Item>
          <Form.Item label="Gender">
            <Input value={nurse.Gender} disabled/>
          </Form.Item>
          <Form.Item label="Phone Number" name="Phone_Number" rules={[
            { required: true, message: "Phone Number is required" },
            { pattern: /^\d{10}$/, message: "Phone Number should be 10 digits" }
          ]}>
            <Input />
          </Form.Item>
          <Form.Item label="Address" name="Address" rules={[
            { required: true, message: "Address is required" }
          ]}>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update Nurse
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export default UpdateNurse;
