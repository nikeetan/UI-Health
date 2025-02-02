import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ApiService from "../../../services/ApiService";
import { Form, Input, Button, message, Select } from "antd";
import { useNavigate } from "react-router-dom";
import { Option } from "antd/es/mentions";

const showSuccessMessage = () => {
  message.success("Nurse Information Updated successful!");
};

const NurseUpdate = () => {
  const navigate = useNavigate();
  const { id } = useParams();
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
        });
      } catch (error) {
        console.error("Error fetching nurse details:", error);
      }
    };

    fetchNurseDetails();
  }, [id, form]);

  const onFinish = async (values) => {
    try {
      await ApiService.updateNurse(id, values);
      showSuccessMessage();
      navigate("/admin/nurse");
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
          initialValues={{
            First_Name: nurse.First_Name,
            Middle_Initial: nurse.Middle_Initial,
            Last_Name: nurse.Last_Name,
            Age: nurse.Age,
            Gender: nurse.Gender,
          }}
          onFinish={onFinish}
        >
          <Form.Item label="Employee ID">
            <Input value={nurse.EmployeeID} disabled />
          </Form.Item>
          <Form.Item
            label="First Name"
            name="First_Name"
            rules={[{ required: true, message: "First Name is required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Middle Initial"
            name="Middle_Initial"
            rules={[{ required: true, message: "Middle Name is required" }]}
          >
            <Input maxLength={1} />
          </Form.Item>
          <Form.Item
            label="Last Name"
            name="Last_Name"
            rules={[{ required: true, message: "Last Name is required" }]}
          >
            <Input value={nurse.Last_Name} />
          </Form.Item>
          <Form.Item
            label="Age"
            name="Age"
            rules={[
              { required: true, message: "Age is Required" },
              {
                validator: (_, value) => {
                  const age = parseInt(value, 10);

                  if (age < 1 || age > 99) {
                    return Promise.reject("Age must be between 1 and 99");
                  }

                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input value={nurse.Age} type="number" min={1} max={99} />
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
          <Form.Item label="Phone Number">
            <Input value={nurse.Phone_Number} disabled />
          </Form.Item>
          <Form.Item label="Address">
            <Input value={nurse.Address} disabled />
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

export default NurseUpdate;
