import { useEffect, useState } from "react";
import { Form, Input, Button, message, Spin, Select } from "antd";
import ApiService from "../../services/ApiService";
import AuthService from "../../services/AuthService";
import { useNavigate } from "react-router-dom";
import { Option } from "antd/es/mentions";

const showSuccessMessage = () => {
  message.success("Patient Information Updated successfully!");
};

const UpdatePatient = () => {
  const navigate = useNavigate();
  const storedUser = AuthService.getUser();
  const ssn = storedUser?.entity_id;
  const [patient, setPatient] = useState([]);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const response = await ApiService.getPatientInfo(ssn);
        const patientDetails = response.patient_info;
        setPatient(patientDetails);
        form.setFieldsValue({
          First_Name: patientDetails?.First_Name,
          Middle_Initial: patientDetails?.Middle_Initial,
          Last_Name: patientDetails?.Last_Name,
          Age: patientDetails?.Age,
          Gender: patientDetails?.Gender,
          Race: patientDetails?.Race,
          Occupation_Class: patientDetails?.Occupation_Class,
          Medical_History_Description:
            patientDetails?.Medical_History_Description,
          Phone_Number: patientDetails?.Phone_Number,
          Address: patientDetails?.Address,
        });
      } catch (error) {
        console.error("Error fetching patient details:", error);
      }
    };

    fetchPatientDetails();
  }, [ssn, form]);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const updatedData = {
        First_Name: values.First_Name,
        Middle_Initial: values.Middle_Initial,
        Last_Name: values.Last_Name,
        Age: values.Age,
        Gender: values.Gender,
        Race: values.Race,
        Occupation_Class: values.Occupation_Class,
        Medical_History_Description: values.Medical_History_Description,
        Phone_Number: values.Phone_Number,
        Address: values.Address,
      };
      await ApiService.updatePatient(ssn, updatedData);
      showSuccessMessage();
      navigate("/patient");
    } catch (error) {
      message.error(
        error || "An Error Occurred During Updating Patient Information"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Update Patient Details</h1>
      <Spin spinning={loading} tip="Updating Patient Information...">
        {patient && (
          <Form
            form={form}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ width: "400px" }}
            name="updatePatientForm"
            onFinish={onFinish}
            initialValues={{
              First_Name: patient.First_Name,
              Middle_Initial: patient.Middle_Initial,
              Last_Name: patient.Last_Name,
              Age: patient.Age,
              Gender: patient.Gender,
              Race: patient.Race,
              Occupation_Class: patient.Occupation_Class,
              Medical_History_Description: patient.Medical_History_Description,
              Phone_Number: patient.Phone_Number,
              Address: patient.Address,
            }}
          >
            <Form.Item label="First Name" name="First_Name">
              <Input />
            </Form.Item>
            <Form.Item label="Middle Initial" name="Middle_Initial">
              <Input />
            </Form.Item>
            <Form.Item label="Last Name" name="Last_Name">
              <Input />
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
              <Input />
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
            <Form.Item label="Race" name="Race">
              <Input />
            </Form.Item>
            <Form.Item label="Occupation Class" name="Occupation_Class">
              <Input />
            </Form.Item>
            <Form.Item
              label="Medical History"
              name="Medical_History_Description"
            >
              <Input.TextArea />
            </Form.Item>
            <Form.Item
              label="Phone Number"
              name="Phone_Number"
              rules={[
                { required: true, message: "Phone Number is required" },
                {
                  pattern: /^\d{10}$/,
                  message: "Phone Number must be 10 digits",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Address"
              name="Address"
              rules={[{ required: true, message: "Address is required" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Update Patient
              </Button>
            </Form.Item>
          </Form>
        )}
      </Spin>
    </div>
  );
};

export default UpdatePatient;
